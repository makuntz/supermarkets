// Domain entity: Market
// Representa um mercado/supermercado

export interface MarketEntity {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

