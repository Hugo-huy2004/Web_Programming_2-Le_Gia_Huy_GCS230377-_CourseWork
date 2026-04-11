import PDFDocument from 'pdfkit';
import {
    drawHeader,
    drawOrderDetails,
    drawTableHeader,
    drawTableRow,
    drawTotals,
    drawWarranty,
    drawFooter
} from './pdf.formatting.js';

/**
 * @param {Object} order - Order document with populated product data
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateInvoicePDF(order) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const chunks = [];

            // Collect PDF data into chunks
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // Draw sections
            drawHeader(doc);
            drawOrderDetails(doc, order);

            // Draw items table
            const tableTop = drawTableHeader(doc);
            let currentY = tableTop + 25;

            order.items.forEach((item, index) => {
                currentY = drawTableRow(doc, item, index, currentY);
            });

            // Draw totals and warranty
            drawTotals(doc, order, currentY);
            drawWarranty(doc);
            drawFooter(doc);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
