"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import { formatDateTime } from "@/utils/date";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminProductsApi } from "@/features/admin/products/services/products.api";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { useQuery } from "@tanstack/react-query";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

interface OrderDetailDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    apiType?: 'admin' | 'admin-user';
}

export function OrderDetailDialog({
    orderId,
    open,
    onOpenChange,
    apiType = 'admin-user',
}: OrderDetailDialogProps) {
    const adminOrderQuery = useQuery({
        queryKey: [...sharedQueryKeys.product.key, "admin-order", orderId || ""],
        queryFn: () => adminProductsApi.getOrderDetail(orderId!),
        enabled: open && apiType === 'admin' && !!orderId,
    });

    const adminUserOrderQuery = useQuery({
        queryKey: [...sharedQueryKeys.product.key, "admin-user-order", orderId || ""],
        queryFn: () => adminUsersApi.getOrderDetail(orderId!),
        enabled: open && apiType === 'admin-user' && !!orderId,
    });

    const orderDetailQuery = apiType === 'admin' ? adminOrderQuery : adminUserOrderQuery;

    const { data: orderDetail, isLoading, error } = orderDetailQuery;

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="px-6 py-6 shrink-0 border-b border-border">
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto p-6 space-y-3">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (error) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="px-6 py-6 shrink-0 border-b border-border">
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="h-12 w-12 text-destructive mb-3" />
                        <p className="font-semibold text-destructive">
                            Không thể tải thông tin đơn hàng
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!orderDetail) {
        return null;
    }

    const address = orderDetail.address;
    const items = orderDetail.items || [];
    const orderDate = formatDateTime(orderDetail.createdDate);
    const fullAddress = address 
        ? `${address.addressLine}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`
        : '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white rounded-xl">
                {/* Header */}
                <DialogHeader className="flex items-center justify-between p-6 border-b border-border">
                    <DialogTitle className="text-xl font-bold">Chi tiết Đơn hàng</DialogTitle>
               
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold ">Mã đơn hàng</span>
                                <span className="text-base font-bold">#{orderDetail.id.slice(-6)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold d">Ngày đặt hàng</span>
                                <span className="text-base font-medium">{orderDate}</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {address && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold ">Địa chỉ giao hàng</span>
                                    <p className="text-base">{fullAddress}</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold ">Giá gốc đơn hàng</span>
                                    <span className={`text-base font-medium ${orderDetail.discountPercent ? 'line-through' : ''}`}>
                                        {formatCurrency(orderDetail.totalPrice)}
                                    </span>
                                </div>
                                {orderDetail.couponCode && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold ">Mã giảm giá</span>
                                        <span className="text-base font-medium text-primary">{orderDetail.couponCode}</span>
                                    </div>
                                )}
                                {orderDetail.discountPercent && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold">Phần trăm giảm</span>
                                        <span className="text-base font-medium text-primary">{orderDetail.discountPercent}%</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-border">
                                    <span className="text-sm font-bold">Tổng thanh toán</span>
                                    <span className="text-xl font-bold text-primary">{formatCurrency(orderDetail.finishPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-bold text-lg">Danh sách sản phẩm</h4>
                        <div className="flex flex-col gap-4">
                            {items.map((item) => {
                                const product = item.product;
                                const variant = item.variant;
                                const imageUrl = product.imageUrl?.url || product.imageUrl?.fileName || '';
                                const brandName = product.brand?.name || '';
                                const categoryName = product.category?.name || '';
                                const originalPrice = product.price;
                                const discount = product.discount || 0;
                                const hasDiscount = discount > 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-[#fcf9f8] border border-border"
                                    >
                                        <div className="shrink-0">
                                            <div className="relative size-20 rounded-lg bg-background border border-border overflow-hidden">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-6 w-6 " />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                {brandName && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold uppercase tracking-wider ">
                                                            {brandName}
                                                        </span>
                                                    </div>
                                                )}
                                                <h5 className="font-bold text-base">{product.name}</h5>
                                                {categoryName && (
                                                    <p className="text-sm ">{categoryName}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-sm ">
                                                <div className="flex items-center gap-1.5">
                                                    <span>Màu: {variant.color}</span>
                                                </div>
                                                <span className="w-px h-3 bg-current opacity-30"></span>
                                                <span>Size: {variant.size}</span>
                                                <span className="w-px h-3 bg-current opacity-30"></span>
                                                <span>SL: {item.countBuy}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end justify-center gap-1 pt-2 sm:pt-0">
                                            <span className="font-bold text-base text-primary">
                                                {formatCurrency(item.totalMoney)}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-sm  line-through">
                                                    {formatCurrency(originalPrice * item.countBuy)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-border bg-[#fcf9f8]">
                    <Button
                        variant="default"
                        onClick={() => onOpenChange(false)}
                        className="px-8 py-2.5 rounded-full"
                    >
                        Xác nhận
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

