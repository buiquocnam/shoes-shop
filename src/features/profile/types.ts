import { PaginatedResponse, PaginationParams, User } from "@/types/global";
import { ProductType } from "../product/types";

export interface UpdateProfileRequest {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PurchasedVariant {
  id: string;
  productId: string;
  stock: number;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  countSell: number;
  size: string;
}

export interface PurchasedProduct {
  id: string;
  product: ProductType;
  variant: PurchasedVariant;
  countBuy: number;
  totalMoney: number;
}

export interface PurchasedList {
  listPurchase: PurchasedProduct[];
  userId: string;
  user: User;
  orderId: string;
  totalPrice: number;
  finishPrice: number;
  discountPercent: number | null;
  addressId: string;
}
export interface PurchasedListPaginationResponse
  extends PaginatedResponse<PurchasedList> {}

export interface PurchasedItemFilters extends PaginationParams {}
