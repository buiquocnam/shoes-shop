import { PaginatedResponse, Banner } from "@/types";

// Re-export or alias if needed, otherwise components should import Banner from types

export interface FetchBannersParams {
  page?: number;
  size?: number;
  title?: string;
  active?: boolean;
}

export type BannerPaginationResponse = PaginatedResponse<Banner> 

export type BannerSlot = "HOME_HERO" | "HOME_MID" | "HOME_BOTTOM";
