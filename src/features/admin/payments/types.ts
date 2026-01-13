import { PaginatedResponse } from "@/types";
import { OrderDetail } from "@/types/order";
import { User } from "@/types/user";

  
// Main payment record
export interface PaymentRecord {
  paymentId: string;
  response: OrderDetail | null;
  user: User;
}

// Paginated response
export interface PaymentPaginationResponse extends PaginatedResponse<PaymentRecord> {}

// Filters for payment list
export interface PaymentFilters {
  page?: number;
  size?: number;
  userId?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}
