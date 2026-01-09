import { PaginatedResponse } from "@/types";
import { OrderDetail } from "@/types/order";
import { AddressType } from "@/types/address";
import { Product } from "@/types/product";
import { Variant } from "@/types/variant";

// Aliases for backward compatibility or clarity within Payment context
export type PaymentAddress = AddressType;
export type PaymentProduct = Product;
export type PaymentVariant = Variant;

export interface PaymentOrderResponse extends OrderDetail {}

// User info specific to PaymentRecord (the top level user who paid, might be different from order user?)
export interface PaymentUser {
  id: string;
  name: string;
  email: string;
}

// Main payment record
export interface PaymentRecord {
  paymentId: string;
  response: PaymentOrderResponse | null;
  user: PaymentUser;
}

// Paginated response
export interface PaymentPaginationResponse extends PaginatedResponse<PaymentRecord> {}

// Filters for payment list
export interface PaymentFilters {
  page?: number;
  size?: number;
  userId?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}
