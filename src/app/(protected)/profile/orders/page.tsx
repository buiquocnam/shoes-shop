'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PurchasedItem } from '@/features/profile/types';
import { useProductsPurchased } from '@/features/profile/hooks/useProfile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const OrderHistoryItem = ({ purchasedItem }: { purchasedItem: PurchasedItem }) => {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/products/${purchasedItem.product.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/checkout/success/${purchasedItem.id}`);
  };

  const imageUrl = purchasedItem.product.imageUrl?.url || purchasedItem.product.imageUrl?.fileName || '/images/no-image.png';

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="py-4">
        <div className="flex items-center gap-4">
          <div
            className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:border-primary transition-colors border"
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
            <h3
              className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
              onClick={handleProductClick}
            >
              {purchasedItem.product.name}
            </h3>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <span className="text-sm text-gray-700 font-medium">{purchasedItem.variant.color}</span>
      </TableCell>
      <TableCell className="py-4">
        <span className="text-sm text-gray-700 font-medium">{purchasedItem.variant.size}</span>
      </TableCell>
      <TableCell className="py-4 text-center">
        <span className="text-sm font-semibold text-gray-900">{purchasedItem.countBuy}</span>
      </TableCell>
      <TableCell className="py-4 text-right">
        <span className="font-bold text-lg text-gray-900">
          {formatCurrency(purchasedItem.totalMoney)}
        </span>
      </TableCell>
      <TableCell className="py-4 text-right">
        <Button variant="outline" size="sm" className="gap-1 text-xs"
          onClick={handleViewDetails}
        >
          Xem chi tiết
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function ProfileOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useProductsPurchased({
    page: currentPage,
    limit: pageSize,
  });

  const purchasedItems = data?.data || [];
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
          <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (purchasedItems.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Xem lịch sử đơn hàng của bạn
          </p>
        </div>
        <div className="shadow-sm p-12">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Chưa có đơn hàng</h3>
              <p className="text-sm text-gray-600">Bạn chưa thực hiện bất kỳ giao dịch mua nào.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="shadow-xl p-4 rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Sản phẩm</TableHead>
                  <TableHead className="font-semibold">Màu</TableHead>
                  <TableHead className="font-semibold">Size</TableHead>
                  <TableHead className="font-semibold text-center">Số lượng</TableHead>
                  <TableHead className="font-semibold text-right">Tổng tiền</TableHead>
                  <TableHead className="font-semibold text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasedItems.map((purchasedItem: PurchasedItem, index: number) => (
                  <OrderHistoryItem
                    key={`${purchasedItem.product.id}-${purchasedItem.variant.id}-${index}`}
                    purchasedItem={purchasedItem}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị <span className="font-medium text-foreground">{purchasedItems.length}</span> trong{" "}
              <span className="font-medium text-foreground">{pagination.totalElements}</span> kết quả
              <span className="ml-2">
                (Trang <span className="font-medium text-foreground">{pagination.currentPage}</span> /{" "}
                <span className="font-medium text-foreground">{pagination.totalPages}</span>)
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
