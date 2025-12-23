"use client";

import { Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useReducer, useMemo, useCallback } from "react";
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
import { useSearch } from "@/features/shared/hooks/useSearch";

// Form state type
type FormState = {
  isOpen: boolean;
  selectedCoupon: Coupon | undefined;
};

// Form actions
type FormAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; coupon: Coupon }
  | { type: "CLOSE" };

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        isOpen: true,
        selectedCoupon: undefined,
      };
    case "OPEN_EDIT":
      return {
        isOpen: true,
        selectedCoupon: action.coupon,
      };
    case "CLOSE":
      return {
        isOpen: false,
        selectedCoupon: undefined,
      };
    default:
      return state;
  }
};

const AdminCouponsPage = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  
  // useReducer cho form state - clean hơn khi có nhiều state liên quan
  const [formState, dispatchForm] = useReducer(formReducer, {
    isOpen: false,
    selectedCoupon: undefined,
  });
  
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const codeFromUrl = searchParams.get("code") || "";
  const activeParam = searchParams.get("active");

  const handleSearch = useCallback((code?: string) => {
    updateParams({ code, page: 1 });
  }, []);

  const searchInput = useSearch(codeFromUrl, handleSearch);
  
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
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      totalElements: data?.totalElements || 0,
      pageSize: data?.pageSize || size,
    }),
    [data?.currentPage, data?.totalPages, data?.totalElements, data?.pageSize, size]
  );

  // Các handlers không cần useCallback vì logic không thay đổi hoặc components không được memoized
  const handleCreate = () => {
    dispatchForm({ type: "OPEN_CREATE" });
  };

  const handleEdit = useCallback((coupon: Coupon) => {
    dispatchForm({ type: "OPEN_EDIT", coupon });
  }, []);

  const handleFormOpenChange = (open: boolean) => {
    if (!open) {
      dispatchForm({ type: "CLOSE" });
    }
  };

  // Handlers cho native elements - không cần useCallback
  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      updateParams({ active: undefined, page: 1 });
    } else {
      updateParams({ active: value, page: 1 });
    }
  };

  const columns = useMemo(() => createColumns({ onEdit: handleEdit }), [handleEdit]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý mã giảm giá
          </h1>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              className="h-10 w-full rounded-lg bg-white pl-10 pr-4 text-sm placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Tìm kiếm theo mã giảm giá..."
              value={searchInput.value}
              onChange={searchInput.onChange}
              onKeyDown={(e) => searchInput.onKeyDown(e, (value: string) => handleSearch(value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
            <span className="text-xs font-medium text-gray-500">Trạng thái:</span>
            <Select
              value={activeParam || "all"}
              onValueChange={handleStatusChange}
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
          onPageChange={handlePageChange}
        />

      <CouponForm
        coupon={formState.selectedCoupon}
        open={formState.isOpen}
        onOpenChange={handleFormOpenChange}
      />
    </div>
  );
};

export default AdminCouponsPage;

