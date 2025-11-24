import { ProductVariant } from "@/features/product/types";
import { ProductDetailType } from "@/features/product/types";
import { PaginatedResponse } from "@/types";
export interface ProductVariantHistory extends ProductDetailType  {
    id: string;
    color: string;
    count: number;
}

export interface ProductVariantHistoryResponse extends PaginatedResponse<ProductVariantHistory> {}