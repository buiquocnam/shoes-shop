import { ProductType } from "@/features/product/types";
import { User } from "@/types/global";
import { PaginatedResponse, PaginationParams } from "@/types/global";

/**
 * Payment Variant
 */
export interface PaymentVariant {
  id: string;
  productId: string;
  stock: number;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  countSell: number;
  size: string;
}

/**
 * Payment Product (with imageUrl as object)
 */
export interface PaymentProduct extends Omit<ProductType, "imageUrl"> {
  imageUrl: {
    fileName: string;
    url: string;
    isPrimary: boolean;
  } | null;
}

/**
 * Payment Item
 */
export interface Payment {
  id: string;
  variantSizeId: string;
  userId: string;
  code: string;
  amount: number;
  bankCode: string;
  expiryDate: string | null;
  user: User;
  product: PaymentProduct;
  variant: PaymentVariant;
}

/**
 * Payment Pagination Response
 */
export interface PaymentPaginationResponse extends PaginatedResponse<Payment> {}

/**
 * Payment Filters
 */
export interface PaymentFilters extends PaginationParams {}
