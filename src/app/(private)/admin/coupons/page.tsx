"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CouponFilters, Coupon } from "@/features/admin/coupons/types";
import { useUpdateParams } from "@/features/admin/util/updateParams";

const AdminCouponsPage = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);
  
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const code = searchParams.get("code") || "";
  const activeParam = searchParams.get("active");
  const active = activeParam === "true" ? true : activeParam === "false" ? false : undefined;

  const filters: CouponFilters = useMemo(
    () => ({
      page,
      limit: size,
      code: code || undefined,
      active,
    }),
    [page, size, code, active]
  );

  /** ---------------- Lấy dữ liệu ---------------- */
  const { data, isLoading } = useCoupons(filters);

  const coupons: Coupon[] = data?.data || [];

  const pagination = {
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || size,
  };

  const handleCreate = () => {
    setSelectedCoupon(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCoupon(undefined);
  };

  const columns = useMemo(
    () => createColumns({ onEdit: handleEdit }),
    []
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý mã giảm giá
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo, chỉnh sửa & quản lý mã giảm giá cho cửa hàng của bạn.
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Thêm mã giảm giá
        </Button>
      </div>

      <div className="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:flex md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <Input
              className="h-10 w-full rounded-lg bg-white pl-10 pr-4 text-sm placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Tìm kiếm theo mã giảm giá..."
              value={code}
              onChange={(e) => {
                updateParams({ code: e.target.value, page: 1 });
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
            <span className="text-xs font-medium text-gray-500">Trạng thái:</span>
            <Select
              value={activeParam || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  updateParams({ active: undefined, page: 1 });
                } else {
                  updateParams({ active: value, page: 1 });
                }
              }}
            >
              <SelectTrigger className="border-none p-2 cursor-pointer font-semibold text-gray-900 focus:ring-0 h-auto w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Đã tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

        <DataTable
          columns={columns}
          data={coupons}
          pagination={pagination}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />

      <CouponForm
        coupon={selectedCoupon}
        open={isFormOpen}
        onOpenChange={handleCloseForm}
      />
    </div>
  );
};

export default AdminCouponsPage;

