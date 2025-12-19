"use client";

import { useState } from "react";
import { useGetUsers } from "@/features/admin/users/hooks/useUsers";
import { DataTable } from "@/components/ui/data-table";
import { userColumns } from "@/features/admin/users/components/columns";
import { User } from "@/types/global";
import Loading from "@/features/admin/components/Loading";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { useUpdateUser, useDeleteUser } from "@/features/admin/users/hooks";
import { ConfirmAlert } from "@/features/admin/components";
import { PurchasedItemsDialog } from "@/features/admin/components";
import { usePurchasedItems } from "@/features/admin/users/hooks";
import { PurchasedItemFilters } from "@/features/profile/types";

const AdminUsersPage = () => {
  const { data, isLoading } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [purchasedItemsUser, setPurchasedItemsUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users: User[] = data || [];

  const purchasedItemsFilters: PurchasedItemFilters = {
    page: currentPage,
    limit: pageSize,
  };

  const { data: purchasedItemsData, isLoading: purchasedItemsLoading } =
    usePurchasedItems(
      purchasedItemsUser ? purchasedItemsUser.id : null,
      purchasedItemsUser ? purchasedItemsFilters : undefined
    );

  const handleUpdateUser = async (data: {
    id: string;
    name: string;
    phone?: string;
    status?: boolean;
  }) => {
    await updateUserMutation.mutateAsync(data);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUserMutation.mutateAsync([userToDelete.id]);
      setUserToDelete(null);
    }
  };


  const columns = userColumns(
    (user) => setSelectedUser(user),
    (user) => setUserToDelete(user),
    (user) => setPurchasedItemsUser(user)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
      <DataTable
        columns={columns}
        data={users}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalElements: users.length,
          pageSize: 10,
        }}
      />

      {/* Edit Form */}
      {selectedUser && (
        <UserForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          isLoading={updateUserMutation.isPending}
          open={!!selectedUser}
          onOpenChange={(open) => {
            if (!open) setSelectedUser(null);
          }}
        />
      )}

      {/* Delete Alert */}
      {userToDelete && (
        <ConfirmAlert
          onConfirm={handleDelete}
          itemName={userToDelete.name}
          open={!!userToDelete}
          onOpenChange={(open) => {
            if (!open) setUserToDelete(null);
          }}
        />
      )}

      {/* Purchased Items Dialog */}
      {purchasedItemsUser && (
        <PurchasedItemsDialog
          data={purchasedItemsData}
          isLoading={purchasedItemsLoading}
          open={!!purchasedItemsUser}
          onOpenChange={(open) => {
            if (!open) {
              setPurchasedItemsUser(null);
              setCurrentPage(1);
            }
          }}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;