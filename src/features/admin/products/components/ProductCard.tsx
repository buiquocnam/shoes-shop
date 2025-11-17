import { CardContent, CardTitle, Card } from "@/components/ui/card";
import Image from "next/image";
import { ProductType } from "@/features/product/types";
import { formatCurrency } from "@/utils";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full">
      <div className="flex items-center gap-3 mb-3 p-4">
        {/* Ảnh sản phẩm */}
        <div className="w-16 h-16 relative flex-shrink-0">
          <Image
            src={product.imageUrl?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 space-y-1">
          <CardTitle className="text-sm font-semibold line-clamp-1">
            {product.name}
          </CardTitle>
          <div className="text-xs text-gray-500 line-clamp-1">
            {product.category?.name || "Không có danh mục"}
          </div>
          <div className="flex items-center mt-2 gap-2">
            <div className="text-sm font-bold text-black">
              {formatCurrency(product.price)}
            </div>
            {product.discount > 0 && (
              <span className="text-xs text-white bg-red-500 rounded px-1">
                {product.discount}%
              </span>
            )}
          </div>
        </div>
       
        <div className="self-start">
          <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuGroup>
        </DropdownMenu>
        </div>
        
      </div>

      <CardContent className="p-4 pt-0">
        <p className="text-gray-600 text-xs mb-3 line-clamp-3">
          {product.description}
        </p>

        <div className="border border-gray-200 rounded-lg p-3 shadow-sm text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-700">Sales</span>
            <div className="flex items-center gap-1">
              <span className="text-orange-500">↑</span>
              <span className="font-semibold text-gray-900">1269</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-1"></div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm">Remaining</span>
            <div className="flex items-center w-2/5 md:w-1/3 gap-2">
              <Progress value={2 / product.totalStock * 100} className="h-2 rounded-full bg-gray-200" />
              <span className="font-semibold text-gray-900 text-sm">{product.totalStock}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
