"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BrandType } from "@/features/product/types";

export const brandColumns = (
  onEdit?: (brand: BrandType) => void,
  onDelete?: (brand: BrandType) => void
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Thương hiệu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "countProduct",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Số sản phẩm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];