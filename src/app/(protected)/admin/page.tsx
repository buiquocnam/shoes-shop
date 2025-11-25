"use client";

import React, { useState, useMemo } from "react";
import RevenueChart from "@/components/admin/RevenueChart";
import DateRangePicker from "@/components/admin/DateRangePicker";

interface Order {
  id: string;
  customer: string;
  date: string; // yyyy-mm-dd
  total: number;
  status: string;
}

interface Product {
  id: string;
  name: string;
  sold: number;
}

export default function AdminPage() {
  // Mock stats
  const stats = {
    totalOrders: 128,
    totalUsers: 842,
    totalRevenue: 25480,
    products: 92,
  };

  // Mock orders (có dữ liệu 2024 và 2025)
  const allOrders: Order[] = [
    { id: "ORD-2024-01", customer: "Nguyễn Văn A", date: "2024-01-12", total: 200, status: "Delivered" },
    { id: "ORD-2024-07", customer: "Trần Thị B", date: "2024-07-22", total: 120, status: "Delivered" },
    { id: "ORD-2025-02", customer: "Lê Văn C", date: "2025-02-15", total: 90, status: "Pending" },
    { id: "ORD-2025-04", customer: "Phạm Văn D", date: "2025-04-05", total: 450, status: "Delivered" },
    { id: "ORD-2025-10", customer: "Nguyễn Thị E", date: "2025-10-01", total: 300, status: "Delivered" },
    { id: "ORD-2025-11", customer: "Lê Văn F", date: "2025-11-10", total: 180, status: "Delivered" },
  ];

  const topProducts: Product[] = [
    { id: "prod-1", name: "Nike Air Max 90", sold: 42 },
    { id: "prod-2", name: "Adidas Ultraboost", sold: 31 },
    { id: "prod-3", name: "New Balance 574", sold: 27 },
  ];

  // Default range: đầu năm → hôm nay
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: startOfYear,
    to: today,
  });

  // Filter orders ngay khi chọn range
  const filteredOrders = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return allOrders;
    return allOrders.filter((o) => {
      const d = new Date(o.date);
      return d >= dateRange.from! && d <= dateRange.to!;
    });
  }, [dateRange, allOrders]);

  // 🔥 Chart data: group doanh thu theo tháng trong khoảng chọn
  const chartData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];

    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    const result: { label: string; value: number }[] = [];

    // copy để không mutate
    const current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth(); // 0-based
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      // Tính tổng doanh thu trong tháng đó
      const total = allOrders
        .filter((o) => {
          const d = new Date(o.date);
          return d >= monthStart && d <= monthEnd;
        })
        .reduce((sum, o) => sum + o.total, 0);

      result.push({
        label: `${String(month + 1).padStart(2, "0")}/${year}`,
        value: total,
      });

      // Sang tháng tiếp theo
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }, [dateRange, allOrders]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <DateRangePicker onChange={setDateRange} />
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-2xl font-semibold">{stats.products}</p>
          </div>
        </section>

        {/* Revenue chart */}
        <section className="mt-6">
          <RevenueChart data={chartData} width={900} height={260} />
        </section>

        {/* Recent orders & top products */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium">{o.id}</td>
                      <td className="py-3 text-sm">{o.customer}</td>
                      <td className="py-3 text-sm">{o.date}</td>
                      <td className="py-3 text-sm">${o.total.toFixed(2)}</td>
                      <td className="py-3 text-sm">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Top Products</h2>
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">Sold: {p.sold}</p>
                  </div>
                  <div className="text-sm text-gray-600">#{p.id}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
