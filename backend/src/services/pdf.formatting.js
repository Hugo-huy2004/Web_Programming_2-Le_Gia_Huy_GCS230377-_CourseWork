export function drawHeader(doc) {
    doc.fontSize(20).font('Helvetica-Bold').text('HWJ', { align: 'left' });
    doc.fontSize(9).font('Helvetica').text('HIGH-END WATCHES & JEWELRY', { align: 'left' });
    doc.fontSize(9).text('Artisans of Time & Brilliance', { align: 'left' });

    doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', { align: 'right', lineGap: 5 });

    doc.moveTo(40, 100).lineTo(550, 100).stroke();
}

export function drawOrderDetails(doc, order) {
    doc.fontSize(8).font('Helvetica').text('ORDER CODE', 40, 110);
    doc.fontSize(10).font('Helvetica-Bold').text(`#${order.orderCode}`, 40, 120);

    doc.fontSize(8).font('Helvetica').text('DATE', 40, 140);
    doc.fontSize(10).font('Helvetica-Bold').text(new Date(order.createdAt).toLocaleDateString(), 40, 150);

    doc.fontSize(8).font('Helvetica').text('PAYMENT', 40, 170);
    doc.fontSize(10).font('Helvetica-Bold').text('PayPal (Paid in Full)', 40, 180);

    doc.fontSize(8).font('Helvetica').text('BILLED TO', 320, 110);
    doc.fontSize(10).font('Helvetica-Bold').text(order.receiverName.toUpperCase(), 320, 120);
    doc.fontSize(8).font('Helvetica').text(order.customerEmail, 320, 135);
    doc.fontSize(8).text(order.receiverPhone, 320, 145);
    if (order.shippingAddress) {
        doc.fontSize(8).text(order.shippingAddress, 320, 155, { width: 200 });
    }
}

export function drawTableHeader(doc) {
    const tableTop = 210;
    const col1 = 40;
    const col2 = 80;
    const col3 = 380;
    const col4 = 420;
    const col5 = 460;
    const col6 = 520;

    // Header row with black background
    doc.fontSize(8).font('Helvetica-Bold').fillColor('white').rect(40, tableTop, 512, 20).fill('black');
    doc.fillColor('white').text('NO', col1, tableTop + 4);
    doc.text('ITEM DESCRIPTION', col2, tableTop + 4);
    doc.text('CODE', col3, tableTop + 4);
    doc.text('QTY', col4, tableTop + 4, { width: 30, align: 'center' });
    doc.text('UNIT PRICE', col5, tableTop + 4, { width: 40, align: 'right' });
    doc.text('TOTAL', col6, tableTop + 4, { width: 30, align: 'right' });

    return tableTop;
}

export function drawTableRow(doc, item, rowIndex, currentY) {
    const col1 = 40;
    const col2 = 80;
    const col3 = 380;
    const col4 = 420;
    const col5 = 460;
    const col6 = 520;

    const productName = item.productId?.name || item.name || 'Product';
    const productCode = item.productId?.productCode || 'N/A';

    doc.fontSize(8).font('Helvetica').fillColor('black');
    doc.text(String(rowIndex + 1).padStart(2, '0'), col1, currentY);
    doc.text(productName, col2, currentY, { width: 290 });
    doc.text(productCode, col3, currentY);
    doc.text(String(item.quantity), col4, currentY, { width: 30, align: 'center' });
    doc.text(`$${item.price.toFixed(2)}`, col5, currentY, { width: 40, align: 'right' });
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, col6, currentY, { width: 30, align: 'right' });

    return currentY + 20;
}

export function drawTotals(doc, order, currentY) {
    currentY += 10;
    doc.fontSize(9).font('Helvetica');
    
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 400, currentY, { align: 'right' });
    currentY += 15;
    
    doc.text(`Shipping: $${order.shippingFee.toFixed(2)}`, 400, currentY, { align: 'right' });
    currentY += 15;
    
    doc.text(`Tax (10%): $${(order.tax || order.subtotal * 0.1).toFixed(2)}`, 400, currentY, { align: 'right' });

    if (order.voucherDiscount > 0) {
        currentY += 15;
        doc.text(`Voucher Discount: -$${order.voucherDiscount.toFixed(2)}`, 400, currentY, { align: 'right' });
    }

    currentY += 20;
    doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL: $${order.total.toFixed(2)}`, 400, currentY, { align: 'right' });

    return currentY;
}

export function drawWarranty(doc) {
    let currentY = 700;
    doc.fontSize(10).font('Helvetica-Bold').text('WARRANTY SUMMARY', 40, currentY);
    currentY += 15;
    
    doc.fontSize(8).font('Helvetica');
    doc.text('• Warranty period: 06 months for technical defects under normal use.', 40, currentY, { width: 512 });
    currentY += 12;
    
    doc.text('• Complimentary cleaning and polishing: 03 years from purchase date.', 40, currentY, { width: 512 });
    currentY += 12;
    
    doc.text('• All warranty claims must be processed at HWJ Service Center:', 40, currentY, { width: 512 });
    currentY += 12;
    
    doc.text('20 Cong Hoa Garden, Tan Binh Ward, HCMC.', 50, currentY);
}

export function drawFooter(doc) {
    doc.fontSize(7).text('HWJ | Heritage Jewelry | Support: huylggcs230377@fpt.edu.vn', 40, 770, { align: 'center' });
}
