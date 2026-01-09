"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BrandType } from "@/features/product/types";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";
import { useDeleteBrand } from "../hooks/useBrands";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const brandColumns = (
  onEdit?: (brand: BrandType) => void
): ColumnDef<BrandType>[] => [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }: { row: Row<BrandType> }) => {
        const logoUrl = row.getValue("logo");
        return (
          <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
            {logoUrl ? (
              <Image
                src={row.original.logo || ""}
                alt={row.original.name || "Brand Logo"}
                width={40}
                height={40}
                objectFit="contain"
                className="p-1"
                unoptimized
              />
            ) : (
              <span className="text-xs text-gray-500">
                {row.original.name.charAt(0)}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thương hiệu" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/products?brand_id=${row.original.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "countProduct",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số sản phẩm" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/products?brand_id=${row.original.id}`}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {row.original.countProduct || 0} sản phẩm
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<BrandType> }) => {
        return (
          <div className="flex space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <DeleteBrandButton brand={row.original} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

// Delete Brand Button Component
function DeleteBrandButton({ brand }: { brand: BrandType }) {
  const deleteBrand = useDeleteBrand();

  const handleDelete = async () => {
    try {
      await deleteBrand.mutateAsync(brand.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmAlert
      onConfirm={handleDelete}
      itemName={`thương hiệu "${brand.name}"`}
      title="Xác nhận xóa thương hiệu"
      description={`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"? Hành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
        title="Xóa"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmAlert>
  );
}