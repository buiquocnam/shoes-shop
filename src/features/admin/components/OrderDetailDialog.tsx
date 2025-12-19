"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useOrderDetail } from "@/features/shared/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, MapPin, Calendar, Tag, User } from "lucide-react";

interface OrderDetailDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
    orderId,
    open,
    onOpenChange,
}: OrderDetailDialogProps) {
    const { data: orderDetail, isLoading, error } = useOrderDetail(
        open ? orderId : null
    );

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
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
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                        <Badge variant="secondary" className="text-xs font-mono mr-6">
                            #{orderDetail.id}
                        </Badge>
                    </div>
                    <DialogDescription className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(orderDetail.createdDate).toLocaleString("vi-VN")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                            <span className="font-semibold">{formatCurrency(orderDetail.totalPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mã giảm giá - Phần trăm giảm giá:</span>
                            <span className="font-semibold">{orderDetail.discountPercent ? `${orderDetail.discountPercent}%` : 'Không có'}</span>
                        </div>
                            
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Thành tiền:</span>
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(orderDetail.finishPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Address */}
                    {address && (
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <h5 className="font-semibold text-sm">Địa chỉ giao hàng</h5>
                            </div>
                            <p className="text-sm font-medium">{address.addressLine}</p>
                            <p className="text-sm text-muted-foreground">
                                {address.wardName}, {address.districtName}, {address.provinceName}
                            </p>
                        </div>
                    )}

                    {/* Items */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                <h5 className="font-semibold text-sm">Sản phẩm</h5>
                            </div>
                            <Badge variant="default" className="text-xs">{items.length} sản phẩm</Badge>
                        </div>
                        <div className="space-y-3">
                            {items.map((item) => {
                                const product = item.product;
                                const variant = item.variant;
                                const imageUrl = product.imageUrl?.url || "";

                                return (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 p-3 rounded-lg border bg-muted/30"
                                    >
                                        {/* Image */}
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
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                                {product.brand && (
                                                    <Badge variant="secondary" className="text-xs h-5">
                                                        {product.brand.name}
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs h-5">
                                                    {variant.color} - Size {variant.size}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    SL: <span className="font-medium text-foreground">{item.countBuy}</span>
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {formatCurrency(item.totalMoney)}
                                                </span>
                                            </div>
                                            {item.user && (
                                                <div className="mt-2 pt-2 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span className="font-medium text-foreground">{item.user.name}</span>
                                                    <span>•</span>
                                                    <span>{item.user.email}</span>
                                                </div>
                                            )}
                                        </div>
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
