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

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "image",
        header: "Hình ảnh",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const image = row.original.imageUrl?.url || " ";

            return (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <Image
                        src={image}
                        alt={row.original.name}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Tên sản phẩm",
        cell: ({ row }: { row: Row<ProductType> }) => (
            <div className="max-w-[300px]">
                <p className="font-medium text-foreground">{row.original.name}</p>
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const price = row.original.price;
            return (
                <span className="font-semibold text-foreground">
                    {formatCurrency(price)}
                </span>
            );
        },
    },
    {
        accessorKey: "discount",
        header: "Giảm giá",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const discount = row.original.discount;
            return (
                <span className="font-semibold text-red-500">
                    {discount}%
                </span>
            );
        },
    },
    {
        accessorKey: "brand",
        header: "Thương hiệu",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const brandName = row.original.brand?.name || "Chưa có";
            return (
                <Badge variant="secondary" className="font-normal">
                    {brandName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Danh mục",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const categoryName = row.original.category?.name || "Chưa có";
            return (
                <Badge variant="outline" className="font-normal">
                    {categoryName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalStock",
        header: "Tồn kho",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const stock = row.original.totalStock ?? 0;
            return (
                <span className={cn(
                    "font-medium",
                    stock === 0 ? "text-destructive" : stock < 10 ? "text-orange-600" : "text-foreground"
                )}>
                    {stock}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }: { row: Row<ProductType> }) => {
            return <ProductActions product={row.original} />;
        },
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