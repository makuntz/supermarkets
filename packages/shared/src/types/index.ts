// Tipos de domínio compartilhados

export interface Product {
  id: string;
  name: string;
  nameNormalized: string;
  brand?: string;
  size?: string;
  ean?: string;
  sku?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Market {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketProduct {
  id: string;
  marketId: string;
  productId?: string; // Link opcional para produto canônico
  name: string; // Nome original do mercado
  nameNormalized: string;
  ean?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  marketId: string;
  marketProductId?: string;
  productId?: string; // Quando mapeado para produto canônico
  price: number;
  currency: string;
  validUntil?: Date;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportBatch {
  id: string;
  marketId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportRow {
  id: string;
  importBatchId: string;
  rowNumber: number;
  rawData: Record<string, unknown>; // JSON com dados brutos da planilha
  status: 'pending' | 'processed' | 'error';
  errorMessage?: string;
  createdAt: Date;
}

export interface PriceHistory {
  id: string;
  offerId: string;
  price: number;
  currency: string;
  recordedAt: Date;
}

// Tipos para API
export interface SearchProductRequest {
  query: string;
  marketIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchProductResponse {
  products: Array<{
    product: Product;
    offers: Array<{
      market: Market;
      offer: Offer;
      marketProduct: MarketProduct;
    }>;
  }>;
  total: number;
}

