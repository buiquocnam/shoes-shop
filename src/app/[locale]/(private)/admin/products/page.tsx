"use client";

import Link from "next/link";
import { Plus, History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { SearchInput } from "@/features/admin/components/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "@/features/admin/products/components/column";
import { useProducts } from "@/features/product/hooks/useProducts";
import { ProductFilters, ProductType } from "@/features/product/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { PurchasedProductsDialog } from "@/features/admin/products/components/PurchasedProductsDialog";
import { usePurchasedItemsByProduct } from "@/features/admin/products/hooks/queries/usePurchasedItemsByProduct";
import { PurchasedItemFilters } from "@/features/profile/types";
import { useCategories, useBrands } from "@/features/shared";

const AdminProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [dialogCurrentPage, setDialogCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const nameFromUrl = searchParams.get("name") || "";
  const categoryIdFromUrl = searchParams.get("category_id") || "";
  const brandIdFromUrl = searchParams.get("brand_id") || "";

  // Fetch categories and brands for filters
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name, page: 1 });
  }, [updateParams]);

  const handleCategoryChange = (value: string) => {
    updateParams({ category_id: value === "all" ? undefined : value, page: 1 });
  };

  const handleBrandChange = (value: string) => {
    updateParams({ brand_id: value === "all" ? undefined : value, page: 1 });
  };

  const filters: ProductFilters = useMemo(
    () => ({
      page,
      size,
      name: nameFromUrl || undefined,
      category_id: categoryIdFromUrl || undefined,
      brand_id: brandIdFromUrl || undefined,
    }),
    [page, size, nameFromUrl, categoryIdFromUrl, brandIdFromUrl]
  );

  const { data, isLoading } = useProducts(filters);
  const products: ProductType[] = data?.data || [];

  const pagination = useMemo(
    () => ({
      currentPage: data?.currentPage || page,
      totalPages: data?.totalPages || 1,
      totalElements: data?.totalElements || 0,
      pageSize: data?.pageSize || size,
    }),
    [data, page, size]
  );

  const isDialogOpen = !!selectedProduct;

  const purchasedItemsFilters: PurchasedItemFilters = useMemo(
    () => ({
      page: dialogCurrentPage,
      limit: 10,
    }),
    [dialogCurrentPage]
  );

  const { data: purchasedItemsData, isLoading: isLoadingPurchasedItems } = usePurchasedItemsByProduct(
    isDialogOpen ? selectedProduct!.id : null,
    isDialogOpen ? purchasedItemsFilters : undefined
  );

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

  if (isLoading && products.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý kho hàng, giá bán và thông tin chi tiết sản phẩm.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/history">
            <Button variant="outline" className="rounded-lg h-10 border-border/50">
              <History className="mr-2 h-4 w-4" />
              Lịch sử nhập
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="rounded-lg h-10 bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        pagination={pagination}
        onPageChange={(p) => updateParams({ page: p })}
        onRowClick={handleRowClick}
        toolbar={
          <div className="flex items-center gap-2">
            <SearchInput
              onSearch={handleSearch}
              defaultValue={nameFromUrl}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-10 w-[150px] lg:w-[250px]"
            />
            <Select
              value={categoryIdFromUrl || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-10 w-[130px] bg-card border-border/50">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={brandIdFromUrl || "all"}
              onValueChange={handleBrandChange}
            >
              <SelectTrigger className="h-10 w-[130px] bg-card border-border/50">
                <SelectValue placeholder="Thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

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