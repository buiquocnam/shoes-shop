export interface CreateOrderRequest {
  items: CheckoutItem[];
  couponCode: string | null;
}

export interface CreateOrderResponse {
  id: string;
  variantId: string;
  countBuy: number;
  totalMoney: number;
}

export interface CheckoutItem {
  // Product information for display
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    imageUrl: string | null;
  };
  variant: {
    id: string;
    color: string;
  };
  size: {
    id: string;
    size: string;
  };
  quantity: number;
  totalPrice: number;
}

export interface CheckoutItemApiRequest {
  variantId: string;
  quantity: number;
  totalPrice: number;
}
