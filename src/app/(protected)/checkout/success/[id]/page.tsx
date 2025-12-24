'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReceiptIcon, MapPin, Package } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

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
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background-light">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-lg font-semibold text-gray-900">Đang tải thông tin đơn hàng...</p>
        </div>
      </main>
    );
  }

  // ===== Error =====
  if (error || !orderDetail) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background-light">
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

  return <OrderDetailContent orderDetail={orderDetail} />;
}

function OrderDetailContent({ orderDetail }: { orderDetail: OrderDetail }) {
  const address = orderDetail.address;
  const items = orderDetail.items || [];
  const orderDate = new Date(orderDetail.createdDate);

  return (
    <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 bg-background-light">
      <div className="max-w-[1280px] mx-auto flex flex-col">
        {/* Header */}
        <h1 className="text-gray-900 font-serif font-extrabold text-3xl md:text-4xl leading-tight tracking-tight mb-2">
          Chi tiết đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-gray-900 text-xl font-bold flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  Sản phẩm đã mua
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {items.length} {items.length === 1 ? 'sản phẩm' : 'sản phẩm'}
                </span>
              </div>
              <div className="flex flex-col p-2">
                {items.map((item, index) => {
                  const product = item.product;
                  const variant = item.variant;
                  const imageUrl = product.imageUrl?.url || '';

                  return (
                    <div key={item.id}>
                      <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl hover:bg-[#fcfbfb] transition-colors group">
                        <div className="relative w-full sm:w-28 h-28 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-inner">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <span className="text-xs">Không có hình ảnh</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-gray-900 font-bold text-lg group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 font-medium">
                                <span>{variant.color}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>Size {variant.size}</span>
                              </div>
                            </div>
                            <p className="text-gray-900 font-bold text-xl">
                              {formatCurrency(item.totalMoney / item.countBuy)}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-4 sm:mt-0">
                            <div className="text-gray-600 text-sm font-medium">
                              Số lượng: <span className="text-gray-900 font-bold">{item.countBuy}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 uppercase font-bold tracking-wider mb-0.5">
                                Tổng
                              </p>
                              <p className="text-primary font-bold text-lg">
                                {formatCurrency(item.totalMoney)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && (
                        <div className="h-px bg-gray-50 mx-6"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Information */}
            {address && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  Thông tin giao hàng
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-background-light p-4 rounded-xl flex items-center justify-center text-primary w-16 h-16 shrink-0">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="text-gray-900 text-base leading-relaxed">
                        {address.addressLine}<br/>
                        {address.wardName}, {address.districtName}<br/>
                        {address.provinceName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Overview */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <h2 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5 text-primary" />
                Tổng quan đơn hàng
              </h2>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>Mã đơn hàng</span>
                    <span className="text-gray-900 font-medium text-xs bg-gray-100 px-2 py-1 rounded">
                      #{orderDetail.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>Ngày đặt</span>
                    <span className="text-gray-900 font-medium text-sm">
                      {orderDate.toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="text-sm">Tạm tính</span>
                    <span className="text-gray-900 font-bold">
                      {formatCurrency(orderDetail.totalPrice)}
                    </span>
                  </div>
                  {orderDetail.discountPercent && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="text-sm">
                        Giảm giá{' '}
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded ml-1">
                          -{orderDetail.discountPercent}%
                        </span>
                      </span>
                      <span className="text-primary font-medium">
                        -{formatCurrency(orderDetail.totalPrice - orderDetail.finishPrice)}
                      </span>
                    </div>
                  )}
                  {orderDetail.couponCode && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="text-sm">Mã giảm giá</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold border-primary/20">
                        {orderDetail.couponCode}
                      </span>
                    </div>
                  )}
                
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold text-lg">Tổng thanh toán</span>
                  <span className="text-primary font-black text-3xl leading-none">
                    {formatCurrency(orderDetail.finishPrice)}
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
