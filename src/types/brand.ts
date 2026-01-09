import { BaseEntity } from "./common";

export interface Brand extends BaseEntity {
  name: string;
  logo: string;
  countProduct?: number;
}
