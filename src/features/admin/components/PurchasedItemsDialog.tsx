"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingBag, User } from "lucide-react";
import {
    PurchasedItem,
    PurchasedItemPaginationResponse,
} from "@/features/profile/types";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { OrderDetailDialog } from "./OrderDetailDialog";
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

interface PurchasedItemsDialogProps {
    data: PurchasedItemPaginationResponse | undefined;
    isLoading: boolean;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export function PurchasedItemsDialog({
    data,
    isLoading,
    trigger,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    currentPage = 1,
    onPageChange,
}: PurchasedItemsDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [internalPage, setInternalPage] = useState(1);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Sản phẩm đã mua</DialogTitle>
                    <DialogDescription>
                        Danh sách sản phẩm đã mua
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
                        <div className="space-y-4">
                            {purchasedItems.map((item, index) => (
                                <PurchasedItemCard
                                    key={`${item.product.id}-${item.variant.id}-${index}`}
                                    item={item}
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
    );
}

function PurchasedItemCard({
    item,
}: {
    item: PurchasedItem;
}) {
    const product = item.product;
    const variant = item.variant;
    const imageUrl = product.imageUrl?.url || "";
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    return (
        <>
            <div
                className="relative flex gap-4 p-4 rounded-lg hover:border-primary/50 border border-border transition-colors cursor-pointer"
                onClick={() => setShowOrderDetail(true)}
            >
                {/* User Info - Top Right */}
                {item.user && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-semibold text-foreground">{item.user.name}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{item.user.email}</span>
                        </div>
                    </div>
                )}

                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
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

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                                {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                    {variant.color}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Size: {variant.size}
                                </Badge>
                                {product.brand && (
                                    <Badge variant="secondary" className="text-xs">
                                        {product.brand.name}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Số lượng:</span>
                                    <Badge variant="default" className="text-sm font-bold px-2.5 py-0.5">
                                        {item.countBuy}
                                    </Badge>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="font-semibold text-foreground text-base">
                                    {formatCurrency(item.totalMoney)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderDetailDialog
                orderId={item.id}
                open={showOrderDetail}
                onOpenChange={setShowOrderDetail}
            />
        </>
    );
}
