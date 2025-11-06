const express = require('express');
const router = express.Router();
const { requireAuth, requireOrganization } = require('../middleware/auth');
const { extractPriceAgreement, extractInvoice } = require('../services/claudeService');
const { compareInvoiceToContract, saveDiscrepancies } = require('../services/invoiceProcessor');
const { canProcessInvoice, incrementUsage } = require('../services/usageService');
const { sendDiscrepancyAlert, sendProcessingComplete } = require('../services/emailService');
const { query } = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');

/**
 * Upload and process a document (price agreement or invoice)
 */
router.post('/', requireAuth, requireOrganization, async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType } = req.body; // 'price_agreement' or 'invoice'
    const file = req.files.document;

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Allowed: PDF, PNG, JPG, Excel' 
      });
    }

    const organizationId = req.auth.organizationId;

    if (documentType === 'invoice') {
      // Check usage limits
      const usageCheck = await canProcessInvoice(organizationId);
      
      if (!usageCheck.allowed) {
        return res.status(402).json({
          error: 'Usage limit reached',
          message: `You've reached your ${usageCheck.planTier} plan limit of ${usageCheck.limit} invoices per month. Please upgrade to process more invoices.`,
          currentCount: usageCheck.currentCount,
          limit: usageCheck.limit,
          planTier: usageCheck.planTier,
          upgradeRequired: true
        });
      }
    }

    // Process based on document type
    if (documentType === 'price_agreement') {
      const result = await processPriceAgreement(file, organizationId);
      return res.json(result);
    } else if (documentType === 'invoice') {
      const result = await processInvoice(file, organizationId, req.auth.email, startTime);
      return res.json(result);
    } else {
      return res.status(400).json({ 
        error: 'Invalid document type. Must be "price_agreement" or "invoice"' 
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
});

/**
 * Process price agreement document
 */
async function processPriceAgreement(file, organizationId) {
  try {
    // Extract data with Claude
    const extraction = await extractPriceAgreement(file.tempFilePath, file.mimetype);

    if (!extraction.success) {
      throw new Error(`Extraction failed: ${extraction.error}`);
    }

    const data = extraction.data;

    // Find or create vendor
    let vendor;
    const vendorName = data.vendor?.name || 'Unknown Vendor';
    
    const { rows: existingVendors } = await query(
      'SELECT * FROM vendors WHERE organization_id = $1 AND LOWER(name) = LOWER($2) LIMIT 1',
      [organizationId, vendorName]
    );

    if (existingVendors.length > 0) {
      vendor = existingVendors[0];
    } else {
      const { rows: [newVendor] } = await query(
        `INSERT INTO vendors (organization_id, name, address, phone, email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          organizationId,
          vendorName,
          data.vendor?.address || null,
          data.vendor?.phone || null,
          data.vendor?.email || null
        ]
      );
      vendor = newVendor;
    }

    // Save price agreement
    const { rows: [priceAgreement] } = await query(
      `INSERT INTO price_agreements 
       (organization_id, vendor_id, effective_date, expiration_date, extracted_data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        organizationId,
        vendor.id,
        data.agreement?.effectiveDate || null,
        data.agreement?.expirationDate || null,
        JSON.stringify(extraction.data)
      ]
    );

    // Save line items
    if (data.lineItems && data.lineItems.length > 0) {
      for (const item of data.lineItems) {
        await query(
          `INSERT INTO price_agreement_items 
           (price_agreement_id, item_code, item_description, unit_price, unit_of_measure, category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            priceAgreement.id,
            item.itemCode || null,
            item.description,
            item.unitPrice,
            item.unitOfMeasure || null,
            item.category || null
          ]
        );
      }
    }

    // Update onboarding
    await query(
      `UPDATE user_onboarding 
       SET first_price_agreement_uploaded = true, step_completed = GREATEST(step_completed, 1)
       WHERE organization_id = $1`,
      [organizationId]
    );

    // Clean up temp file
    await fs.unlink(file.tempFilePath).catch(() => {});

    return {
      success: true,
      type: 'price_agreement',
      vendor: {
        id: vendor.id,
        name: vendor.name
      },
      priceAgreement: {
        id: priceAgreement.id,
        itemCount: data.lineItems?.length || 0,
        effectiveDate: data.agreement?.effectiveDate,
        expirationDate: data.agreement?.expirationDate
      },
      confidence: data.confidence
    };

  } catch (error) {
    console.error('Price agreement processing error:', error);
    throw error;
  }
}

/**
 * Process invoice document
 */
async function processInvoice(file, organizationId, userEmail, startTime) {
  try {
    // Extract data with Claude
    const extraction = await extractInvoice(file.tempFilePath, file.mimetype);

    if (!extraction.success) {
      throw new Error(`Extraction failed: ${extraction.error}`);
    }

    const data = extraction.data;

    // Find or create vendor
    let vendor;
    const vendorName = data.vendor?.name || 'Unknown Vendor';
    
    const { rows: existingVendors } = await query(
      'SELECT * FROM vendors WHERE organization_id = $1 AND LOWER(name) = LOWER($2) LIMIT 1',
      [organizationId, vendorName]
    );

    if (existingVendors.length > 0) {
      vendor = existingVendors[0];
      // Update vendor info if new data provided
      if (data.vendor) {
        await query(
          `UPDATE vendors SET address = COALESCE($1, address), 
           phone = COALESCE($2, phone), email = COALESCE($3, email), updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [data.vendor.address, data.vendor.phone, data.vendor.email, vendor.id]
        );
      }
    } else {
      const { rows: [newVendor] } = await query(
        `INSERT INTO vendors (organization_id, name, address, phone, email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          organizationId,
          vendorName,
          data.vendor?.address || null,
          data.vendor?.phone || null,
          data.vendor?.email || null
        ]
      );
      vendor = newVendor;
    }

    // Create invoice record
    const { rows: [invoice] } = await query(
      `INSERT INTO invoices 
       (organization_id, vendor_id, invoice_number, invoice_date, due_date, 
        total_amount, status, extracted_data)
       VALUES ($1, $2, $3, $4, $5, $6, 'processing', $7)
       RETURNING *`,
      [
        organizationId,
        vendor.id,
        data.invoice?.invoiceNumber || null,
        data.invoice?.invoiceDate || null,
        data.invoice?.dueDate || null,
        data.invoice?.totalAmount || 0,
        JSON.stringify(extraction.data)
      ]
    );

    // Save line items
    if (data.lineItems && data.lineItems.length > 0) {
      for (const item of data.lineItems) {
        await query(
          `INSERT INTO invoice_line_items 
           (invoice_id, organization_id, line_number, item_code, item_description, 
            quantity, unit_price, line_total, unit_of_measure)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            invoice.id,
            organizationId,
            item.lineNumber,
            item.itemCode || null,
            item.description,
            item.quantity,
            item.unitPrice,
            item.lineTotal,
            item.unitOfMeasure || null
          ]
        );
      }
    }

    // Compare against price agreement
    const comparison = await compareInvoiceToContract(data, vendor.id, organizationId);
    
    // Save discrepancies
    if (comparison.discrepancies.length > 0) {
      await saveDiscrepancies(invoice.id, comparison.discrepancies, organizationId);
    }

    const processingTime = Date.now() - startTime;

    // Update invoice with results
    await query(
      `UPDATE invoices 
       SET status = $1, has_discrepancies = $2, total_discrepancy_amount = $3, 
           processing_time_ms = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [
        comparison.discrepancies.length > 0 ? 'flagged' : 'completed',
        comparison.discrepancies.length > 0,
        comparison.totalDiscrepancyAmount || 0,
        processingTime,
        invoice.id
      ]
    );

    // Increment usage
    await incrementUsage(organizationId);

    // Update onboarding
    await query(
      `UPDATE user_onboarding 
       SET first_invoice_uploaded = true, step_completed = GREATEST(step_completed, 2)
       WHERE organization_id = $1`,
      [organizationId]
    );

    // Send email notifications (async, don't wait)
    if (comparison.discrepancies.length > 0) {
      sendDiscrepancyAlert(
        userEmail,
        invoice.id,
        vendor.name,
        Math.abs(comparison.totalDiscrepancyAmount),
        comparison.discrepancies.length,
        organizationId
      ).catch(err => console.error('Failed to send discrepancy alert:', err));
    } else {
      sendProcessingComplete(
        userEmail,
        data.invoice?.invoiceNumber || invoice.id,
        vendor.name,
        false,
        organizationId
      ).catch(err => console.error('Failed to send processing complete email:', err));
    }

    // Clean up temp file
    await fs.unlink(file.tempFilePath).catch(() => {});

    return {
      success: true,
      type: 'invoice',
      invoice: {
        id: invoice.id,
        invoiceNumber: data.invoice?.invoiceNumber,
        vendor: vendor.name,
        totalAmount: data.invoice?.totalAmount,
        lineItemCount: data.lineItems?.length || 0
      },
      analysis: {
        hasDiscrepancies: comparison.discrepancies.length > 0,
        discrepancyCount: comparison.discrepancies.length,
        totalImpact: comparison.totalDiscrepancyAmount,
        discrepancies: comparison.discrepancies
      },
      processingTimeMs: processingTime,
      confidence: data.confidence
    };

  } catch (error) {
    console.error('Invoice processing error:', error);
    throw error;
  }
}

module.exports = router;

