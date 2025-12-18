'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, Trash2, ArrowUpDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateUser, useDeleteUser } from '../hooks';
import { ConfirmAlert } from '@/features/admin/components';
import { User } from '@/types/global';
import { UserForm } from './UserForm';
import { PurchasedItemsDialog } from '@/features/admin/components';
import { usePurchasedItems } from '../hooks';
import { PurchasedItemFilters } from '@/features/profile/types';
import { useState } from 'react';

function PurchasedItemsDialogWrapper({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filters: PurchasedItemFilters = {
    page: currentPage,
    limit: pageSize,
  };

  const { data, isLoading } = usePurchasedItems(
    open ? userId : null,
    open ? filters : undefined
  );

  return (
    <PurchasedItemsDialog
      data={data}
      isLoading={isLoading}
      showUserId={false}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
          title="View purchased items"
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      currentPage={currentPage}
      onPageChange={(page) => {
        setCurrentPage(page);
      }}
    />
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }: { row: Row<User> }) => {
      const name = row.original.name;
      return (
        <span className="">{name}</span>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Phone
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const updateUserMutation = useUpdateUser();
      const deleteUserMutation = useDeleteUser();



      const handleDelete = async () => {
        await deleteUserMutation.mutateAsync(row.original.id);
      };

      return (
        <div className="flex space-x-1">
          <PurchasedItemsDialogWrapper userId={row.original.id} />
          <UserForm
            user={row.original}
            isLoading={updateUserMutation.isPending || deleteUserMutation.isPending}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <ConfirmAlert
            onConfirm={handleDelete}
            itemName={row.original.name}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
              disabled={deleteUserMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </ConfirmAlert>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];