import { ProductType } from "../product";

export interface CartResponse {
    id: string;
    userId: string;
    count: number;
    totalPrice: number;
    items: CartType[];
}

export interface CartType {
   id: string;
   cartId: string;
   quantity: number;
   variant: {
    id: string;
    productId: string;
    color: string;
    sizeLabel: string;
    stock: number;
  };
   product: ProductType;
}

export interface AddToCartRequest {
    varianSizeId: string;
    quantity: number;
}