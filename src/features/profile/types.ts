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

export interface PurchasedItemVariant {
  id: string;
  productId: string;
  stock: number;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  countSell: number;
  size: string;
}

export interface PurchasedItem {
  id: string;
  product: ProductType;
  variant: PurchasedItemVariant;
  countBuy: number;
  totalMoney: number;
  userId: string;
  user: User | null;
}

export interface PurchasedItemPaginationResponse
  extends PaginatedResponse<PurchasedItem> {}

export interface PurchasedItemFilters extends PaginationParams {}
