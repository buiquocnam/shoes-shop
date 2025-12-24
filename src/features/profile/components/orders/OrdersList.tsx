'use client';

import { PurchasedList } from '@/features/profile/types';
import { OrderCard } from './OrderCard';

interface OrdersListProps {
  orders: PurchasedList[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
}

