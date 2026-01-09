// Re-exports for backward compatibility
import { Product, ProductDetail, ProductFilters, ProductPaginationResponse } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { Variant } from "@/types/variant";
import { VariantSize } from "@/types/variant-size";
import { ImageType } from "@/types/common";
import { Review, CreateProductReviewType, ReviewFilters, ProductReviewResponse } from "@/types/review";

export type {
  Product as ProductType,
  Category as CategoryType,
  Brand as BrandType,
  Variant as ProductVariant,
  VariantSize as SizeType,
  ImageType,
  ProductDetail as ProductDetailType,
  ProductFilters,
  ProductPaginationResponse,
  Review as ProductReviewType,
  CreateProductReviewType,
  ReviewFilters,
  ProductReviewResponse
};
