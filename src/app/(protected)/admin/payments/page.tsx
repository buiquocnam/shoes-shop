"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { PaymentDetailDialog, usePayments, paymentColumns } from "@/features/admin/payments";
import { PaymentFilters, Payment } from "@/features/admin/payments";
import { useUpdateParams } from "@/features/admin/util/updateParams";

const AdminPaymentsPage = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

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

  const payments: Payment[] = data?.data || [];

  const pagination = {
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || size,
  };

  const columns = paymentColumns((payment: Payment) => {
    setSelectedPayment(payment);
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Quản lý thanh toán</h1>
      </div>

      <div className="rounded-lg ">
        <DataTable
          columns={columns}
          data={payments}
          pagination={pagination}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      </div>

      {selectedPayment && (
        <PaymentDetailDialog
          paymentId={selectedPayment.id}
          open={!!selectedPayment}
          onOpenChange={(open) => {
            if (!open) setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPaymentsPage;
