"use client";

import Link from "next/link";
import { Plus, History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { SearchInput } from "@/features/admin/components/SearchInput";

import { columns } from "@/features/admin/products/components/column";
import { useProducts } from "@/features/product/hooks/useProducts";
import { ProductFilters, ProductType } from "@/features/product/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { PurchasedProductsDialog } from "@/features/admin/products/components/PurchasedProductsDialog";
import { usePurchasedItemsByProduct } from "@/features/admin/products/hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemFilters } from "@/features/profile/types";

const AdminProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [dialogCurrentPage, setDialogCurrentPage] = useState(1);

  const pageSizeRef = useRef(10);
  const pageSize = pageSizeRef.current;
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const nameFromUrl = searchParams.get("name") || "";

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name, page: 1 });
  }, [updateParams]);

  const filters: ProductFilters = useMemo(
    () => ({
      page,
      size,
      name: nameFromUrl,
    }),
    [page, size, nameFromUrl]
  );

  const { data, isLoading } = useProducts(filters);

  const products: ProductType[] = useMemo(
    () => data?.data || [],
    [data?.data]
  );

  const pagination = useMemo(
    () => ({
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      totalElements: data?.totalElements || 0,
      pageSize: data?.pageSize || size,
    }),
    [data?.currentPage, data?.totalPages, data?.totalElements, data?.pageSize, size]
  );

  const isDialogOpen = !!selectedProduct;

  const purchasedItemsFilters: PurchasedItemFilters = useMemo(
    () => ({
      page: dialogCurrentPage,
      limit: pageSize,
    }),
    [dialogCurrentPage, pageSize]
  );

  const { data: purchasedItemsData, isLoading: isLoadingPurchasedItems } = usePurchasedItemsByProduct(
    isDialogOpen ? selectedProduct!.id : null,
    isDialogOpen ? purchasedItemsFilters : undefined
  );

  const handlePageChange = useCallback((newPage: number) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  const handleRowClick = useCallback((row: ProductType) => {
    setSelectedProduct(row);
    setDialogCurrentPage(1);
  }, []);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedProduct(null);
      setDialogCurrentPage(1);
    }
  };

  const handleDialogPageChange = (page: number) => {
    setDialogCurrentPage(page);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý sản phẩm
        </h1>
        <div className="flex gap-3">
          <Link href="/admin/products/history">
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              Lịch sử nhập kho
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      <SearchInput
        onSearch={handleSearch}
        defaultValue={nameFromUrl}
        placeholder="Tìm kiếm tên sản phẩm..."
        withContainer
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}
      {selectedProduct && (
        <PurchasedProductsDialog
          data={purchasedItemsData}
          isLoading={isLoadingPurchasedItems}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          currentPage={dialogCurrentPage}
          onPageChange={handleDialogPageChange}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;