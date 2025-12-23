"use client";

import { useReducer, useMemo, useRef } from "react";
import { useGetUsers } from "@/features/admin/users/hooks/useUsers";
import { DataTable } from "@/components/ui/data-table";
import { userColumns } from "@/features/admin/users/components/columns";
import { User } from "@/types/global";
import Loading from "@/features/admin/components/Loading";
import { UserForm } from "@/features/admin/users/components/UserForm";
import { useUpdateUser } from "@/features/admin/users/hooks";
import { PurchasedOrdersDialog } from "@/features/admin/users/components/PurchasedOrdersDialog";
import { usePurchasedItems } from "@/features/admin/users/hooks";
import { PurchasedItemFilters } from "@/features/profile/types";

// Dialog state type
type DialogState = {
  selectedUser: User | null;
  purchasedItemsUser: User | null;
  currentPage: number;
};

// Dialog actions
type DialogAction =
  | { type: "OPEN_EDIT"; user: User }
  | { type: "CLOSE_EDIT" }
  | { type: "OPEN_PURCHASED"; user: User }
  | { type: "CLOSE_PURCHASED" }
  | { type: "SET_PAGE"; page: number };

// Dialog reducer
const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "OPEN_EDIT":
      return {
        ...state,
        selectedUser: action.user,
      };
    case "OPEN_PURCHASED":
      return {
        ...state,
        purchasedItemsUser: action.user,
        currentPage: 1,
      };
    case "CLOSE_EDIT":
      return {
        ...state,
        selectedUser: null,
      };
    case "CLOSE_PURCHASED":
      return {
        ...state,
        purchasedItemsUser: null,
        currentPage: 1,
      };
    case "SET_PAGE":
      return {
        ...state,
        currentPage: action.page,
      };
    default:
      return state;
  }
};

const AdminUsersPage = () => {
  const { data, isLoading } = useGetUsers();
  const updateUserMutation = useUpdateUser();

  // useReducer cho dialog states - clean hơn khi có nhiều state liên quan
  const [dialogState, dispatchDialog] = useReducer(dialogReducer, {
    selectedUser: null,
    purchasedItemsUser: null,
    currentPage: 1,
  });

  // useRef cho constant - tránh re-create mỗi render
  const pageSizeRef = useRef(10);
  const pageSize = pageSizeRef.current;

  const users: User[] = useMemo(
    () => data || [],
    [data]
  );

  const purchasedItemsFilters: PurchasedItemFilters = useMemo(
    () => ({
      page: dialogState.currentPage,
      limit: pageSize,
    }),
    [dialogState.currentPage, pageSize]
  );

  const pagination = useMemo(
    () => ({
      currentPage: 1,
      totalPages: 1,
      totalElements: users.length,
      pageSize: 10,
    }),
    [users.length]
  );

  const { data: purchasedItemsData, isLoading: purchasedItemsLoading } =
    usePurchasedItems(
      dialogState.purchasedItemsUser ? dialogState.purchasedItemsUser.id : null,
      dialogState.purchasedItemsUser ? purchasedItemsFilters : undefined
    );

  // Handlers - không cần useCallback vì components không được memoized
  const handleUpdateUser = async (data: {
    id: string;
    name: string;
    phone?: string;
    status?: boolean;
  }) => {
    await updateUserMutation.mutateAsync(data);
    dispatchDialog({ type: "CLOSE_EDIT" });
  };

  const handleEdit = (user: User) => {
    dispatchDialog({ type: "OPEN_EDIT", user });
  };

  const handleViewPurchased = (user: User) => {
    dispatchDialog({ type: "OPEN_PURCHASED", user });
  };

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      dispatchDialog({ type: "CLOSE_EDIT" });
    }
  };

  const handlePurchasedDialogClose = (open: boolean) => {
    if (!open) {
      dispatchDialog({ type: "CLOSE_PURCHASED" });
    }
  };

  const handlePurchasedPageChange = (page: number) => {
    dispatchDialog({ type: "SET_PAGE", page });
  };

  // columns không cần useMemo vì handlers logic không thay đổi
  const columns = userColumns(handleEdit, handleViewPurchased);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
      <DataTable
        columns={columns}
        data={users}
        pagination={pagination}
      />

      {/* Edit Form */}
      {dialogState.selectedUser && (
        <UserForm
          user={dialogState.selectedUser}
          onSubmit={handleUpdateUser}
          isLoading={updateUserMutation.isPending}
          open={!!dialogState.selectedUser}
          onOpenChange={handleEditDialogClose}
        />
      )}

      {/* Purchased Orders Dialog */}
      {dialogState.purchasedItemsUser && (
        <PurchasedOrdersDialog
          data={purchasedItemsData}
          isLoading={purchasedItemsLoading}
          open={!!dialogState.purchasedItemsUser}
          onOpenChange={handlePurchasedDialogClose}
          currentPage={dialogState.currentPage}
          onPageChange={handlePurchasedPageChange}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;