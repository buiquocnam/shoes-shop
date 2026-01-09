export interface BaseEntity {
  id: string;
  createdDate?: string;
  modifiedDate?: string;
}

export type Role = "ADMIN" | "USER";


export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string[];
}

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface ImageType {
  fileName: string;
  url: string;
  isPrimary: boolean;
}
