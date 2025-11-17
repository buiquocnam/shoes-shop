'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { ProductPaginationResponse, ProductType } from '@/features/product';

interface BoughtProduct {
  id: string;
  orderId: string;
  orderDate: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: 'delivered' | 'pending' | 'cancelled';
  rating?: number;
  review?: string;
}

// Mock data
const mockBoughtProducts: ProductType[] = [
  {
 
            "id": "69124afe7b2d1e95535cba9b",
            "category": {
                "id": "6911c3dfc67b2f07446d3805",
                "name": "Soccer Shoes",
                "description": "Soccer Shoes",
                "parentId": "6911c3adc67b2f07446d3802"
            },
            "brand": {
                "id": "6911c3f3c67b2f07446d3806",
                "name": "ad",
                "logo": "http://minio-api:9000/resources/58ff4410-f2ea-4779-82eb-fb0c6c92567c_airpod%20pro%202_1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20251110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251110T105236Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=1e9f52e41cb1afc76fcdf3b60d14de957774c1a62aaf25184d9eae46f6337402",
                "createdDate": "2025-11-10T10:52:35.848Z",
                "modifiedDate": "2025-11-10T10:52:36.536Z"
            },
            "name": "Nike Air Zoom Pegasus 41",
            "slug": "nike-air-zoom-pegasus-41",
            "description": "Lightweight daily trainer with responsive cushioning.",
            "price": 129.99,
            "discount": 10.0,
            "totalStock": 5,
            "status": "ACTIVE",
            "createdDate": "2025-11-10T20:28:46.233Z",
            "averageRating": 3,
            "modifiedDate": "2025-11-12T09:33:39.192Z",
            "imageUrl": {
                "fileName": "7aff750b-3cc0-4207-8104-9f1c5306e318_pepe2.jpg",
                "url": "http://localhost:9000/resources/7aff750b-3cc0-4207-8104-9f1c5306e318_pepe2.jpg"
            },
  },
  
];

// const getStatusLabel = (status: string) => {
//   const statusMap = {
//     delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
//     pending: { label: 'Đang giao', color: 'bg-yellow-100 text-yellow-800' },
//     cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
//   };
//   return statusMap[status as keyof typeof statusMap];
// };

const ProductCard = ({ product }: { product: ProductType }) => {
  // const statusInfo = getStatusLabel(product.status);

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
  const [activeTab, setActiveTab] = useState('all');

  // Filter products
  const filteredProducts =
    activeTab === 'all'
      ? mockBoughtProducts
      : mockBoughtProducts.filter((p) => p.status === activeTab);

  // const stats = {
  //   total: mockBoughtProducts.length,
  //   delivered: mockBoughtProducts.filter((p) => p.status === 'delivered').length,
  //   pending: mockBoughtProducts.filter((p) => p.status === 'pending').length,
  //   cancelled: mockBoughtProducts.filter((p) => p.status === 'cancelled').length,
  // };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Tổng đơn</p>
          <p className="text-2xl font-bold text-blue-600">STATUS</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Đã giao</p>
          <p className="text-2xl font-bold text-green-600">STATUS</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Đang giao</p>
          <p className="text-2xl font-bold text-yellow-600">STATUS</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Đã hủy</p>
          <p className="text-2xl font-bold text-red-600">STATUS</p>
        </div>
      </div>

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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
