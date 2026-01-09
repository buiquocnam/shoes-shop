"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { SearchInput } from "@/features/admin/components";
import { useVariantHistory } from "@/features/admin/products/hooks/queries";
import { createVariantHistoryColumns } from "@/features/admin/products/components/variantHistoryColumns";
import { VariantHistoryFilters } from "@/features/admin/products/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VariantHistoryPage = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();

  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const productId = searchParams.get("productId") || undefined;
  const variantId = searchParams.get("variantId") || undefined;
  const nameFromUrl = searchParams.get("name") || "";

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name: name || undefined, page: 1 });
  }, [updateParams]);

  const filters: VariantHistoryFilters = useMemo(
    () => ({
      page,
      size,
      productId,
      variantId,
      name: nameFromUrl || undefined,
    }),
    [page, size, productId, variantId, nameFromUrl]
  );

  const { data, isLoading } = useVariantHistory(filters);
  const historyItems = data?.data || [];

  const pagination = useMemo(() => ({
    currentPage: data?.currentPage || page,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || size,
  }), [data, page, size]);

  const columns = useMemo(() => createVariantHistoryColumns({
    productId: productId || undefined,
    variantId: variantId || undefined
  }), [productId, variantId]);

  if (isLoading && historyItems.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Lịch sử nhập kho
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi biến động số lượng tồn kho của các sản phẩm.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {productId && (
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="rounded-lg h-9">
                ← Quay lại sản phẩm
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={historyItems}
        pagination={pagination}
        onPageChange={(newPage) => updateParams({ page: newPage })}
        toolbar={
          <SearchInput
            onSearch={handleSearch}
            defaultValue={nameFromUrl}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-10 w-[200px] lg:w-[300px]"
          />
        }
      />
    </div>
  );
};

export default VariantHistoryPage;

