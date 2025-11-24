'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { ProductPaginationResponse, ProductType } from '@/features/product';
import { useProductsPurchased } from '../hooks/useProfile';
import { useAuthStore } from '@/store/useAuthStore';

const ProductCard = ({ product }: { product: ProductType }) => {

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={product.imageUrl?.url || ''}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">Mã đơn: {product.id}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(product.createdDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            {/* <Badge className={statusInfo.color}>{statusInfo.label}</Badge> */}
          </div>

          <div className="flex justify-between items-end mt-3">
            <div>
              <p className="text-sm text-gray-600">
                Số lượng: <span className="font-semibold">Quantity</span>
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {/* ${product.totalPrice.toFixed(2)} */}
                TOTAL
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* {product.status === 'delivered' && ( */}
                <>
                  {/* {product.rating ? (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < product.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  ) : ( */}
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <Star size={14} />
                      Đánh giá
                    </Button>
                  {/* )} */}
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <MessageCircle size={14} />
                    Bình luận
                  </Button>
                </>
              {/* )} */}

              {/* {product.status === 'pending' && ( */}
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <RotateCcw size={14} />
                  Hủy đơn
                </Button>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Review */}
      {/* {product.review && (
        <div className="mt-4 pt-4 border-t bg-gray-50 rounded p-3">
          <p className="text-sm font-semibold mb-1">Đánh giá của bạn:</p>
          <p className="text-sm text-gray-700">{product.review}</p>
        </div>
      )} */}
    </Card>
  );
};

export function ProductListBought() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading } = useProductsPurchased(user?.id || '');
  const products = data || [];
  console.log(products);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h2>


      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="pending">Đang giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}
