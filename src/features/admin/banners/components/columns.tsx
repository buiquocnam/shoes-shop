"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BannerType } from "../types";

const getSlotLabel = (slot: string): string => {
  const slotMap: Record<string, string> = {
    HOME_HERO: "Home Hero",
    HOME_MID: "Home Mid",
  };
  return slotMap[slot] || slot;
};

export const bannerColumns = (
  onEdit?: (banner: BannerType) => void
): ColumnDef<BannerType>[] => [
  {
    accessorKey: "imageUrl",
    header: "Hình ảnh",
    cell: ({ row }: { row: Row<BannerType> }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="flex items-center justify-center h-16 w-24 bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.title || "Banner"}
              width={96}
              height={64}
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-xs text-gray-500">No image</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
      >
        Tiêu đề
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "slot",
    header: "Slot",
    cell: ({ row }: { row: Row<BannerType> }) => {
      const slot = row.getValue("slot") as string;
      return (
        <Badge variant="secondary">{getSlotLabel(slot)}</Badge>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }: { row: Row<BannerType> }) => {
      const link = row.getValue("link") as string;
      return (
        <div className="max-w-[200px] truncate text-sm text-gray-600">
          {link}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Trạng thái",
    cell: ({ row }: { row: Row<BannerType> }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Hoạt động
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Ẩn
            </>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }: { row: Row<BannerType> }) => {
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
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

