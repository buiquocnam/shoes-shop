'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BrandType } from '@/features/product/types';
import { BrandForm } from './';
import { useUpdateBrand, useDeleteBrand } from '../hooks/useBrands';
import { ConfirmAlert } from '@/features/admin/components';

export const columns: ColumnDef<BrandType>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.getValue('logo');
      return (
        <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
          {logoUrl ? (
            <Image
              src={row.original.logo || ''}
              alt={row.original.name || 'Brand Logo'}
              width={40}
              height={40}
              objectFit="contain"
              className="p-1"
              unoptimized
            />
          ) : (
            <span className="text-xs text-gray-500">{row.original.name.charAt(0)}</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Brand
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'productCount',
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
      const updateBrandMutation = useUpdateBrand();
      const deleteBrandMutation = useDeleteBrand();

      const handleUpdate = async (formData: FormData) => {
        await updateBrandMutation.mutateAsync({
          id: row.original.id,
          data: formData,
        });
      };

      const handleDelete = async () => {
        await deleteBrandMutation.mutateAsync(row.original.id);
      };

      return (
        <div className="flex space-x-1">
          <BrandForm
            brand={row.original}
            onSubmit={handleUpdate}
            isLoading={updateBrandMutation.isPending}
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
              disabled={deleteBrandMutation.isPending}
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