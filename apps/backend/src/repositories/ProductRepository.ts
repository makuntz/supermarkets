// Repository interface para Product
// Define o contrato de acesso a dados sem depender de implementação

import type { ProductEntity } from '../domain/Product';

export interface ProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findByNameNormalized(nameNormalized: string): Promise<ProductEntity[]>;
  findByEan(ean: string): Promise<ProductEntity | null>;
  create(product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity>;
  update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity>;
  // Outros métodos conforme necessário
}

