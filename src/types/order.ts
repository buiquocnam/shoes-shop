import { BaseEntity } from "./common";
import { AddressType } from "./address";
import { Product } from "./product";

// Variant as it exists in the catalog (One color, multiple sizes)
import { Variant } from "./variant";

// Variant as it exists in a purchase (One color, specific size selected)
// This interface reflects what the API returns in purchase history/details
export interface PurchasedVariant {
     id: string;
     productId: string;
     stock: number;
     color: string;
     status: string; // or "ACTIVE" | "INACTIVE"
     countSell: number;
     size: string; // The specific size name/value
}

export interface PurchasedProduct {
     id: string;
     product: Product;
     variant: PurchasedVariant; // Use the snapshot type, not the catalog type
     countBuy: number;
     totalMoney: number;
}

export interface PurchaseOrder extends BaseEntity {
  userId: string;
  variantIds: string[];
  totalPrice: number;
  finishPrice: number;
  couponCode?: string;
  discountPercent?: number;
  addressId: string;
  status: boolean;
}

/**
 * Order Detail Type
 * Comprehensive order information
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
  items: PurchasedProduct[];
}

export interface OrderPaginationResponse {
    data: OrderDetail[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
