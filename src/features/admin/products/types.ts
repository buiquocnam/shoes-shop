import { ProductType } from '@/features/product/types';

export interface ProductContentInput {
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount?: number;
  categoryId?: string;
  brandId?: string;
}

export interface AdminProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId?: string;
  price: number;
  discount: number;
  images: File[];
  variants: Array<{
    color: string;
    sizes: Array<{
      size: number;
      stock: number;
    }>;
  }>;
}
