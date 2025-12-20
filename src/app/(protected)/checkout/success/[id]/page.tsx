'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, MapPin, Package, Tag, CreditCard } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { formatCurrency } from '@/utils/format';
import { useOrderDetail } from '@/features/shared/hooks/useOrderDetail';
import { OrderDetail } from '@/features/shared/types/order';

export default function CheckoutSuccessByIdPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const { data: orderDetail, isLoading, error } = useOrderDetail(orderId);
  
  // ===== Loading =====
  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-lg font-semibold">Đang tải thông tin đơn hàng...</p>
          <p className="text-sm text-muted-foreground">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </main>
    );
  }

  // ===== Error =====
  if (error || !orderDetail) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-destructive">
            {error ? 'Không thể tải thông tin đơn hàng' : 'Không tìm thấy đơn hàng'}
          </p>
          <Button asChild>
            <Link href="/profile/orders">Xem đơn hàng của tôi</Link>
          </Button>
        </div>
      </main>
    );
  }

  return <OrderSuccessContent orderDetail={orderDetail} />;
}

function OrderSuccessContent({ orderDetail }: { orderDetail: OrderDetail }) {
  const address = orderDetail.address;
  const items = orderDetail.items || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Đặt hàng thành công!
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi
              </p>
            </div>
          </div>

          {/* Order Info Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm font-mono px-4 py-2">
             #{orderDetail.id}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground px-4 py-2 rounded-md bg-muted">
              <Calendar className="h-4 w-4" />
              <span>{new Date(orderDetail.createdDate).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Address Section */}
          {address && (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                      Địa chỉ giao hàng
                    </h3>
                    <p className="font-semibold text-gray-900 mb-1">
                      {address.addressLine}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.wardName}, {address.districtName}, {address.provinceName}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Items Section */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Sản phẩm đã đặt
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {items.length} sản phẩm trong đơn hàng
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const product = item.product;
                const variant = item.variant;
                const imageUrl = product.imageUrl?.url || "";

                return (
                  <div key={item.id}>
                    <div className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border bg-muted">
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
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {product.brand && (
                            <Badge variant="secondary" className="text-xs h-5">
                              {product.brand.name}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs h-5">
                            {variant.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs h-5">
                            Size {variant.size}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Số lượng: <span className="font-medium text-foreground">{item.countBuy}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              {formatCurrency(item.totalMoney)}
                            </p>
                            {item.countBuy > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(item.totalMoney / item.countBuy)}/sản phẩm
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="my-4" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền hàng:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(orderDetail.totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mã giảm giá - %:</span>
                <span className="font-medium text-gray-900">
                  {orderDetail.couponCode ? `${orderDetail.couponCode} - ${orderDetail.discountPercent}%` : 'Không có'}
                </span>
              </div>

              {orderDetail.couponCode && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Mã giảm giá:</span>
                    <Badge variant="outline" className="text-xs">
                      {orderDetail.couponCode}
                    </Badge>
                  </div>
                  {orderDetail.discountPercent && (
                    <span className="font-medium text-green-600">
                      -{orderDetail.discountPercent}%
                    </span>
                  )}
                </div>
              )}

              {orderDetail.discountPercent && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Giảm giá:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(orderDetail.totalPrice - orderDetail.finishPrice)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold text-gray-900">Thành tiền:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(orderDetail.finishPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild className="flex-1 sm:flex-initial">
            <Link href="/profile/orders" className="flex items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              Xem đơn hàng của tôi
            </Link>
          </Button>
          <Button size="lg" asChild className="flex-1 sm:flex-initial">
            <Link href="/products" className="flex items-center justify-center gap-2">
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
