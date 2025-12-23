"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import Loading from "@/features/admin/components/Loading";
import { SearchInput } from "@/features/admin/components";

import { useGetUsers } from "@/features/admin/users/hooks/useUsers";
import { userColumns } from "@/features/admin/users/components/columns";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { PurchasedOrdersDialog } from "@/features/admin/users/components/PurchasedOrdersDialog";
import { useUpdateUser } from "@/features/admin/users/hooks";
import { usePurchasedItems } from "@/features/admin/users/hooks";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { User } from "@/types/global";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const nameFromUrl = searchParams.get("name") || "";

  const handleSearch = (value: string) => {
    updateParams({ name: value || undefined });
  };
  const { data = [], isLoading } = useGetUsers({
    name: nameFromUrl || undefined,
  });

  const updateUser = useUpdateUser();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [purchasedUser, setPurchasedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);

  const purchasedItems = usePurchasedItems(
    purchasedUser?.id ?? null,
    purchasedUser ? { page, limit: 10 } : undefined
  );

  const columns = userColumns(setEditingUser, setPurchasedUser);

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>

      <SearchInput
        onSearch={handleSearch}
        defaultValue={nameFromUrl}
        placeholder="Tìm kiếm tên người dùng..."
      />

      <DataTable
        columns={columns}
        data={data}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalElements: data.length,
          pageSize: 10,
        }}
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
          currentPage={page}
          onPageChange={setPage}
          onOpenChange={() => setPurchasedUser(null)}
        />
      )}
    </div>
  );
}
