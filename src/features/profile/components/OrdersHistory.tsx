'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PurchasedItem } from '../types';
import { useProductsPurchased } from '../hooks/useProfile';
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
    // router.push(`/profile/orders/${purchasedItem.product.id}`);
    console.log(purchasedItem.product.id);
  };

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="py-4">
        <div className="flex items-center gap-4">
          <div
            className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:border-primary transition-colors"
            onClick={handleProductClick}
          >
            <Image
              src={purchasedItem.product.imageUrl?.fileName || '/images/no-image.png'}
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
        <Button variant="outline" size="sm" className="gap-1  text-xs "
          onClick={handleViewDetails}
        >
          View details
        </Button>
      </TableCell>
    </TableRow>
  );
};

export function ProductListBought() {
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
      <div className=" shadow-sm  p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (purchasedItems.length === 0) {
    return (
      <div className=" shadow-sm  p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16  flex items-center justify-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-600">You haven't made any purchases yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Color</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold text-center">Quantity</TableHead>
                <TableHead className="font-semibold text-right">Total Price</TableHead>
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
            Showing <span className="font-medium text-foreground">{purchasedItems.length}</span> of{" "}
            <span className="font-medium text-foreground">{pagination.totalElements}</span> results
            <span className="ml-2">
              (Page <span className="font-medium text-foreground">{pagination.currentPage}</span> /{" "}
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
  );
}
