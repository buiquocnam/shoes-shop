"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useAdminOrderDetail, useAdminUserOrderDetail } from "@/features/admin/hooks/useAdminOrderDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, MapPin, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    useUserApi?: boolean; // true: use /order-detail, false: use /order
}

export function OrderDetailDialog({
    orderId,
    open,
    onOpenChange,
    useUserApi = false,
}: OrderDetailDialogProps) {
    const productOrderQuery = useAdminOrderDetail(
        open && !useUserApi ? orderId : null
    );
    const userOrderQuery = useAdminUserOrderDetail(
        open && useUserApi ? orderId : null
    );
    
    const { data: orderDetail, isLoading, error } = useUserApi ? userOrderQuery : productOrderQuery;

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const time = date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        const dateStr = date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return `${time} ${dateStr}`;
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="px-8 py-6 shrink-0">
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto p-8 space-y-3">
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
                    <DialogHeader className="px-8 py-6 shrink-0">
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                {/* Header */}
                <DialogHeader className="px-8 py-6 flex items-start justify-between shrink-0">
                    <div>
                        <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
                            Chi tiết đơn hàng
                        </DialogTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <span className="text-primary">#</span>
                                <span className="font-mono text-xs">{orderDetail.id}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{orderDate}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6">
                    {/* Address & Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                        <div className="md:col-span-7 flex flex-col">
                            {address && (
                                <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-full">
                                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <h3>Địa chỉ giao hàng</h3>
                                    </div>
                                    <div className="pl-10 space-y-1">
                                        <p className="text-gray-900 font-medium">Khách hàng</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {address.addressLine}<br/>
                                            {address.wardName}, {address.districtName}, {address.provinceName}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-5 flex flex-col">
                            <div className="bg-white shadow-xl rounded-2xl p-6 h-full flex flex-col justify-center">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tổng tiền</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(orderDetail.totalPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Mã giảm giá</span>
                                        <span className="text-gray-400 italic">
                                            {orderDetail.couponCode || 'Không có'}
                                        </span>
                                    </div>
                                    {orderDetail.discountPercent && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Giảm giá</span>
                                            <span className="font-medium text-primary">
                                                -{orderDetail.discountPercent}%
                                            </span>
                                        </div>
                                    )}
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-900 font-medium">Thành tiền</span>
                                        <span className="text-2xl font-bold text-primary tracking-tight">
                                            {formatCurrency(orderDetail.finishPrice)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Đã thanh toán
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4 ">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Sản phẩm
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                {items.length} sản phẩm
                            </span>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
                            {items.map((item, index) => {
                                const product = item.product;
                                const variant = item.variant;
                                const imageUrl = product.imageUrl?.url || "";

                                return (
                                    <div key={item.id}>
                                        <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                            {/* Image */}
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover mix-blend-multiply"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {variant.size}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {variant.color}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quantity & Price */}
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-6 sm:gap-1 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
                                                <div className="text-sm text-gray-500">
                                                    SL: <span className="font-medium text-gray-900">{item.countBuy}</span>
                                                </div>
                                                <div className="text-base font-semibold text-primary">
                                                    {formatCurrency(item.totalMoney)}
                                                </div>
                                            </div>
                                        </div>
                                        {index < items.length - 1 && (
                                            <div className="h-px bg-gray-100 mx-5"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
