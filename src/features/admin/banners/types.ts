import { PaginatedResponse } from "@/types";

export interface BannerType {
  id: string;
  title: string;
  imageUrl: string;
  nameImage: string;
  link: string;
  active: boolean;
  slot: string;
}

export interface FetchBannersParams {
  page?: number;
  size?: number;
  title?: string;
  active?: boolean;
  slot?: string;
}

export interface BannerPaginationResponse
  extends PaginatedResponse<BannerType> {}

export type BannerSlot = "HOME_1" | "HOME_2" | "HOME_3" |  string;

