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
        header: "Image",
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
        header: "Product Name",
        cell: ({ row }: { row: Row<ProductType> }) => (
            <div className="max-w-[300px]">
                <p className="font-medium text-foreground">{row.original.name}</p>
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
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
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const brandName = row.original.brand?.name || "N/A";
            return (
                <Badge variant="secondary" className="font-normal">
                    {brandName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const categoryName = row.original.category?.name || "N/A";
            return (
                <Badge variant="outline" className="font-normal">
                    {categoryName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalStock",
        header: "Stock",
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
        header: "Actions",
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/info`} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        <span>Edit Product</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/variants`} className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>Manage Variants</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/images`} className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Manage Images</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Product</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product{" "}
                                <span className="font-semibold">{product.name}</span> and all its data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}