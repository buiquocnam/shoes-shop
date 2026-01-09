import { Cart, CartItem } from "@/types";
import { Product } from "@/types/product";

export interface CartResponse extends Cart {
    items: CartType[];
}

export interface CartType extends CartItem {
   product: Product;
}

export interface AddToCartRequest {
    variantSizeId: string;
    quantity: number;
}
