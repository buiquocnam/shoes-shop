'use client';

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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Package, ImageIcon, Trash2, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useDeleteProduct } from "../hooks/mutations/useDeleteProduct";

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

function ProductActions({ product }: { product: ProductType }) {
    const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

    const handleDelete = async () => {
        await deleteProduct(product.id);
    };

    const handleStopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div onClick={handleStopPropagation}>
            <DropdownMenu>
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
                    <DropdownMenuSeparator />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Xóa sản phẩm</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sản phẩm{" "}
                                    <span className="font-semibold">{product.name}</span> và tất cả dữ liệu của nó.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isPending ? "Đang xóa..." : "Xóa"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}