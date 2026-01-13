'use client';

import { useState } from 'react';
import { PurchasedList } from '@/features/profile/types';
import { formatCurrency } from '@/utils/format';
import { formatDateTime } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { OrderItem } from './OrderItem';
import { OrderDetailDialog } from '@/features/order';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: PurchasedList;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createdDate = (order as any).createdDate || (order as any).createdAt;
  const formattedDate = createdDate ? formatDateTime(createdDate) : '';

  const handleViewDetails = () => {
    setIsDialogOpen(true);
  };
  console.log(order.orderStatus);
  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-muted/30 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg">#{order.orderId.slice(-8).toUpperCase()}</h3>
            <Badge
              variant={order.orderStatus?.toLowerCase() === 'success' ? 'default' : order.orderStatus?.toLowerCase() === 'shipping' ? 'secondary' : 'outline'}
              className={cn("capitalize", order.orderStatus?.toLowerCase() === 'success' && "bg-success hover:bg-success/90")}
            >
              {order.orderStatus?.toLowerCase() === 'payment' ? 'Chờ thanh toán' :
                order.orderStatus?.toLowerCase() === 'shipping' ? 'Đang giao hàng' :
                  order.orderStatus?.toLowerCase() === 'success' ? 'Hoàn thành' : order.orderStatus}
            </Badge>
          </div>
          {formattedDate && (
            <span className="text-sm text-muted-foreground">Ngày tạo: {formattedDate}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Giá gốc:</span>
            <span className={`text-sm font-medium text-muted-foreground ${order.discountPercent ? 'line-through' : ''}`}>
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Thanh toán:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(order.finishPrice)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {order.listPurchase.map((purchasedItem, index) => (
          <OrderItem key={`${purchasedItem.id}-${index}`} purchasedItem={purchasedItem} />
        ))}
      </div>
      <div className="p-5 pt-2 flex justify-end">
        <Button
          variant="outline"
          onClick={handleViewDetails}
          className="h-10 px-6 rounded-full m:w-auto w-full"
        >
          Xem chi tiết
        </Button>
      </div>
      <OrderDetailDialog
        orderId={order.orderId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        apiType="admin-user"
      />
    </div>
  );
}
