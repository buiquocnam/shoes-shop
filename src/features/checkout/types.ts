export interface ShippingAddress {
  id?: string;
  type: "home" | "work" | "other";
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export type PaymentMethod = "credit_card" | "paypal";

export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface CreateOrderRequest {
    variantId: string;
    countBuy: number;
    totalPrice: number;
}[]

export interface CreateOrderResponse {
  id: string;
  variantId: string;
  countBuy: number;
  totalMoney: number;
}

export interface CheckoutItem {
  product?: {
    id: string;
    name: string;
    imageUrl?: string;
    price: number;
  };
  variant?: {
    id: string;
    size?: string;
    color?: string;
    quantity: number;
  };
}
