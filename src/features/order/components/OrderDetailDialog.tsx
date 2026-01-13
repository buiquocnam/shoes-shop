"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, MapPin, Package, Receipt, User, } from "lucide-react";
import { adminProductsApi } from "@/features/admin/products/services/products.api";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { useQuery } from "@tanstack/react-query";
import { orderQueryKeys } from "../constants/queryKeys";
import { usePaymentDetail } from "@/features/admin/payments";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface OrderDetailDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    apiType?: 'admin' | 'admin-user' | 'admin-payment';
}

export function OrderDetailDialog({
    orderId,
    open,
    onOpenChange,
    apiType = 'admin-user',
}: OrderDetailDialogProps) {
    // 1. Queries
    const { data: paymentRecord, isLoading: isLoadingPayment, error: errorPayment } = usePaymentDetail(
        open && apiType === 'admin-payment' ? orderId : null
    );

    const adminOrderQuery = useQuery({
        queryKey: orderQueryKeys.adminDetail(orderId || ""),
        queryFn: () => adminProductsApi.getOrderDetail(orderId!),
        enabled: open && apiType === 'admin' && !!orderId,
    });

    const adminUserOrderQuery = useQuery({
        queryKey: orderQueryKeys.adminUserDetail(orderId || ""),
        queryFn: () => adminUsersApi.getOrderDetail(orderId!),
        enabled: open && apiType === 'admin-user' && !!orderId,
    });

    // 2. Determine active data source
    let isLoading = false;
    let error = null;
    let data: any = null;
    let userInfo: { name: string; email: string } | null = null;
    let recordId = orderId;

    if (apiType === 'admin-payment') {
        isLoading = isLoadingPayment;
        error = errorPayment;
        if (paymentRecord) {
            data = paymentRecord.response;
            userInfo = paymentRecord.user;
            recordId = paymentRecord.paymentId;
        }
    } else {
        const query = apiType === 'admin' ? adminOrderQuery : adminUserOrderQuery;
        isLoading = query.isLoading;
        error = query.error;
        data = query.data;
    }

    // 3. Render Loading
    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Đang tải thông tin...</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // 4. Render Error or No Data
    if (error || !data) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Receipt className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-lg">Không thể tải thông tin</p>
                            <p className="text-sm text-muted-foreground">
                                Có thể dữ liệu không tồn tại hoặc đã bị xóa.
                            </p>
                        </div>
                        {recordId && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded mt-4 font-mono">
                                ID: {recordId}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const { address, items, payment, createdDate, finishPrice, totalPrice, discountPercent } = data;

    // 5. Render Content (PaymentDetailDialog UI)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">

                {/* Header */}
                <div className="p-6 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl">Chi tiết đơn hàng</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Mã: <span className="font-mono font-medium text-foreground">{recordId ? recordId.slice(-8).toUpperCase() : 'N/A'}</span>
                            <span className="mx-2">•</span>
                            {createdDate && new Date(createdDate).toLocaleDateString("vi-VN", {
                                dateStyle: "full",
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {data.orderStatus && (
                            <Badge
                                variant={
                                    data.orderStatus.toLowerCase() === 'success' ? 'default' :
                                        data.orderStatus.toLowerCase() === 'shipping' ? 'secondary' : 'outline'
                                }
                                className={cn(
                                    "h-7 capitalize",
                                    data.orderStatus.toLowerCase() === 'success' && "bg-success hover:bg-success/90"
                                )}
                            >
                                {data.orderStatus.toLowerCase() === 'payment' ? 'Chờ thanh toán' :
                                    data.orderStatus.toLowerCase() === 'shipping' ? 'Đang giao hàng' :
                                        data.orderStatus.toLowerCase() === 'success' ? 'Hoàn thành' : data.orderStatus}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* Customer Info (Only if available) */}
                            {userInfo && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wider">
                                        <User className="h-4 w-4" />
                                        Thông tin khách hàng
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg border space-y-3">
                                        <div>
                                            <p className="text-sm font-medium">{(userInfo as any).name}</p>
                                            <p className="text-sm text-muted-foreground">{(userInfo as any).email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wider">
                                    <MapPin className="h-4 w-4" />
                                    Địa chỉ giao hàng
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg border space-y-1 text-sm">
                                    {address ? (
                                        <>
                                            <div className="mb-2 pb-2 border-b border-border/50">
                                                <p className="font-semibold">{address.nameReceiver || "Chưa có tên"}</p>
                                                <p className="text-muted-foreground">{address.phoneReceiver || "Chưa có SĐT"}</p>
                                            </div>
                                            <p className="font-medium">{address.provinceName || "---"}</p>
                                            <p>{address.districtName || "---"}, {address.wardName || "---"}</p>
                                            <p className="text-muted-foreground pt-1">{address.addressLine || "---"}</p>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground italic">Không có thông tin địa chỉ</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method Details */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wider">
                                    <CreditCard className="h-4 w-4" />
                                    Thanh toán
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg border space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ngân hàng</span>
                                        <span className="font-medium">VNPAY / NCb</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Thời gian</span>
                                        <span className="font-medium">{payment?.createdDate ? new Date(payment.createdDate).toLocaleString("vi-VN") : '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Products & Totals */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wider">
                                <Package className="h-4 w-4" />
                                Sản phẩm ({items?.length || 0})
                            </div>

                            {/* Product List */}
                            <div className="rounded-lg border divide-y overflow-hidden max-h-[300px] overflow-y-auto">
                                {items?.map((item: any) => (
                                    <div key={item.id} className="p-4 flex gap-4 hover:bg-muted/20 transition-colors">
                                        <div className="h-16 w-16 relative flex-shrink-0 bg-muted rounded-md overflow-hidden border">
                                            {item.product.imageUrl ? (
                                                <Image
                                                    src={item.product.imageUrl.url || item.product.imageUrl.fileName}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">IMG</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium line-clamp-1" title={item.product.name}>
                                                    {item.product.name}
                                                </h4>
                                                <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                                                    {item.variant?.color && (
                                                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-5 font-normal">
                                                            {item.variant.color}
                                                        </Badge>
                                                    )}
                                                    {item.variant?.size && (
                                                        <span className="leading-5">Size: {item.variant.size}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="text-xs text-muted-foreground">
                                                    x{item.countBuy}
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {formatCurrency(item.totalMoney)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-primary/5 rounded-lg p-5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tổng tiền hàng</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                {(discountPercent || 0) > 0 && (
                                    <div className="flex justify-between text-sm text-success">
                                        <span>Giảm giá ({discountPercent}%)</span>
                                        <span>- {formatCurrency(totalPrice - finishPrice)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between items-baseline">
                                    <span className="font-semibold">Tổng thanh toán</span>
                                    <span className="text-xl font-bold text-primary">{formatCurrency(finishPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}

