// Import Processor
// Processa jobs de importação de planilhas
// Por enquanto apenas simula o processamento

import type { JobPayload, JobResult } from '@supermarkets/shared';
import { ImportService } from '../services/ImportService';
import prisma from '../config/database';

export class ImportProcessor {
  constructor(private importService: ImportService) {}

  /**
   * Processa um job de importação
   * TODO: Implementar parse real de Excel
   */
  async process(payload: JobPayload): Promise<JobResult> {
    try {
      const { batchId, marketId } = payload.data as {
        batchId: string;
        marketId: string;
        fileName: string;
        fileAssetId?: string;
      };

      // Atualizar status para PROCESSING
      await this.importService.updateBatchStatus(batchId, 'PROCESSING');

      // TODO: Implementar processamento real
      // 1. Buscar FileAsset
      // 2. Download do arquivo (S3/local)
      // 3. Parse Excel (xlsx)
      // 4. Para cada linha:
      //    - Normalizar nome
      //    - Tentar deduplicar (EAN ou nome normalizado)
      //    - Criar/atualizar MarketProduct
      //    - Criar/atualizar Offer
      //    - Criar ImportRow
      // 5. Atualizar ImportBatch com summary

      // Simulação
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const summary = {
        ok: 0,
        errors: 0,
        skipped: 0,
      };

      await this.importService.updateBatchStatus(batchId, 'COMPLETED', {
        processedRows: 0,
        summary,
      });

      return {
        success: true,
        data: {
          batchId,
          summary,
        },
      };
    } catch (error) {
      const batchId = (payload.data as { batchId: string }).batchId;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      await this.importService.updateBatchStatus(batchId, 'FAILED', {
        errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

