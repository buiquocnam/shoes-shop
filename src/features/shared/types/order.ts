import { AddressType } from "./address";
import { PurchasedItem } from "@/features/profile/types";

/**
 * Order Detail Type
 * Thông tin chi tiết đơn hàng
 */
export interface OrderDetail {
  id: string;
  userId: string;
  totalPrice: number;
  finishPrice: number;
  couponCode: string | null;
  discountPercent: number | null;
  addressId: string;
  createdDate: string;
  modifiedDate: string;
  address: AddressType;
  payment: unknown | null;
  items: PurchasedItem[];
}
