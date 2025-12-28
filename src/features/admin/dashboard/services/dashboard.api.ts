import axiosInstance from "@/lib/axios";
import type { DashboardApiResponse, DateRange } from "../types";

export const adminDashboardApi = {
  getDashboard: async (
    dateRange?: DateRange
  ) => {
    const fromDate = dateRange?.from
      ? dateRange.from.toISOString().split("T")[0]
      : new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
    const toDate = dateRange?.to
      ? dateRange.to.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const response = await axiosInstance.post<DashboardApiResponse>(
      "/shoes/admin/dashboard",
      {
        fromDate,
        toDate,
      }
    );
    return response.data;
  },
  getDashboardData: async (params?: {
    fromDate?: string;
    toDate?: string;
  }) => {
    const response = await axiosInstance.post<DashboardApiResponse>(
      "/shoes/admin/dashboard",
      {
        fromDate: params?.fromDate,
        toDate: params?.toDate,
      }
    );
    return response.data;
  },
};
