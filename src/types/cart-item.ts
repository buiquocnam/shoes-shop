import { BaseEntity } from "./common";

export interface CartItem extends BaseEntity {
  cartId: string;
  quantity: number;
  variant: {
    id: string;
    productId: string;
    color: string;
    sizeLabel: string;
    stock: number;
  };
  productId: string;
  imageUrl: string;
  price: number;
}
