const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Extract pricing data from a price agreement document
 */
async function extractPriceAgreement(filePath, mimeType) {
  try {
    // Read file and convert to base64
    const fileBuffer = await fs.readFile(filePath);
    const base64Data = fileBuffer.toString('base64');

    const prompt = `You are analyzing a pricing agreement or contract document. Extract ALL pricing information in a structured format.

Please extract:
1. Vendor name and contact information
2. Agreement effective date and expiration date
3. ALL line items with:
   - Item code/SKU (if present)
   - Item description
   - Unit price
   - Unit of measure (each, case, box, lb, etc.)
   - Category or product group (if mentioned)

Return your response as a JSON object with this structure:
{
  "vendor": {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string"
  },
  "agreement": {
    "effectiveDate": "YYYY-MM-DD or null",
    "expirationDate": "YYYY-MM-DD or null",
    "agreementNumber": "string or null"
  },
  "lineItems": [
    {
      "itemCode": "string or null",
      "description": "string",
      "unitPrice": number,
      "unitOfMeasure": "string",
      "category": "string or null"
    }
  ],
  "confidence": "high" | "medium" | "low",
  "notes": "string - any additional context or ambiguities"
}

Be thorough - extract every single pricing line item you can find.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    // Parse the response
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent) {
      throw new Error('No text response from Claude');
    }

    // Extract JSON from the response (Claude sometimes wraps it in markdown)
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }
    }

    const extractedData = JSON.parse(jsonText);
    
    return {
      success: true,
      data: extractedData,
      rawResponse: textContent.text
    };

  } catch (error) {
    console.error('Claude extraction error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Extract invoice data from an invoice document
 */
async function extractInvoice(filePath, mimeType) {
  try {
    // Read file and convert to base64
    const fileBuffer = await fs.readFile(filePath);
    const base64Data = fileBuffer.toString('base64');

    const prompt = `You are analyzing an invoice document. Extract ALL information in a structured format.

Please extract:
1. Vendor information (name, address, contact)
2. Invoice details (number, date, due date, total amount)
3. ALL line items with:
   - Item code/SKU (if present)
   - Item description
   - Quantity
   - Unit price
   - Line total
   - Unit of measure (if present)

Return your response as a JSON object with this structure:
{
  "vendor": {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string"
  },
  "invoice": {
    "invoiceNumber": "string",
    "invoiceDate": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD or null",
    "totalAmount": number,
    "currency": "string (USD, EUR, etc.)"
  },
  "lineItems": [
    {
      "lineNumber": number,
      "itemCode": "string or null",
      "description": "string",
      "quantity": number,
      "unitPrice": number,
      "lineTotal": number,
      "unitOfMeasure": "string or null"
    }
  ],
  "confidence": "high" | "medium" | "low",
  "notes": "string - any additional context or ambiguities"
}

Extract every single line item. Be precise with numbers.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    // Parse the response
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent) {
      throw new Error('No text response from Claude');
    }

    // Extract JSON from the response
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }
    }

    const extractedData = JSON.parse(jsonText);
    
    return {
      success: true,
      data: extractedData,
      rawResponse: textContent.text
    };

  } catch (error) {
    console.error('Claude extraction error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

module.exports = {
  extractPriceAgreement,
  extractInvoice
};

