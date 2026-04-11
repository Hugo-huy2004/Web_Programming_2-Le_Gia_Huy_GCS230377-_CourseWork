import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { type Order, type OrderItem } from "../types/store"
import { type Product } from "../types/product"

type InvoiceLineItem = OrderItem & {
    productCode: string
    name: string
}

type InvoiceDoc = jsPDF & {
    lastAutoTable?: {
        finalY: number
    }
}

const PRIMARY_COLOR: [number, number, number] = [184, 134, 11]
const SECONDARY_COLOR: [number, number, number] = [40, 40, 40]
const FALLBACK_ITEM_NAME = "Bespoke Jewelry Item"

function normalizeText(value: string): string {
    if (!value) return ""
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
}

function getProductLookup(products: Product[]): Map<string, Product> {
    return new Map(products.map((product) => [product.id, product]))
}

function buildInvoiceItems(orderItems: OrderItem[], products: Product[]): InvoiceLineItem[] {
    const productLookup = getProductLookup(products)
    return orderItems.map((item) => {
        const product = productLookup.get(item.productId)
        return {
            ...item,
            productCode: product?.productCode || item.productCode || "N/A",
            name: product?.name || item.name || FALLBACK_ITEM_NAME,
        }
    })
}

function drawHeader(doc: jsPDF): void {
    doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
    doc.rect(0, 0, 210, 3, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(32)
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2])
    doc.text("HWJ", 15, 25)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120, 120, 120)
    doc.text("HIGH-END WATCHES & JEWELRY", 15, 31)
    doc.text("Artisans of Time & Brilliance", 15, 35)

    doc.setFontSize(22)
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
    doc.text("INVOICE", 195, 25, { align: "right" })
    doc.setDrawColor(240, 240, 240)
    doc.line(15, 42, 195, 42)
}

function drawOrderAndCustomerDetails(doc: jsPDF, order: Order): void {
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text("ORDER CODE", 15, 50)
    doc.text("DATE", 15, 62)
    doc.text("PAYMENT", 15, 74)

    doc.setFont("helvetica", "bold")
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2])
    doc.text(`#${order.orderCode}`, 15, 55)
    doc.text(new Date(order.createdAt).toLocaleDateString(), 15, 67)
    doc.text("PayPal (Paid in Full)", 15, 79)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("BILLED TO", 120, 50)

    doc.setFont("helvetica", "bold")
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2])
    doc.text(normalizeText(order.receiverName).toUpperCase(), 120, 55)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.text(order.customerEmail, 120, 60)
    doc.text(order.receiverPhone, 120, 64)

    if (order.shippingAddress) {
        const addressLines = doc.splitTextToSize(normalizeText(order.shippingAddress), 70)
        doc.text(addressLines, 120, 68)
    }
}

function drawItemsTable(
    doc: jsPDF,
    items: InvoiceLineItem[],
    formatUsd: (val: number) => string
): void {
    const tableBody = items.map((item, index) => [
        String(index + 1).padStart(2, "0"),
        normalizeText(item.name),
        item.productCode,
        String(item.quantity),
        formatUsd(item.price),
        formatUsd(item.price * item.quantity),
    ])

    autoTable(doc, {
        startY: 90,
        head: [["NO", "ITEM DESCRIPTION", "CODE", "QTY", "UNIT PRICE", "TOTAL"]],
        body: tableBody,
        theme: "striped",
        headStyles: {
            fillColor: SECONDARY_COLOR,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold",
            halign: "center",
        },
        styles: { font: "helvetica", fontSize: 8.5, cellPadding: 4 },
        columnStyles: {
            0: { halign: "center", cellWidth: 12 },
            3: { halign: "center", cellWidth: 15 },
            4: { halign: "right" },
            5: { halign: "right" },
        },
    })
}

function drawTotalRow(
    doc: jsPDF,
    label: string,
    value: string,
    y: number,
    isTotal = false
): void {
    doc.setTextColor(
        isTotal ? SECONDARY_COLOR[0] : 120,
        isTotal ? SECONDARY_COLOR[1] : 120,
        isTotal ? SECONDARY_COLOR[2] : 120
    )
    doc.setFont("helvetica", isTotal ? "bold" : "normal")
    doc.text(label, 140, y)
    doc.text(value, 195, y, { align: "right" })
}

function drawTotals(doc: jsPDF, order: Order, formatUsd: (val: number) => string): number {
    const invoiceDoc = doc as InvoiceDoc
    const tableEndY = invoiceDoc.lastAutoTable?.finalY ?? 90
    const totalsStartY = tableEndY + 10

    doc.setFontSize(9)
    drawTotalRow(doc, "Subtotal:", formatUsd(order.subtotal), totalsStartY)
    drawTotalRow(doc, "Shipping:", formatUsd(order.shippingFee), totalsStartY + 6)
    drawTotalRow(doc, "Tax (10%):", formatUsd(order.tax || order.subtotal * 0.1), totalsStartY + 12)

    let currentY = totalsStartY + 18
    if (order.voucherDiscount > 0) {
        drawTotalRow(doc, "Voucher Discount:", `-${formatUsd(order.voucherDiscount)}`, currentY)
        currentY += 6
    }

    doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
    doc.setLineWidth(0.5)
    doc.line(140, currentY, 195, currentY)

    doc.setFontSize(12)
    drawTotalRow(doc, "TOTAL AMOUNT:", formatUsd(order.total), currentY + 8, true)
    return currentY + 24
}

function ensureBlockStartY(doc: jsPDF, startY: number, blockHeight: number): number {
    // Keep a safe margin so content does not overlap footer area.
    if (startY + blockHeight > 265) {
        doc.addPage()
        return 20
    }

    return startY
}

function drawCustomerNote(doc: jsPDF, startY: number, rawNote: string): number {
    const note = normalizeText(rawNote).trim()
    if (!note) return startY

    const noteLines = doc.splitTextToSize(note, 170) as string[]
    const lineHeight = 4.6
    const noteHeight = 13 + noteLines.length * lineHeight + 5
    const safeStartY = ensureBlockStartY(doc, startY, noteHeight)

    doc.setDrawColor(230, 230, 230)
    doc.rect(15, safeStartY, 180, noteHeight)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2])
    doc.text("NOTE:", 20, safeStartY + 7)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(90, 90, 90)
    doc.text(noteLines, 20, safeStartY + 12)

    return safeStartY + noteHeight + 6
}

function drawWarrantySummary(doc: jsPDF, startY: number): void {
    const safeStartY = ensureBlockStartY(doc, startY, 34)

    doc.setDrawColor(230, 230, 230)
    doc.rect(15, safeStartY, 180, 34)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2])
    doc.text("WARRANTY SUMMARY", 20, safeStartY + 7)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(90, 90, 90)
    doc.text("- Warranty period: 06 months for technical defects under normal use.", 20, safeStartY + 14)
    doc.text("- Complimentary cleaning and polishing: 03 years from purchase date.", 20, safeStartY + 19)
    doc.text("- All warranty claims must be processed at HWJ Service Center:", 20, safeStartY + 24)
    doc.text("  20 Cong Hoa Garden, Tan Binh Ward, HCMC.", 20, safeStartY + 29)
}

function drawFooter(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages()
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
        doc.setPage(pageIndex)
        doc.setFontSize(8)
        doc.setTextColor(170, 170, 170)
        doc.text("HWJ | Heritage Jewelry | Support: huylggcs230377@fpt.edu.vn", 105, 285, {
            align: "center",
        })
        doc.text(`Page ${pageIndex} of ${pageCount}`, 195, 285, { align: "right" })
    }
}

export const generateInvoice = (
    order: Order,
    formatUsd: (val: number) => string,
    products: Product[] = []
): void => {
    const items = buildInvoiceItems(order.items, products)

    const doc = new jsPDF()
    drawHeader(doc)
    drawOrderAndCustomerDetails(doc, order)
    drawItemsTable(doc, items, formatUsd)
    const totalsEndY = drawTotals(doc, order, formatUsd)
    const warrantyStartY = drawCustomerNote(doc, totalsEndY, order.note)
    drawWarrantySummary(doc, warrantyStartY)
    drawFooter(doc)
    doc.save(`HWJ_Invoice_${order.orderCode}.pdf`)
}