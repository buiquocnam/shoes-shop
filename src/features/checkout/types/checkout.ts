import { Product, Variant, VariantSize } from "@/types";

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
  product: Pick<Product, 'id' | 'name' | 'price' | 'discount'> & {
    imageUrl: string | null;
  };
  variant: Pick<Variant, 'id' | 'color'>;
  size: Pick<VariantSize, 'id' | 'size'>;
  quantity: number;
  totalPrice: number;
}
