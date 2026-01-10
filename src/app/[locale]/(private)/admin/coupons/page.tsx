"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createColumns } from "@/features/admin/coupons/components/columns";
import { CouponForm } from "@/features/admin/coupons/components/CouponForm";
import { useCoupons } from "@/features/admin/coupons/hooks/useCoupons";
import { CouponFilters, Coupon } from "@/types/coupon";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { SearchInput } from "@/features/admin/components/SearchInput";

const AdminCouponsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const codeFromUrl = searchParams.get("code") || "";
  const activeParam = searchParams.get("active");

  const handleSearch = useCallback((code?: string) => {
    updateParams({ code, page: 1 });
  }, [updateParams]);

  // Memoize active value derivation
  const active = useMemo(() => {
    return activeParam === "true" ? true : activeParam === "false" ? false : undefined;
  }, [activeParam]);

  const filters: CouponFilters = useMemo(
    () => ({
      page,
      limit: size,
      code: codeFromUrl || undefined,
      active,
    }),
    [page, size, codeFromUrl, active]
  );

  /** ---------------- Lấy dữ liệu ---------------- */
  const { data, isLoading } = useCoupons(filters);

  const coupons: Coupon[] = useMemo(
    () => data?.data || [],
    [data?.data]
  );

  const pagination = useMemo(
    () => ({
      currentPage: data?.currentPage || page,
      totalPages: data?.totalPages || 1,
      totalElements: data?.totalElements || 0,
      pageSize: data?.pageSize || size,
    }),
    [data?.currentPage, data?.totalPages, data?.totalElements, data?.pageSize, page, size]
  );

  const handleCreate = () => {
    setSelectedCoupon(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = (open: boolean) => {
    if (!open) {
      setIsFormOpen(false);
      setSelectedCoupon(undefined);
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      updateParams({ active: undefined, page: 1 });
    } else {
      updateParams({ active: value, page: 1 });
    }
  };

  const columns = useMemo(() => createColumns({ onEdit: handleEdit }), [handleEdit]);

  if (isLoading && coupons.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Mã giảm giá
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các chương trình khuyến mãi và mã giảm giá.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans"
        >
          <Plus className="h-4 w-4" />
          Thêm mã giảm giá
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        pagination={pagination}
        onPageChange={(p) => updateParams({ page: p })}
        toolbar={
          <div className="flex items-center gap-2">
            <SearchInput
              onSearch={handleSearch}
              defaultValue={codeFromUrl}
              placeholder="Mã giảm giá..."
              className="h-10 w-[150px] lg:w-[250px]"
            />
            <Select
              value={activeParam || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-10 w-[130px] bg-white border-border/50">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Đã tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <CouponForm
        coupon={selectedCoupon}
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
      />
    </div>
  );
};

export default AdminCouponsPage;

