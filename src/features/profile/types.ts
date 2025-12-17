import { ProductType } from "../product";

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

export interface PurchasedItem {
  product: ProductType;
  variant: {
    id: string;
    productId: string;
    stock: number;
    color: string;
    status: "ACTIVE" | "INACTIVE";
    countSell: number;
    size: string;
  };
  countBuy: number;
  totalMoney: number;
  userId: string;
}
