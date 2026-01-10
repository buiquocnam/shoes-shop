"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { usePayments, paymentColumns, PaymentFilters, PaymentRecord } from "@/features/admin/payments";
import { OrderDetailDialog } from "@/features/shared/components/order/OrderDetailDialog";
import { useUpdateParams } from "@/features/admin/util/updateParams";

const AdminPaymentsPage = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);

  const filters: PaymentFilters = useMemo(
    () => ({
      page,
      limit: size,
    }),
    [page, size]
  );

  /** ---------------- fetch ---------------- */
  const { data, isLoading } = usePayments(filters);

  const payments: PaymentRecord[] = useMemo(
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

  // Handlers - không cần useCallback vì components không được memoized
  const handleViewDetail = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedPayment(null);
    }
  };

  // columns không cần useMemo vì handleViewDetail logic không thay đổi
  const columns = paymentColumns(handleViewDetail);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Quản lý thanh toán
      </h1>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {selectedPayment && (
        <OrderDetailDialog
          orderId={selectedPayment.paymentId}
          open={!!selectedPayment}
          onOpenChange={handleDialogClose}
          apiType="admin-payment"
        />
      )}
    </div>
  );
};

export default AdminPaymentsPage;
