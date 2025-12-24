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
}

export interface BannerPaginationResponse
  extends PaginatedResponse<BannerType> {}
