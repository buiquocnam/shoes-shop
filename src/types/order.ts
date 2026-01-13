import { BaseEntity } from "./common";
import { AddressType } from "./address";
import { Product } from "./product";
import { PaginatedResponse } from "./common";

export interface PurchasedVariant {
     id: string;
     productId: string;
     stock: number;
     color: string;
     status: string;
     countSell: number;
     size: string;
}

export interface PurchasedProduct {
     id: string;
     product: Product;
     variant: PurchasedVariant;
     countBuy: number;
     totalMoney: number;
}


export type statusOrder = "payment" | "shipping" | "success"

export interface OrderDetail extends BaseEntity {
  id: string;
  userId: string;
  totalPrice: number;
  finishPrice: number;
  couponCode: string | null;
  discountPercent: number | null;
  orderStatus: statusOrder;
  address: AddressType;
  payment: unknown | null;
  items: PurchasedProduct[];
}

export interface OrderPaginationResponse extends PaginatedResponse<OrderDetail> {}
