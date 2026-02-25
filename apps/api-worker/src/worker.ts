// Worker bootstrap
// Processa jobs da fila (imports, etc)

import { env } from './config/env';
import prisma from './config/database';

// TODO: Em produção, usar BullMQ com Redis
// Por enquanto, implementação simplificada que processa jobs diretamente
// Em produção, o worker se conectaria à mesma fila que o backend enfileira

// Importar tipos e classes do backend (em produção, isso seria um package compartilhado)
// Por enquanto, duplicamos a lógica básica aqui

interface ImportJobData {
  batchId: string;
  marketId: string;
  fileName: string;
  fileAssetId?: string;
}

async function processImportJob(data: ImportJobData): Promise<void> {
  // Atualizar status para PROCESSING
  await prisma.importBatch.update({
    where: { id: data.batchId },
    data: { status: 'PROCESSING' },
  });

  // TODO: Implementar processamento real
  // 1. Buscar FileAsset
  // 2. Download do arquivo (S3/local)
  // 3. Parse Excel (xlsx)
  // 4. Para cada linha: normalizar, deduplicar, criar/atualizar produtos e ofertas
  // 5. Atualizar ImportBatch com summary

  // Simulação
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const summary = {
    ok: 0,
    errors: 0,
    skipped: 0,
  };

  await prisma.importBatch.update({
    where: { id: data.batchId },
    data: {
      status: 'COMPLETED',
      processedRows: 0,
      summary: summary as any,
    },
  });
}

async function startWorker() {
  console.log('🚀 Starting worker...');
  console.log(`Environment: ${env.NODE_ENV}`);

  // TODO: Em produção, conectar à fila (BullMQ/Redis)
  // Por enquanto, worker processa jobs diretamente do banco
  // Em produção, usar: queue.process(JobType.IMPORT_EXCEL_BATCH, handler)

  console.log('✅ Worker started. Ready to process jobs...');
  console.log('TODO: Implementar conexão com fila real (BullMQ)');

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down worker...');
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startWorker().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});

