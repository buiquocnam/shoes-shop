import { BaseEntity, ProductStatus } from "./common";
import { VariantSize } from "./variant-size";

export interface Variant extends BaseEntity {
  productId: string;
  color: string;
  status: ProductStatus;
  sizes: VariantSize[];
}
