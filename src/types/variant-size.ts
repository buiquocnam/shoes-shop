import { BaseEntity } from "./common";

export interface VariantSize extends BaseEntity {
  variantId: string;
  stock: number;
  countSell: number;
  size: string;
}
