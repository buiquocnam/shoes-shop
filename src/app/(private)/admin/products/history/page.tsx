"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
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

  const filters: VariantHistoryFilters = useMemo(
    () => ({
      page,
      size,
      productId,
      variantId,
    }),
    [page, size, productId, variantId]
  );

  /** ---------------- fetch ---------------- */
  const { data, isLoading } = useVariantHistory(filters);

  const historyItems = data?.data || [];

  const pagination = {
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || size,
  };

  // Create columns with filter props
  const columns = createVariantHistoryColumns({
    productId: productId || undefined,
    variantId: variantId || undefined
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-black tracking-tight">Product Variant Quantity History</h1>
            {productId && (
              <p className="text-sm text-muted-foreground mt-1">
                Đang lọc theo sản phẩm
              </p>
            )}
            {variantId && (
              <p className="text-sm text-muted-foreground mt-1">
                Đang lọc theo biến thể
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {variantId && productId && (
            <Link href={`/admin/products/history?productId=${productId}`}>
              <Button variant="outline" size="sm">
                ← Quay lại sản phẩm
              </Button>
            </Link>
          )}
          {productId && !variantId && (
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                ← Quay lại danh sách
              </Button>
            </Link>
          )}
          {!productId && (
            <Link href="/admin/products">
              <Button variant="outline">Quay lại danh sách sản phẩm</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-lg  ">
        <DataTable
          columns={columns}
          data={historyItems}
          pagination={pagination}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      </div>
    </div>
  );
};

export default VariantHistoryPage;

