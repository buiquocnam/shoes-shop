'use client';

import React, { useCallback } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ProductType } from "@/features/product/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Package, ImageIcon, Trash2, MoreHorizontal, History } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useDeleteProduct } from "../hooks/mutations/useDeleteProduct";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "image",
        header: "Hình ảnh",
        cell: ({ row }) => {
            const image = row.original.imageUrl?.url || "";

            return (
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted/30 border border-border/50 shadow-sm">
                    {image ? (
                        <Image
                            src={image}
                            alt={row.original.name}
                            fill
                            unoptimized
                            className="object-cover transition-transform hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
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
            <DataTableColumnHeader column={column} title="Tên sản phẩm" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[250px]">
                <p className="font-semibold text-foreground line-clamp-1">{row.original.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">#{row.original.id.slice(-6)}</p>
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Giá bán" />
        ),
        cell: ({ row }) => {
            const price = row.original.price;
            return (
                <span className="font-bold text-foreground">
                    {formatCurrency(price)}
                </span>
            );
        },
    },
    {
        accessorKey: "discount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Giảm" />
        ),
        cell: ({ row }) => {
            const discount = row.original.discount || 0;
            return (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-bold">
                    -{discount}%
                </Badge>
            );
        },
    },
    {
        accessorKey: "brand",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hãng" />
        ),
        cell: ({ row }) => {
            const brandName = row.original.brand?.name || "—";
            return (
                <Badge variant="secondary" className="font-medium">
                    {brandName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Danh mục" />
        ),
        cell: ({ row }) => {
            const categoryName = row.original.category?.name || "—";
            return (
                <Badge variant="outline" className="font-medium text-muted-foreground">
                    {categoryName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalStock",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tồn kho" />
        ),
        cell: ({ row }) => {
            const stock = row.original.totalStock ?? 0;
            return (
                <div className="flex flex-col gap-1">
                    <span className={cn(
                        "text-sm font-bold",
                        stock === 0 ? "text-destructive" : stock < 10 ? "text-warning" : "text-success"
                    )}>
                        {stock} SP
                    </span>
                    <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                stock === 0 ? "bg-destructive" : stock < 10 ? "bg-warning" : "bg-success"
                            )}
                            style={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thao tác" />
        ),
        cell: ({ row }) => {
            return <ProductActions product={row.original} />;
        },
        enableSorting: false,
        enableHiding: false,
    },
];

// Memoize ProductActions để tránh re-render không cần thiết
const ProductActions = React.memo(({ product }: { product: ProductType }) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    // Memoize callback để tránh re-create
    const handleStopPropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleDropdownClose = useCallback(() => {
        setDropdownOpen(false);
    }, []);

    return (
        <div onClick={handleStopPropagation}>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/admin/products/${product.id}/info`}
                            className="flex items-center gap-2"
                        >
                            <Pencil className="h-4 w-4" />
                            <span>Chỉnh sửa sản phẩm</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/admin/products/${product.id}/variants`}
                            className="flex items-center gap-2"
                        >
                            <Package className="h-4 w-4" />
                            <span>Quản lý biến thể</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/admin/products/${product.id}/images`}
                            className="flex items-center gap-2"
                        >
                            <ImageIcon className="h-4 w-4" />
                            <span>Quản lý hình ảnh</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/admin/products/history?productId=${product.id}`}
                            className="flex items-center gap-2"
                        >
                            <History className="h-4 w-4" />
                            <span>Lịch sử nhập kho</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteProductButton
                        product={product}
                        onDeleteSuccess={handleDropdownClose}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
});

ProductActions.displayName = "ProductActions";

// Delete Product Button Component
function DeleteProductButton({
    product,
    onDeleteSuccess
}: {
    product: ProductType;
    onDeleteSuccess?: () => void;
}) {
    const deleteProduct = useDeleteProduct();
    const [open, setOpen] = React.useState(false);

    const handleDelete = useCallback(async () => {
        try {
            await deleteProduct.mutateAsync(product.id);
            setOpen(false);
            onDeleteSuccess?.();
        } catch (error) {
            console.error(error);
        }
    }, [product.id, deleteProduct, onDeleteSuccess]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
    }, []);

    const handleSelect = useCallback((e: Event) => {
        e.preventDefault();
        setOpen(true);
    }, []);

    return (
        <>
            <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onSelect={handleSelect}
            >
                <Trash2 className="h-4 w-4" />
                <span>Xóa sản phẩm</span>
            </DropdownMenuItem>
            <ConfirmAlert
                open={open}
                onOpenChange={handleOpenChange}
                onConfirm={handleDelete}
                itemName={`sản phẩm "${product.name}"`}
                title="Xác nhận xóa sản phẩm"
                description={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Hành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`}
            />
        </>
    );
}