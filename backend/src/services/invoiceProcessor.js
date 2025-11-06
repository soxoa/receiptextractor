const { query } = require('../db/connection');

/**
 * Compare invoice line items against price agreement
 * Returns array of discrepancies found
 */
async function compareInvoiceToContract(invoiceData, vendorId, organizationId) {
  const discrepancies = [];

  try {
    // Get all price agreement items for this vendor
    const priceAgreementQuery = `
      SELECT pai.*, pa.effective_date, pa.expiration_date
      FROM price_agreement_items pai
      JOIN price_agreements pa ON pai.price_agreement_id = pa.id
      WHERE pa.vendor_id = $1 AND pa.organization_id = $2
      AND (pa.expiration_date IS NULL OR pa.expiration_date >= CURRENT_DATE)
      ORDER BY pa.effective_date DESC
    `;

    const { rows: contractItems } = await query(priceAgreementQuery, [vendorId, organizationId]);

    if (contractItems.length === 0) {
      console.log('No price agreement found for vendor, cannot verify pricing');
      return {
        discrepancies: [],
        warning: 'No active price agreement found for this vendor'
      };
    }

    // Build a lookup map for contract prices
    const contractPriceMap = new Map();
    contractItems.forEach(item => {
      // Create keys for different matching strategies
      if (item.item_code) {
        contractPriceMap.set(`code:${item.item_code.toLowerCase().trim()}`, item);
      }
      if (item.item_description) {
        contractPriceMap.set(`desc:${item.item_description.toLowerCase().trim()}`, item);
      }
    });

    // Compare each invoice line item
    for (const invoiceItem of invoiceData.lineItems) {
      let matchedContractItem = null;

      // Try to match by item code first (most accurate)
      if (invoiceItem.itemCode) {
        const codeKey = `code:${invoiceItem.itemCode.toLowerCase().trim()}`;
        matchedContractItem = contractPriceMap.get(codeKey);
      }

      // If no match, try description (fuzzy match)
      if (!matchedContractItem && invoiceItem.description) {
        const descKey = `desc:${invoiceItem.description.toLowerCase().trim()}`;
        matchedContractItem = contractPriceMap.get(descKey);

        // Try partial match
        if (!matchedContractItem) {
          for (const [key, item] of contractPriceMap.entries()) {
            if (key.startsWith('desc:')) {
              const contractDesc = key.substring(5);
              const invoiceDesc = invoiceItem.description.toLowerCase().trim();
              
              // Check if descriptions have significant overlap
              if (
                contractDesc.includes(invoiceDesc) || 
                invoiceDesc.includes(contractDesc) ||
                calculateSimilarity(contractDesc, invoiceDesc) > 0.8
              ) {
                matchedContractItem = item;
                break;
              }
            }
          }
        }
      }

      // Check for discrepancies
      if (matchedContractItem) {
        // Price mismatch
        const expectedPrice = parseFloat(matchedContractItem.unit_price);
        const actualPrice = parseFloat(invoiceItem.unitPrice);
        const priceDiff = actualPrice - expectedPrice;

        if (Math.abs(priceDiff) > 0.01) { // Allow for rounding
          const impactAmount = priceDiff * invoiceItem.quantity;
          
          discrepancies.push({
            type: 'price_mismatch',
            lineNumber: invoiceItem.lineNumber,
            itemCode: invoiceItem.itemCode,
            description: invoiceItem.description,
            expectedValue: expectedPrice,
            actualValue: actualPrice,
            quantity: invoiceItem.quantity,
            impactAmount: impactAmount,
            message: `Price mismatch: Expected $${expectedPrice.toFixed(2)}, charged $${actualPrice.toFixed(2)} (difference: $${Math.abs(priceDiff).toFixed(2)}${priceDiff > 0 ? ' overcharge' : ' undercharge'})`
          });
        }

        // Unit of measure mismatch (warning, not necessarily an error)
        if (matchedContractItem.unit_of_measure && invoiceItem.unitOfMeasure) {
          if (matchedContractItem.unit_of_measure.toLowerCase() !== invoiceItem.unitOfMeasure.toLowerCase()) {
            discrepancies.push({
              type: 'unit_mismatch',
              lineNumber: invoiceItem.lineNumber,
              itemCode: invoiceItem.itemCode,
              description: invoiceItem.description,
              expectedValue: 0,
              actualValue: 0,
              impactAmount: 0,
              message: `Unit of measure mismatch: Expected "${matchedContractItem.unit_of_measure}", invoice shows "${invoiceItem.unitOfMeasure}"`
            });
          }
        }

        // Verify line total calculation
        const calculatedTotal = actualPrice * invoiceItem.quantity;
        const lineTotalDiff = Math.abs(invoiceItem.lineTotal - calculatedTotal);
        
        if (lineTotalDiff > 0.02) { // Allow small rounding errors
          discrepancies.push({
            type: 'calculation_error',
            lineNumber: invoiceItem.lineNumber,
            itemCode: invoiceItem.itemCode,
            description: invoiceItem.description,
            expectedValue: calculatedTotal,
            actualValue: invoiceItem.lineTotal,
            impactAmount: invoiceItem.lineTotal - calculatedTotal,
            message: `Line total calculation error: ${invoiceItem.quantity} × $${actualPrice.toFixed(2)} = $${calculatedTotal.toFixed(2)}, but invoice shows $${invoiceItem.lineTotal.toFixed(2)}`
          });
        }
      } else {
        // Item not found in contract
        discrepancies.push({
          type: 'item_not_in_contract',
          lineNumber: invoiceItem.lineNumber,
          itemCode: invoiceItem.itemCode,
          description: invoiceItem.description,
          expectedValue: 0,
          actualValue: invoiceItem.unitPrice,
          impactAmount: invoiceItem.lineTotal,
          message: `Item not found in price agreement: "${invoiceItem.description}"`
        });
      }
    }

    return {
      discrepancies,
      totalDiscrepancyAmount: discrepancies.reduce((sum, d) => sum + (d.impactAmount || 0), 0),
      contractItemsChecked: contractItems.length,
      invoiceItemsChecked: invoiceData.lineItems.length
    };

  } catch (error) {
    console.error('Error comparing invoice to contract:', error);
    throw error;
  }
}

/**
 * Simple string similarity calculator (Dice coefficient)
 */
function calculateSimilarity(str1, str2) {
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  
  const intersection = bigrams1.filter(bigram => bigrams2.includes(bigram));
  
  return (2.0 * intersection.length) / (bigrams1.length + bigrams2.length);
}

function getBigrams(str) {
  const bigrams = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.substring(i, i + 2));
  }
  return bigrams;
}

/**
 * Save discrepancies to database
 */
async function saveDiscrepancies(invoiceId, discrepancies, organizationId) {
  try {
    // Get invoice line items
    const { rows: lineItems } = await query(
      'SELECT * FROM invoice_line_items WHERE invoice_id = $1',
      [invoiceId]
    );

    for (const discrepancy of discrepancies) {
      // Find matching line item
      const lineItem = lineItems.find(li => li.line_number === discrepancy.lineNumber);
      
      await query(
        `INSERT INTO discrepancies 
         (invoice_id, invoice_line_item_id, organization_id, discrepancy_type, 
          expected_value, actual_value, impact_amount, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          invoiceId,
          lineItem?.id || null,
          organizationId,
          discrepancy.type,
          discrepancy.expectedValue,
          discrepancy.actualValue,
          discrepancy.impactAmount,
          discrepancy.message,
          'open'
        ]
      );
    }

    console.log(`Saved ${discrepancies.length} discrepancies for invoice ${invoiceId}`);
  } catch (error) {
    console.error('Error saving discrepancies:', error);
    throw error;
  }
}

module.exports = {
  compareInvoiceToContract,
  saveDiscrepancies
};

