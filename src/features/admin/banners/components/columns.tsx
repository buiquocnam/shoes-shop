"use client";

import { ColumnDef,  } from "@tanstack/react-table";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Banner } from "@/types/banner";


import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { cn } from "@/lib";

export const bannerColumns = (
  onEdit?: (banner: Banner) => void
): ColumnDef<Banner>[] => [
    {
      accessorKey: "url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình ảnh" />
      ),
      cell: ({ row }) => {
        const url = row.original.imageUrl;
        return (
          <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-50 border border-border/50 shadow-sm">
            {url ? (
              <Image
                src={url}
                alt={row.original.title || "Banner"}
                width={128}
                height={64}
                className="object-cover transition-transform hover:scale-105"
                unoptimized
              />
            ) : (
              <span className="text-[10px] uppercase font-bold text-muted-foreground">No image</span>
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
        <DataTableColumnHeader column={column} title="Tiêu đề" />
      ),
      cell: ({ row }) => <span className="font-semibold">{row.original.title}</span>,
    },
    {
      accessorKey: "slot",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vị trí" />
      ),
      cell: ({ row }) => {
        const slot = row.original.slot;
        return (
          <Badge variant="secondary" className="capitalize font-medium">
            {slot?.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "link",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Liên kết" />
      ),
      cell: ({ row }) => {
        const link = row.original.link;
        return (
          <div className="max-w-[200px] truncate text-xs text-muted-foreground font-mono">
            {link}
          </div>
        );
      },
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const active = row.original.active;
        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              active
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-gray-50 text-gray-500 border-gray-200"
            )}
          >
            {active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {active ? "Hoạt động" : "Đã ẩn"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thao tác" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Sửa</span>
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

