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
import { usePaymentDetail } from "../hooks/usePaymentDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, User, Package, Calendar, Building2 } from "lucide-react";
import { Payment } from "../types";

interface PaymentDetailDialogProps {
  paymentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailDialog({
  paymentId,
  open,
  onOpenChange,
}: PaymentDetailDialogProps) {
  const { data: payment, isLoading, error } = usePaymentDetail(
    open ? paymentId : null
  );

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết thanh toán</DialogTitle>
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

  if (error || !payment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-destructive mb-3" />
            <p className="font-semibold text-destructive">
              Không thể tải thông tin thanh toán
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const product = payment.product;
  const variant = payment.variant;
  const user = payment.user;
  const imageUrl = product.imageUrl?.url || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Chi tiết thanh toán</DialogTitle>
            <Badge variant="secondary" className="text-xs font-mono">
              #{payment.id.slice(-8)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h5 className="font-semibold text-sm">Thông tin thanh toán</h5>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Mã thanh toán:</span>
                <p className="font-semibold font-mono">{payment.code}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Ngân hàng:</span>
                <p className="font-semibold">{payment.bankCode}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground">Số tiền:</span>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              {payment.expiryDate && (
                <div>
                  <span className="text-xs text-muted-foreground">Ngày hết hạn:</span>
                  <p className="font-semibold">
                    {new Date(payment.expiryDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <h5 className="font-semibold text-sm">Người dùng</h5>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-primary" />
              <h5 className="font-semibold text-sm">Sản phẩm</h5>
            </div>
            <div className="flex gap-4">
              {imageUrl && (
                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {product.brand && (
                    <Badge variant="secondary" className="text-xs">
                      {product.brand.name}
                    </Badge>
                  )}
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                  <Badge variant="default" className="text-xs">
                    {variant.color}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Size: {variant.size}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Giá: <span className="font-semibold text-foreground">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
