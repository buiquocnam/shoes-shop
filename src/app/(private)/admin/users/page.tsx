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
import { User } from "@/types/global";
import { SearchInput } from "@/features/admin/components/SearchInput";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const nameFromUrl = searchParams.get("name") || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name, page: 1 });
  }, [updateParams]);

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
  };

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
    purchasedUser ? { page: purchasedPage, limit: 10 } : undefined
  );

  const columns = userColumns(setEditingUser, setPurchasedUser);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Quản lý người dùng
      </h1>

      <SearchInput
        onSearch={handleSearch}
        defaultValue={nameFromUrl}
        placeholder="Tìm kiếm tên người dùng..."
        withContainer
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          pagination={{
            currentPage: data?.currentPage || 1,
            totalPages: data?.totalPages || 1,
            totalElements: data?.totalElements || 0,
            pageSize: data?.pageSize || 10,
          }}
          onPageChange={handlePageChange}
        />
      )}

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
