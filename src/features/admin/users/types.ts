import { PaginatedResponse } from "@/types/global";
import { User } from "@/types/global";

export interface UserUpdate {
  id: string;
  name: string;
  phone?: string;
  status?: boolean;
}

export interface UserPaginationResponse extends PaginatedResponse<User> {}

export interface UserFilters {
  page?: number;
  size?: number;
  name?: string;
  email?: string;
}
