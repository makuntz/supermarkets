// Implementação In-Memory do Queue Provider
// Útil para desenvolvimento e testes
// Em produção, usar BullMQ ou outro provider

import type { IQueueProvider } from './QueueProvider';
import type { JobPayload, JobResult } from '@supermarkets/shared';

interface QueuedJob {
  id: string;
  payload: JobPayload;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: JobResult;
  createdAt: Date;
  processedAt?: Date;
}

export class InMemoryQueue implements IQueueProvider {
  private jobs: Map<string, QueuedJob> = new Map();
  private handlers: Map<string, (payload: JobPayload) => Promise<JobResult>> =
    new Map();
  private processing = false;

  async enqueue(payload: JobPayload): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: QueuedJob = {
      id: jobId,
      payload,
      status: 'pending',
      createdAt: new Date(),
    };
    this.jobs.set(jobId, job);

    // Processa imediatamente se houver handler
    if (this.handlers.has(payload.jobType)) {
      this.processJob(job).catch((error) => {
        console.error(`Error processing job ${jobId}:`, error);
      });
    }

    return jobId;
  }

  async process(
    jobType: string,
    handler: (payload: JobPayload) => Promise<JobResult>
  ): Promise<void> {
    this.handlers.set(jobType, handler);

    // Processa jobs pendentes deste tipo
    const pendingJobs = Array.from(this.jobs.values()).filter(
      (job) => job.status === 'pending' && job.payload.jobType === jobType
    );

    for (const job of pendingJobs) {
      this.processJob(job).catch((error) => {
        console.error(`Error processing job ${job.id}:`, error);
      });
    }
  }

  private async processJob(job: QueuedJob): Promise<void> {
    const handler = this.handlers.get(job.payload.jobType);
    if (!handler) {
      return;
    }

    job.status = 'processing';
    try {
      const result = await handler(job.payload);
      job.status = result.success ? 'completed' : 'failed';
      job.result = result;
      job.processedAt = new Date();
    } catch (error) {
      job.status = 'failed';
      job.result = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      job.processedAt = new Date();
    }
  }

  async getJobStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: JobResult;
  }> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return {
      status: job.status,
      result: job.result,
    };
  }

  async close(): Promise<void> {
    this.handlers.clear();
    this.jobs.clear();
  }
}

