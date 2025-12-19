import type { Metadata } from 'next';
import { DashboardContent } from '@/features/admin/dashboard/components/DashboardContent';

export const metadata: Metadata = {
  title: 'Bảng điều khiển Admin - Cửa hàng giày',
  description: 'Tổng quan hiệu suất cửa hàng của bạn',
};

export default function AdminPage() {
  return <DashboardContent />;
}
