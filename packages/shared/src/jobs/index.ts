// Tipos compartilhados para jobs
// Usado tanto no backend (enqueue) quanto no worker (process)

export enum JobType {
  IMPORT_EXCEL_BATCH = 'IMPORT_EXCEL_BATCH',
  // Futuros: DEDUPLICATE_PRODUCTS, SEND_NOTIFICATION, etc.
}

export interface JobPayload {
  jobType: JobType;
  data: unknown;
  metadata?: {
    userId?: string;
    marketId?: string;
    retryCount?: number;
  };
}

export interface JobResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

