import { ProductType } from "../product";
import { ProductVariant } from "../product";

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
   variant: ProductVariant;
   product: ProductType;
}