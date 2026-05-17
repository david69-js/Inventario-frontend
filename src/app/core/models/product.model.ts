export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
  status: ProductStatus;
  categoryId: string;
  categoryName?: string;
  supplierId: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
}
