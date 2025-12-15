import { ColumnDef, Row } from "@tanstack/react-table";
import { ProductType } from "@/features/product/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Package, ImageIcon } from "lucide-react";

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const image = row.original.imageUrl?.url || " ";

            return (
                <div className="relative  aspect-square overflow-hidden rounded-lg bg-gray-100">
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
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const price = row.original.price;
            return <span>${price.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }: { row: Row<ProductType> }) => (
            <span>{row.original.brand?.name || "N/A"}</span>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }: { row: Row<ProductType> }) => (
            <span>{row.original.category?.name || "N/A"}</span>
        ),
    },
    {
        accessorKey: "totalStock",
        header: "Total Stock",
        cell: ({ row }: { row: Row<ProductType> }) => (
            <span>{row.original.totalStock ?? 0}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<ProductType> }) => {
            const id = row.original.id;
            return (
                <div className="flex gap-2">
                    <Link href={`/admin/products/${id}/info`}>
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/products/${id}/variants`}>
                        <Button variant="ghost" size="icon">
                            <Package className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/products/${id}/images`}>
                        <Button variant="ghost" size="icon">
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];