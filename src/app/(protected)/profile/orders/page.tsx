'use client';

import { useState } from 'react';
import { useProductsPurchased } from '@/features/profile/hooks/useProfile';
import { Spinner } from '@/components/ui/spinner';
import {
  OrderEmptyState,
  OrdersList,
  OrdersPagination,
} from '@/features/profile/components/orders';

export default function ProfileOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useProductsPurchased({
    page: currentPage,
    size: pageSize,
  });

  const orders = data?.data || [];
  const pagination = {
    currentPage: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    pageSize: data?.pageSize ?? pageSize,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg p-6 ">
      <h2 className="text-3xl font-extrabold ">Lịch sử Đơn hàng Của Tôi</h2>

      {orders.length === 0 ? (
        <OrderEmptyState />
      ) : (
        <>
          <OrdersList orders={orders} />
          <OrdersPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalElements={pagination.totalElements}
            currentItemsCount={orders.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
