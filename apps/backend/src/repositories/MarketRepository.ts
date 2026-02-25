// Repository interface para Market

import type { MarketEntity } from '../domain/Market';

export interface MarketRepository {
  findById(id: string): Promise<MarketEntity | null>;
  findAll(activeOnly?: boolean): Promise<MarketEntity[]>;
  create(market: Omit<MarketEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketEntity>;
  // Outros métodos conforme necessário
}

