import { BaseEntity, Role, PaginationParams, PaginatedResponse } from "./common";

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  role?: Role;
  status?: boolean;
}

export interface UserFilters extends PaginationParams {
  name?: string;
  email?: string;
}

export type UserPaginationResponse = PaginatedResponse<User>;
