export interface CreateOrderRequest {
  items: OrderItem[];
  couponCode: string | null;
  addressId: string;
}

export interface OrderItem {
  variantSizeId: string;
  quantity: number;
}

export interface CreateOrderResponse {
  items: {
    id: string;
    variantId: string;
    quantity: number;
    totalPrice: number;
  }[];
  orderId: string;
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
