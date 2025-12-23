"use client";

import Link from "next/link";
import { Plus, History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useReducer, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";

import { columns } from "@/features/admin/products/components/column";
import { useProducts } from "@/features/product/hooks/useProducts";
import { ProductFilters, ProductType } from "@/features/product/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { PurchasedProductsDialog } from "@/features/admin/products/components/PurchasedProductsDialog";
import { usePurchasedItemsByProduct } from "@/features/admin/products/hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemFilters } from "@/features/profile/types";
import { useSearch } from "@/features/shared/hooks/useSearch";

type DialogState = {
  selectedProduct: ProductType | null;
  currentPage: number;
};

type DialogAction =
  | { type: "OPEN"; product: ProductType }
  | { type: "CLOSE" }
  | { type: "SET_PAGE"; page: number };

const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "OPEN":
      return {
        selectedProduct: action.product,
        currentPage: 1, 
      };
    case "CLOSE":
      return {
        selectedProduct: null,
        currentPage: 1,
      };
    case "SET_PAGE":
      return {
        ...state,
        currentPage: action.page,
      };
    default:
      return state;
  }
};

const AdminProductsPage = () => {
  const [dialogState, dispatchDialog] = useReducer(dialogReducer, {
    selectedProduct: null,
    currentPage: 1,
  });

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

  const searchInput = useSearch(nameFromUrl, handleSearch);

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

  const isDialogOpen = !!dialogState.selectedProduct;

  const purchasedItemsFilters: PurchasedItemFilters = useMemo(
    () => ({
      page: dialogState.currentPage,
      limit: pageSize,
    }),
    [dialogState.currentPage, pageSize]
  );

  const { data: purchasedItemsData, isLoading: isLoadingPurchasedItems } = usePurchasedItemsByProduct(
    isDialogOpen ? dialogState.selectedProduct!.id : null,
    isDialogOpen ? purchasedItemsFilters : undefined
  );

  const handlePageChange = useCallback((newPage: number) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  const handleRowClick = useCallback((row: ProductType) => {
    dispatchDialog({ type: "OPEN", product: row });
  }, []); 

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Khi nhấn Enter, tìm ngay lập tức
    if (e.key === "Enter") {
      e.preventDefault();
      updateParams({ name: searchInput.value || undefined, page: 1 });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      dispatchDialog({ type: "CLOSE" });
    }
  };

  const handleDialogPageChange = (page: number) => {
    dispatchDialog({ type: "SET_PAGE", page });
  };

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
          value={searchInput.value}
          className="w-64"
          onChange={searchInput.onChange}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      {dialogState.selectedProduct && (
        <PurchasedProductsDialog
          data={purchasedItemsData}
          isLoading={isLoadingPurchasedItems}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          currentPage={dialogState.currentPage}
          onPageChange={handleDialogPageChange}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;