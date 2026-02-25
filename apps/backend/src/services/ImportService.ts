// Import Service
// Cria ImportBatch e enfileira job de processamento

import type { IQueueProvider } from '../queue/QueueProvider';
import type { JobType } from '@supermarkets/shared';
import prisma from '../config/database';

export class ImportService {
  constructor(private queue: IQueueProvider) {}

  /**
   * Cria um ImportBatch e enfileira job de processamento
   * TODO: Implementar upload de arquivo e criação de FileAsset
   */
  async createImportBatch(params: {
    marketId: string;
    fileName: string;
    createdByUserId: string;
    fileAssetId?: string;
  }): Promise<{ batchId: string; jobId: string }> {
    // Criar ImportBatch
    const batch = await prisma.importBatch.create({
      data: {
        marketId: params.marketId,
        fileName: params.fileName,
        status: 'PENDING',
        createdByUserId: params.createdByUserId,
        fileAssetId: params.fileAssetId,
      },
    });

    // Enfileirar job de processamento
    const jobId = await this.queue.enqueue({
      jobType: 'IMPORT_EXCEL_BATCH' as JobType,
      data: {
        batchId: batch.id,
        marketId: params.marketId,
        fileName: params.fileName,
        fileAssetId: params.fileAssetId,
      },
      metadata: {
        userId: params.createdByUserId,
        marketId: params.marketId,
      },
    });

    return {
      batchId: batch.id,
      jobId,
    };
  }

  /**
   * Atualiza status do batch
   */
  async updateBatchStatus(
    batchId: string,
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
    data?: {
      processedRows?: number;
      errorMessage?: string;
      summary?: Record<string, unknown>;
    }
  ): Promise<void> {
    await prisma.importBatch.update({
      where: { id: batchId },
      data: {
        status,
        processedRows: data?.processedRows,
        errorMessage: data?.errorMessage,
        summary: data?.summary as any,
      },
    });
  }
}

