import type { Metadata } from 'next';
import { DashboardContent } from '@/features/admin/dashboard/components/DashboardContent';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Shoe Shop',
  description: 'Overview of your store performance',
};

export default function AdminPage() {
  return <DashboardContent />;
}
