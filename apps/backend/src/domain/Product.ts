// Domain entity: Product
// Representa o produto canônico no sistema

export interface ProductEntity {
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

// Domain value objects e regras de negócio serão adicionadas aqui
// Ex: ProductName, ProductPrice, etc.

