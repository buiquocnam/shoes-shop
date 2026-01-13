import { PaginatedResponse, PaginationParams, User } from "@/types";
import { OrderDetail, PurchasedProduct } from "@/types/order";

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

// Aliases or re-exports
export type { PurchasedProduct };

// PurchasedList in profile seems to be exactly OrderDetail but with 'userId' repeated?
// Actually OrderDetail has userId.
// Let's check differences. OrderDetail in global has 'items', 'address', 'payment', 'createdDate'.
// PurchasedList has 'listPurchase', 'orderId' etc.
// It seems PurchasedList is a flattened or specific response for profile history.
// Let's try to map it to OrderDetail or keep it if structure is strictly different from API.
// Based on previous file content:
// export interface PurchasedList {
//   listPurchase: PurchasedProduct[];
//   userId: string;
//   user: User;
//   orderId: string;
//   totalPrice: number;
//   finishPrice: number;
//   discountPercent: number | null;
//   addressId: string;
// }
// This looks very similar to OrderDetail but keys are different (items vs listPurchase, id vs orderId).
// If the API returns different structure, we must keep this type or use an adapter.
// For now, let's keep it but use global sub-types to reduce code.

export interface PurchasedList {
  listPurchase: PurchasedProduct[];
  userId: string;
  user: User;
  orderId: string;
  totalPrice: number;
  finishPrice: number;
  discountPercent: number | null;
  addressId: string;
  orderStatus: string;
}

export interface PurchasedListPaginationResponse
  extends PaginatedResponse<PurchasedList> {}

export interface PurchasedItemFilters extends PaginationParams {
  orderStatus?: string;
}
