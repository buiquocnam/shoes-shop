import { BaseEntity, PaginatedResponse, PaginationParams } from "./common";

export interface Brand extends BaseEntity {
  name: string;
  logo: string;
  countProduct?: number;
}

export type BrandPaginationResponse = PaginatedResponse<Brand>;
export type FetchBrandsParams = PaginationParams;
