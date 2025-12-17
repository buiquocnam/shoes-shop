"use client";

import { useState, useMemo } from "react";
import { ChartDataPoint, DateRange, DashboardStats } from "../types";
import { useDashboardData } from "./useDashboardData";

export function useDashboard() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfYear,
    to: today,
  });

  const { data, isLoading } = useDashboardData(dateRange);

  const stats: DashboardStats = useMemo(() => {
    if (!data) {
      return {
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalProducts: 0,
      };
    }
    return {
      totalOrders: data.totalOrders,
      totalUsers: data.totalUsers,
      totalRevenue: data.totalRevenue,
      totalProducts: data.totalProducts,
    };
  }, [data]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!data?.revenueByMonth || !dateRange.from || !dateRange.to) return [];

    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    const result: ChartDataPoint[] = [];
    const revenueMap = new Map<string, number>();

    // Tạo map từ API data
    data.revenueByMonth.forEach((item) => {
      const key = `${item.year}-${item.month}`;
      revenueMap.set(key, item.revenue);
    });

    // Tạo data cho tất cả các tháng trong range
    const current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      const key = `${year}-${month}`;
      const revenue = revenueMap.get(key) || 0;

      result.push({
        label: `${String(month).padStart(2, "0")}/${year}`,
        value: revenue,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }, [data, dateRange]);

  const filteredOrders = useMemo(() => {
    return data?.recentOrders || [];
  }, [data]);

  const topProducts = useMemo(() => {
    // TODO: API chưa có topProducts, tạm thời return empty array
    return [] as Array<{ id: string; name: string; sold: number }>;
  }, []);

  return {
    dateRange,
    setDateRange,
    filteredOrders,
    chartData,
    stats,
    topProducts,
    isLoading,
  };
}
