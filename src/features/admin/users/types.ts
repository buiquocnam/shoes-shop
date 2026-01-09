import { PaginationParams } from "@/types";

export interface UserFilters extends PaginationParams {
  name?: string;
  email?: string;
}
