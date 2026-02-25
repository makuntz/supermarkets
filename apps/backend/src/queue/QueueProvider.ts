// Interface para Queue Provider
// Permite trocar implementação (InMemory, BullMQ, AWS SQS, etc)

import type { JobPayload, JobResult } from '@supermarkets/shared';

export interface IQueueProvider {
  /**
   * Adiciona job à fila
   */
  enqueue(payload: JobPayload): Promise<string>; // Retorna jobId

  /**
   * Processa jobs (worker)
   * @param jobType Tipo de job a processar
   * @param handler Função que processa o job
   */
  process(
    jobType: string,
    handler: (payload: JobPayload) => Promise<JobResult>
  ): Promise<void>;

  /**
   * Obtém status de um job
   */
  getJobStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: JobResult;
  }>;

  /**
   * Fecha conexão/worker
   */
  close(): Promise<void>;
}

