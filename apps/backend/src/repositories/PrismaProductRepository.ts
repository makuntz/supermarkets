// Implementação do ProductRepository usando Prisma
// A ser implementada quando necessário

import type { ProductRepository } from './ProductRepository';
import type { ProductEntity } from '../domain/Product';

export class PrismaProductRepository implements ProductRepository {
  // Implementação será adicionada quando necessário
  async findById(_id: string): Promise<ProductEntity | null> {
    throw new Error('Not implemented');
  }

  async findByNameNormalized(_nameNormalized: string): Promise<ProductEntity[]> {
    throw new Error('Not implemented');
  }

  async findByEan(_ean: string): Promise<ProductEntity | null> {
    throw new Error('Not implemented');
  }

  async create(_product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity> {
    throw new Error('Not implemented');
  }

  async update(_id: string, _data: Partial<ProductEntity>): Promise<ProductEntity> {
    throw new Error('Not implemented');
  }
}

