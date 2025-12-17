import { apiClient } from "@/lib/api";
import type { DashboardApiResponse, DateRange } from "../types";

export const adminDashboardApi = {
  getDashboard: async (
    dateRange?: DateRange
  ): Promise<DashboardApiResponse> => {
    const fromDate = dateRange?.from
      ? dateRange.from.toISOString().split("T")[0]
      : new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
    const toDate = dateRange?.to
      ? dateRange.to.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const response = await apiClient.post<DashboardApiResponse>(
      "/shoes/admin/dashboard",
      {
        fromDate,
        toDate,
      }
    );
    return response.result;
  },
  getDashboardData: async (params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<DashboardApiResponse> => {
    const response = await apiClient.post<DashboardApiResponse>(
      "/shoes/admin/dashboard",
      {
        fromDate: params?.fromDate,
        toDate: params?.toDate,
      }
    );
    return response.result;
  },
};
