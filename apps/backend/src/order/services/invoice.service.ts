import { Injectable, Logger } from '@nestjs/common';
import { Order } from '../order.schema';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);

    async generateInvoice(order: any): Promise<Buffer> {
        this.logger.log(`Starting PDF generation for Order: ${order.orderId} (ID: ${order._id})`);
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ size: 'A4', margin: 50 });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => {
                    this.logger.log(`PDF generation completed for Order: ${order.orderId}`);
                    resolve(Buffer.concat(chunks));
                });
                doc.on('error', (err) => {
                    this.logger.error(`PDFDoc error for Order: ${order.orderId}: ${err.message}`, err.stack);
                    reject(err);
                });

                this.logger.debug('Generating Header...');
                await this.generateHeader(doc);

                this.logger.debug('Generating Customer Info...');
                this.generateCustomerInformation(doc, order);

                this.logger.debug('Generating Invoice Table...');
                this.generateInvoiceTable(doc, order);

                this.logger.debug('Generating Footer...');
                this.generateFooter(doc);

                doc.end();
            } catch (error) {
                this.logger.error(`Critical failure in generateInvoice for Order: ${order.orderId}: ${error.message}`, error.stack);
                reject(error);
            }
        });
    }

    private async generateHeader(doc: PDFKit.PDFDocument) {
        const logoRelPath = 'assets/logo.avif';
        const logoPath = path.join(process.cwd(), logoRelPath);

        this.logger.debug(`Searching for logo at: ${logoPath}`);
        if (fs.existsSync(logoPath)) {
            try {
                this.logger.debug('Converting logo to PNG using sharp...');
                const logoBuffer = await sharp(logoPath).png().toBuffer();
                doc.image(logoBuffer, 50, 45, { width: 100 });
                this.logger.debug('Logo successfully added to PDF');
            } catch (error) {
                this.logger.error(`Failed to process logo image at ${logoPath}: ${error.message}`, error.stack);
            }
        } else {
            this.logger.warn(`Logo not found at expected path: ${logoPath}`);
        }
        doc
            .fillColor('#444444')
            .fontSize(16)
            .text('Lets Try', 110, 45, { align: 'right' })
            .fontSize(8)
            .text('Earth Crust Pvt Ltd', 200, 70, { align: 'right' })
            .text('CIN: U15549DL2020PTC365385', 200, 80, { align: 'right' })
            .text('329, 1st Floor, Indra Vihar, Delhi-110009', 200, 90, { align: 'right' })
            .moveDown();
    }

    private generateCustomerInformation(doc: PDFKit.PDFDocument, order: any) {
        doc.fillColor('#444444').fontSize(16).text('Invoice', 50, 150);

        this.generateHr(doc, 175);

        const customerInfoTop = 185;

        doc
            .fontSize(8)
            .text('Order ID:', 50, customerInfoTop)
            .font('Helvetica-Bold')
            .text(order.orderId, 120, customerInfoTop)
            .font('Helvetica')
            .text('Invoice Date:', 50, customerInfoTop + 12)
            .text(new Date(order.createdAt).toLocaleDateString(), 120, customerInfoTop + 12)
            .text('Payment Method:', 50, customerInfoTop + 24)
            .text(order.payment?.method || 'N/A', 120, customerInfoTop + 24)

            .font('Helvetica-Bold')
            .text(order.customer?.name || 'Customer', 300, customerInfoTop)
            .font('Helvetica')
            .text(order.shippingAddress?.addressLine1 || '', 300, customerInfoTop + 12)
            .text(
                `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}, ${order.shippingAddress?.pincode || ''}`,
                300,
                customerInfoTop + 24,
            )
            .text(order.customer?.phone || '', 300, customerInfoTop + 36)
            .moveDown();

        this.generateHr(doc, 245);
    }

    private generateInvoiceTable(doc: PDFKit.PDFDocument, order: any) {
        let i;
        const invoiceTableTop = 270;

        doc.font('Helvetica-Bold').fontSize(8);
        this.generateTableRow(
            doc,
            invoiceTableTop,
            'Item',
            'Description',
            'Unit Cost',
            'Quantity',
            'Line Total',
        );
        this.generateHr(doc, invoiceTableTop + 15);
        doc.font('Helvetica');

        for (i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            const position = invoiceTableTop + (i + 1) * 25;
            this.generateTableRow(
                doc,
                position,
                item.name,
                item.variant || '',
                `INR ${item.price}`,
                item.quantity,
                `INR ${item.totalPrice}`,
            );

            this.generateHr(doc, position + 15);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 25;
        this.generateTableRow(
            doc,
            subtotalPosition,
            '',
            '',
            'Subtotal',
            '',
            `INR ${order.subtotal}`,
        );

        const discountPosition = subtotalPosition + 15;
        this.generateTableRow(
            doc,
            discountPosition,
            '',
            '',
            'Discount',
            '',
            `INR ${order.discount || 0}`,
        );

        const deliveryPosition = discountPosition + 15;
        this.generateTableRow(
            doc,
            deliveryPosition,
            '',
            '',
            'Delivery',
            '',
            `INR ${order.deliveryCharge || 0}`,
        );

        const duePosition = deliveryPosition + 20;
        doc.font('Helvetica-Bold');
        this.generateTableRow(
            doc,
            duePosition,
            '',
            '',
            'Total',
            '',
            `INR ${order.totalAmount}`,
        );
        doc.font('Helvetica');
    }

    private generateFooter(doc: PDFKit.PDFDocument) {
        // Footer removed as per user request
    }

    private generateTableRow(
        doc: PDFKit.PDFDocument,
        y: number,
        item: string,
        description: string,
        unitCost: string,
        quantity: string | number,
        lineTotal: string,
    ) {
        doc
            .fontSize(8)
            .text(item, 50, y, { width: 140 })
            .text(description, 190, y, { width: 140 })
            .text(unitCost, 330, y, { width: 80, align: 'right' })
            .text(quantity.toString(), 410, y, { width: 50, align: 'right' })
            .text(lineTotal, 460, y, { align: 'right' });
    }

    private generateHr(doc: PDFKit.PDFDocument, y: number) {
        doc
            .strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }
}
