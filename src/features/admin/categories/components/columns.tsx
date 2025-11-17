'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/features/product/types';
import { CategoryForm } from './';
import { useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { ConfirmAlert } from '@/features/admin/components';

export const columns: ColumnDef<CategoryType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Category Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div className="max-w-md truncate text-gray-600">
          {description || 'No description'}
        </div>
      );
    },
  },
  {
    accessorKey: 'countProduct',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Products
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const updateCategoryMutation = useUpdateCategory();
      const deleteCategoryMutation = useDeleteCategory();

      const handleUpdate = async (data: { name: string; description: string }) => {
        await updateCategoryMutation.mutateAsync({
          id: row.original.id,
          data,
        });
      };

      const handleDelete = async () => {
        await deleteCategoryMutation.mutateAsync(row.original.id);
      };

      return (
        <div className="flex space-x-1">
          <CategoryForm
            category={row.original}
            onSubmit={handleUpdate}
            isLoading={updateCategoryMutation.isPending}
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
              disabled={deleteCategoryMutation.isPending}
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

