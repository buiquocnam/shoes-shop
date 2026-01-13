'use client';

import { useState } from 'react';
import { useProductsPurchased } from '@/features/profile/hooks/useProfile';
import { Spinner } from '@/components/ui/spinner';
import {
  OrderEmptyState,
  OrdersList,
  OrdersPagination,
} from '@/features/profile/components/orders';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileOrdersPage() {
  const t = useTranslations('Profile.orders');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("shipping");

  const pageSize = 10;

  const { data, isLoading } = useProductsPurchased({
    page: currentPage,
    size: pageSize,
    orderStatus: status.toUpperCase(),
  });

  const orders = data?.data || [];

  const pagination = {
    currentPage: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    pageSize: data?.pageSize ?? pageSize,
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-card rounded-lg p-6 ">
      <h2 className="text-3xl font-extrabold ">{t('title')}</h2>

      <Tabs defaultValue="shipping" value={status} onValueChange={handleStatusChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="shipping" className="text-sm font-bold">{t('tabs.shipping')}</TabsTrigger>
          <TabsTrigger value="success" className="text-sm font-bold">{t('tabs.success')}</TabsTrigger>
        </TabsList>
      </Tabs>

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
