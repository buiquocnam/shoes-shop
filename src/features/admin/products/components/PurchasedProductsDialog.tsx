"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingBag, User, X } from "lucide-react";
import { PurchasedProductByProduct, PurchasedProductByProductPaginationResponse } from "../types";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrderDetailDialog } from "@/features/order/components/OrderDetailDialog";
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

interface PurchasedProductsDialogProps {
  data: PurchasedProductByProductPaginationResponse | undefined;
  isLoading: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function PurchasedProductsDialog({
  data,
  isLoading,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  currentPage = 1,
  onPageChange,
}: PurchasedProductsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalPage, setInternalPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const page = onPageChange ? currentPage : internalPage;
  const setPage = onPageChange || setInternalPage;

  const purchasedItems = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPageNum = data?.currentPage || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <DialogHeader className="flex items-start justify-between shrink-0">
            <div>
              <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                Sản phẩm đã mua
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Danh sách sản phẩm đã mua theo sản phẩm
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto flex-1 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-5 p-4 rounded-xl">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !purchasedItems || purchasedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Không tìm thấy giao dịch mua
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Không có giao dịch mua nào
                </p>
              </div>
            ) : (
              <>
                {purchasedItems.map((item, index) => (
                  <PurchasedProductCard
                    key={`${item.id}-${index}`}
                    item={item}
                    onViewOrder={() => setSelectedOrderId(item.id)}
                  />
                ))}
                {totalPages > 1 && (
                  <div className="mt-6 pt-4 border-border">
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
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 rounded-b-2xl flex justify-end shrink-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
        apiType="admin"
      />
    </>
  );
}

function PurchasedProductCard({
  item,
  onViewOrder,
}: {
  item: PurchasedProductByProduct;
  onViewOrder: () => void;
}) {
  const product = item.product;
  const variant = item.variant;
  const imageUrl = product.imageUrl?.url || "";

  return (
    <div
      className="group bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
      onClick={onViewOrder}
    >
      <div className="flex gap-5">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                Không có hình ảnh
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {/* User Badge */}
              {item.user && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">{item.user.name}</span>
                  <span className="text-[10px] text-primary/60">• {item.user.email}</span>
                </div>
              )}
            </div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                {variant.color}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                Size: {variant.size}
              </span>
              {product.brand && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border font-mono">
                  {product.brand.name}
                </span>
              )}
            </div>
          </div>
          {/* Quantity & Price */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center text-sm text-muted-foreground">
              Số lượng:{" "}
              <span className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                {item.countBuy}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(item.totalMoney)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
