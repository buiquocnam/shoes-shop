"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";

import { useGetUsers } from "@/features/admin/users/hooks/useUsers";
import { userColumns } from "@/features/admin/users/components/columns";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { PurchasedOrdersDialog } from "@/features/admin/users/components/PurchasedOrdersDialog";
import { useUpdateUser } from "@/features/admin/users/hooks";
import { usePurchasedItems } from "@/features/admin/users/hooks";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { User } from "@/types";
import { SearchInput } from "@/features/admin/components/SearchInput";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const nameFromUrl = searchParams.get("name") || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name, page: 1 });
  }, [updateParams]);

  const { data, isLoading } = useGetUsers({
    name: nameFromUrl || undefined,
    page: pageFromUrl,
    size: 10,
  });

  const updateUser = useUpdateUser();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [purchasedUser, setPurchasedUser] = useState<User | null>(null);
  const [purchasedPage, setPurchasedPage] = useState(1);

  const purchasedItems = usePurchasedItems(
    purchasedUser?.id ?? null,
    purchasedUser ? { page: purchasedPage, size: 10 } : undefined
  );

  const columns = useMemo(() => userColumns(setEditingUser, setPurchasedUser), []);

  const pagination = useMemo(() => ({
    currentPage: data?.currentPage || pageFromUrl,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || 10,
  }), [data, pageFromUrl]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Người dùng
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý tài khoản khách hàng và phân quyền hệ thống.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={pagination}
        onPageChange={(p) => updateParams({ page: p })}
        toolbar={
          <SearchInput
            onSearch={handleSearch}
            defaultValue={nameFromUrl}
            placeholder="Tìm kiếm người dùng..."
            className="h-10 w-[200px] lg:w-[300px]"
          />
        }
      />

      {editingUser && (
        <UserForm
          user={editingUser}
          open
          isLoading={updateUser.isPending}
          onOpenChange={() => setEditingUser(null)}
          onSubmit={updateUser.mutateAsync}
        />
      )}

      {purchasedUser && (
        <PurchasedOrdersDialog
          {...purchasedItems}
          open
          currentPage={purchasedPage}
          onPageChange={setPurchasedPage}
          onOpenChange={() => setPurchasedUser(null)}
        />
      )}
    </div>
  );
}
