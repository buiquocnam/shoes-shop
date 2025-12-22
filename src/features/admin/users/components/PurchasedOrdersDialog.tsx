"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingBag } from "lucide-react";
import { PurchasedListPaginationResponse } from "@/features/profile/types";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDetailDialog } from "@/features/admin/components/OrderDetailDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/utils/pagination";
import { PurchasedList } from "@/features/profile/types";

interface PurchasedOrdersDialogProps {
  data: PurchasedListPaginationResponse | undefined;
  isLoading: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function PurchasedOrdersDialog({
  data,
  isLoading,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  currentPage = 1,
  onPageChange,
}: PurchasedOrdersDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalPage, setInternalPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const page = onPageChange ? currentPage : internalPage;
  const setPage = onPageChange || setInternalPage;

  const orders = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPageNum = data?.currentPage || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đơn hàng đã mua</DialogTitle>
            <DialogDescription>
              Danh sách đơn hàng đã mua của người dùng
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Không tìm thấy đơn hàng
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Không có đơn hàng nào
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    onViewOrder={() => setSelectedOrderId(order.orderId)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      {currentPageNum > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPageNum - 1);
                            }}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}

                      {getPageNumbers(currentPageNum, totalPages).map((pageNum, index) => {
                        if (pageNum === 'ellipsis') {
                          return (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                              isActive={pageNum === currentPageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {currentPageNum < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPageNum + 1);
                            }}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
        useUserApi={true}
      />
    </>
  );
}

function OrderCard({
  order,
  onViewOrder,
}: {
  order: PurchasedList;
  onViewOrder: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={onViewOrder}
    >
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
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {order.listPurchase && order.listPurchase.length > 0 ? (
          order.listPurchase.map((purchasedItem, index) => (
            <div key={`${purchasedItem.id}-${index}`} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
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
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Không có sản phẩm trong đơn hàng này
          </div>
        )}
      </div>
    </div>
  );
}

