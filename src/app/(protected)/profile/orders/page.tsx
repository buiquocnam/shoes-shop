'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PurchasedList, PurchasedProduct } from '@/features/profile/types';
import { useProductsPurchased } from '@/features/profile/hooks/useProfile';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/utils/format';
import { getPageNumbers } from '@/utils/pagination';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const OrderItem = ({ purchasedItem }: { purchasedItem: PurchasedProduct }) => {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/products/${purchasedItem.product.id}`);
  };

  const imageUrl = purchasedItem.product.imageUrl?.url || purchasedItem.product.imageUrl?.fileName || '/images/no-image.png';

  return (
    <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div
        className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:border-primary transition-colors border flex-shrink-0"
        onClick={handleProductClick}
      >
        <Image
          src={imageUrl}
          alt={purchasedItem.product.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className="text-base font-bold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-primary transition-colors"
          onClick={handleProductClick}
        >
          {purchasedItem.product.name}
        </h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Size: {purchasedItem.variant.size} | Color: {purchasedItem.variant.color}
        </p>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-0">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Qty: <span className="font-medium text-gray-900 dark:text-gray-100">{purchasedItem.countBuy}</span>
        </span>
        <span className="text-base font-bold text-primary">
          {formatCurrency(purchasedItem.totalMoney)}
        </span>
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: PurchasedList }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/checkout/success/${order.orderId}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-shadow hover:shadow-md">
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-y-2 gap-x-8">
          <div>
            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order ID</span>
            <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">#{order.orderId.slice(-6)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Amount</span>
            <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(order.finishPrice)}
            </span>
          </div>
          {order.discountPercent && (
            <div>
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Discount</span>
              <span className="block text-sm font-medium text-green-600 dark:text-green-400">
                {order.discountPercent}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={handleViewDetails}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {order.listPurchase.map((purchasedItem, index) => (
          <OrderItem key={`${purchasedItem.id}-${index}`} purchasedItem={purchasedItem} />
        ))}
      </div>
      <div className="sm:hidden px-6 pb-6 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleViewDetails}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default function ProfileOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useProductsPurchased({
    page: currentPage,
    limit: pageSize,
  });

  const orders = data?.data || [];
  const pagination = {
    currentPage: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    pageSize: data?.pageSize ?? pageSize,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Đơn hàng của tôi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Xem lịch sử đơn hàng của bạn
          </p>
        </div>
        <div className="shadow-sm p-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Chưa có đơn hàng</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bạn chưa thực hiện bất kỳ giao dịch mua nào.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Đơn hàng của tôi</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Xem lịch sử đơn hàng của bạn
        </p>
      </div>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-gray-100">{orders.length}</span> trong{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">{pagination.totalElements}</span> đơn hàng
              <span className="ml-2">
                (Trang <span className="font-medium text-gray-900 dark:text-gray-100">{pagination.currentPage}</span> /{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">{pagination.totalPages}</span>)
              </span>
            </div>

            <Pagination>
              <PaginationContent>
                {pagination.currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pagination.currentPage - 1);
                      }}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}

                {getPageNumbers(pagination.currentPage, pagination.totalPages).map(
                  (page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === pagination.currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                {pagination.currentPage < pagination.totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pagination.currentPage + 1);
                      }}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
