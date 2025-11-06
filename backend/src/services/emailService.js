const { Resend } = require('resend');
const { query } = require('../db/connection');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(userEmail, userName, organizationId) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ReceiptExtractor <hello@receiptextractor.com>',
      to: [userEmail],
      subject: 'Welcome to ReceiptExtractor!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to ReceiptExtractor! 🎉</h1>
              </div>
              <div class="content">
                <h2>Hi ${userName},</h2>
                <p>We're excited to have you on board! ReceiptExtractor helps you automatically catch vendor overcharges by comparing invoices against your negotiated pricing contracts.</p>
                
                <h3>Get started in 3 simple steps:</h3>
                <ol>
                  <li><strong>Upload a pricing agreement</strong> - Drag in your vendor contract or price list</li>
                  <li><strong>Upload an invoice</strong> - We'll extract the data automatically</li>
                  <li><strong>See instant results</strong> - Discover overcharges in seconds</li>
                </ol>
                
                <a href="${process.env.FRONTEND_URL}/upload" class="button">Upload Your First Document</a>
                
                <p>Our AI will handle the rest. No manual data entry required!</p>
                
                <p><strong>Your free plan includes:</strong></p>
                <ul>
                  <li>10 invoices per month</li>
                  <li>Automatic overcharge detection</li>
                  <li>Email alerts</li>
                  <li>Full feature access</li>
                </ul>
                
                <p>Questions? Just reply to this email - we're here to help!</p>
                
                <p>Best regards,<br>The ReceiptExtractor Team</p>
              </div>
              <div class="footer">
                <p>© 2025 ReceiptExtractor. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    // Log email to database
    await query(
      `INSERT INTO emails (organization_id, recipient_email, subject, template_name, status, resend_message_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [organizationId, userEmail, 'Welcome to ReceiptExtractor!', 'welcome', 'sent', data.id]
    );

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send discrepancy alert email
 */
async function sendDiscrepancyAlert(userEmail, invoiceId, vendorName, totalImpact, discrepancyCount, organizationId) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ReceiptExtractor Alerts <alerts@receiptextractor.com>',
      to: [userEmail],
      subject: `🚨 Found $${totalImpact.toFixed(2)} in overcharges on ${vendorName} invoice`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #ef4444; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .alert-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .amount { font-size: 36px; font-weight: bold; color: #ef4444; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Overcharges Detected!</h1>
              </div>
              <div class="content">
                <div class="alert-box">
                  <strong>Vendor:</strong> ${vendorName}<br>
                  <strong>Discrepancies Found:</strong> ${discrepancyCount}
                </div>
                
                <p>We found pricing issues on your latest invoice:</p>
                
                <div class="amount">$${totalImpact.toFixed(2)}</div>
                <p style="color: #666; margin-top: -15px;">Total overcharge amount</p>
                
                <p>Review the details and dispute these charges with your vendor.</p>
                
                <a href="${process.env.FRONTEND_URL}/invoices/${invoiceId}" class="button">View Invoice Details</a>
                
                <p><strong>What to do next:</strong></p>
                <ol>
                  <li>Review each discrepancy in detail</li>
                  <li>Contact ${vendorName} to dispute the overcharges</li>
                  <li>Request a corrected invoice or credit memo</li>
                </ol>
                
                <p>We've saved the details for your records.</p>
                
                <p>Best regards,<br>The ReceiptExtractor Team</p>
              </div>
              <div class="footer">
                <p>© 2025 ReceiptExtractor. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send discrepancy alert:', error);
      return { success: false, error };
    }

    await query(
      `INSERT INTO emails (organization_id, recipient_email, subject, template_name, status, resend_message_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [organizationId, userEmail, `Found $${totalImpact.toFixed(2)} in overcharges`, 'discrepancy_alert', 'sent', data.id]
    );

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending discrepancy alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send processing complete notification
 */
async function sendProcessingComplete(userEmail, invoiceNumber, vendorName, hasDiscrepancies, organizationId) {
  try {
    const subject = hasDiscrepancies 
      ? `Invoice #${invoiceNumber} processed - Issues found`
      : `Invoice #${invoiceNumber} processed - No overcharges found ✓`;

    const { data, error } = await resend.emails.send({
      from: 'ReceiptExtractor <alerts@receiptextractor.com>',
      to: [userEmail],
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: ${hasDiscrepancies ? '#ef4444' : '#10b981'}; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 24px; background: ${hasDiscrepancies ? '#ef4444' : '#10b981'}; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${hasDiscrepancies ? '⚠️' : '✓'} Processing Complete</h1>
              </div>
              <div class="content">
                <p><strong>Invoice:</strong> #${invoiceNumber}<br>
                <strong>Vendor:</strong> ${vendorName}</p>
                
                ${hasDiscrepancies 
                  ? '<p style="color: #ef4444;"><strong>Status:</strong> Discrepancies found - review required</p>'
                  : '<p style="color: #10b981;"><strong>Status:</strong> All prices match your contract ✓</p>'
                }
                
                <a href="${process.env.FRONTEND_URL}/invoices" class="button">View Invoice</a>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send processing complete email:', error);
      return { success: false, error };
    }

    await query(
      `INSERT INTO emails (organization_id, recipient_email, subject, template_name, status, resend_message_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [organizationId, userEmail, subject, 'processing_complete', 'sent', data.id]
    );

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending processing complete email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendDiscrepancyAlert,
  sendProcessingComplete
};

