"use client";

import Link from "next/link";
import { Plus, History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";

import { columns } from "@/features/admin/products/components/column";
import { useProducts } from "@/features/product/hooks/useProducts";
import { ProductFilters, ProductType } from "@/features/product/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { PurchasedItemsDialog } from "@/features/admin/components";
import { usePurchasedItemsByProduct } from "@/features/admin/products/hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemFilters } from "@/features/profile/types";

const AdminProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const name = searchParams.get("name") || "";

  const filters: ProductFilters = useMemo(
    () => ({
      page,
      size,
      name,
    }),
    [page, size, name]
  );

  /** ---------------- fetch ---------------- */
  const { data, isLoading } = useProducts(filters);

  const products: ProductType[] = data?.data || [];

  const pagination = {
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || size,
  };

  const isDialogOpen = !!selectedProduct;

  // Purchased items filters
  const purchasedItemsFilters: PurchasedItemFilters = {
    page: currentPage,
    limit: pageSize,
  };

  const { data: purchasedItemsData, isLoading: isLoadingPurchasedItems } = usePurchasedItemsByProduct(
    isDialogOpen ? selectedProduct!.id : null,
    isDialogOpen ? purchasedItemsFilters : undefined
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Quản lý sản phẩm</h1>

        <div className="flex gap-3">
          <Link href="/admin/products/history">
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              Lịch sử nhập kho
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="bg-red-700 hover:bg-red-800">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm tên sản phẩm..."
          defaultValue={name}
          className="w-64"
          onChange={(e) => {
            if (e.target.value !== name) {
              updateParams({ name: e.target.value, page: 1 });
            }
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
        pagination={pagination}
        onPageChange={(newPage) =>
          updateParams({ page: newPage })
        }
        onRowClick={(row: ProductType) => setSelectedProduct(row)}
      />
      {selectedProduct && (
        <PurchasedItemsDialog
          data={purchasedItemsData}
          isLoading={isLoadingPurchasedItems}
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProduct(null);
              setCurrentPage(1);
            }
          }}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;