import { BaseEntity } from "./common";

export interface Category extends BaseEntity {
  name: string;
  description: string;
  parentId: string | null;
  countProduct?: number;
}
