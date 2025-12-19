"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { useVariantHistory } from "@/features/admin/products/hooks/queries";
import { variantHistoryColumns } from "@/features/admin/products/components/variantHistoryColumns";
import { VariantHistoryFilters } from "@/features/admin/products/services/products.api";
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

  const filters: VariantHistoryFilters = useMemo(
    () => ({
      page,
      size,
    }),
    [page, size]
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

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold">Lịch sử nhập kho biến thể</h1>
        </div>
        <Link href="/admin/products">
          <Button variant="outline">Quay lại danh sách sản phẩm</Button>
        </Link>
      </div>

      <div className="rounded-lg  ">
        <DataTable
          columns={variantHistoryColumns}
          data={historyItems}
          pagination={pagination}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      </div>
    </div>
  );
};

export default VariantHistoryPage;

