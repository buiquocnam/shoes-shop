import { BaseEntity, PaginatedResponse, PaginationParams } from "./common";

export interface Banner extends BaseEntity {
  title: string;
  link: string;
  imageUrl: string;
  active: boolean;
  slot: BannerSlot;
}

export type BannerSlot = "HOME_HERO" | "HOME_MID" | "HOME_BOTTOM";

export interface BannerFilters extends PaginationParams {
  title?: string; 
  active?: boolean;
}

export type BannerPaginationResponse = PaginatedResponse<Banner>;
