// Use case: Buscar produtos
// Contém a lógica de negócio para busca de produtos
// A ser implementada na próxima fase

import type { ProductRepository } from '../repositories/ProductRepository';

export interface SearchProductsInput {
  query: string;
  marketIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchProductsOutput {
  products: Array<{
    product: unknown; // ProductEntity + offers
    offers: unknown[]; // OfferEntity[]
  }>;
  total: number;
}

export class SearchProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(_input: SearchProductsInput): Promise<SearchProductsOutput> {
    // Implementação será adicionada na próxima fase
    throw new Error('Not implemented');
  }
}

