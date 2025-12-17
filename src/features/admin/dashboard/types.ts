export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalProducts: number;
}

export interface Order {
  id: string;
  userId: string;
  variantId: string;
  countBuy: number;
  totalMoney: number;
  createdAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sold: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DashboardApiResponse {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalProducts: number;
  revenueByMonth: Array<{
    year: number;
    month: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}

