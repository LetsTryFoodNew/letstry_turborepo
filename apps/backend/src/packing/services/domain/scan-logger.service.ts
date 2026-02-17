import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class ScanLoggerService {
    private logger: winston.Logger;

    constructor(private configService: ConfigService) {
        const logConfig = this.configService.get('logger');

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.File({
                    filename: path.resolve(logConfig.scanFile),
                }),
            ],
        });
    }

    logScanRequest(mutation: string, payload: { packingOrderId: string; ean: string; packerId: string }) {
        this.logger.info('Scan request received', {
            event: 'SCAN_REQUEST',
            mutation,
            ...payload,
        });
    }

    logScanValidation(packingOrderId: string, ean: string, validation: { isValid: boolean; errorType?: string; item?: any }) {
        this.logger.info('Scan validation result', {
            event: 'SCAN_VALIDATION',
            packingOrderId,
            ean,
            isValid: validation.isValid,
            errorType: validation.errorType || null,
            matchedProductId: validation.item?.productId || null,
            matchedSku: validation.item?.sku || null,
            expectedQuantity: validation.item?.quantity || null,
            itemName: validation.item?.name || null,
        });
    }

    logScanResponse(mutation: string, packingOrderId: string, response: any) {
        this.logger.info('Scan response sent', {
            event: 'SCAN_RESPONSE',
            mutation,
            packingOrderId,
            isValid: response.isValid,
            ean: response.ean,
            errorType: response.errorType || null,
            itemName: response.itemName || null,
        });
    }

    logBatchScanRequest(payload: { packingOrderId: string; items: { ean: string }[]; packerId: string }) {
        this.logger.info('Batch scan request received', {
            event: 'BATCH_SCAN_REQUEST',
            mutation: 'batchScanItems',
            packingOrderId: payload.packingOrderId,
            packerId: payload.packerId,
            itemCount: payload.items.length,
            eans: payload.items.map((i) => i.ean),
        });
    }

    logBatchScanResponse(packingOrderId: string, response: { totalProcessed: number; successCount: number; failureCount: number }) {
        this.logger.info('Batch scan response sent', {
            event: 'BATCH_SCAN_RESPONSE',
            mutation: 'batchScanItems',
            packingOrderId,
            totalProcessed: response.totalProcessed,
            successCount: response.successCount,
            failureCount: response.failureCount,
        });
    }

    logScanError(mutation: string, packingOrderId: string, error: any) {
        this.logger.error('Scan error occurred', {
            event: 'SCAN_ERROR',
            mutation,
            packingOrderId,
            error: error.message,
            stack: error.stack,
        });
    }
}
