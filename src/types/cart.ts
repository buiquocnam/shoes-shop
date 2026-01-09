import { BaseEntity } from "./common";

export interface Cart extends BaseEntity {
  userId: string;
  count: number;
  totalPrice: number;
}
