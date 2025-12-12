"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ProductType } from "@/features/product/types";
import { ConfirmAlert } from "@/features/admin/components";
import { ProductForm } from "../forms/ProductForm";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "../../hooks";
import { FormMode } from "../../utils/productFormHelpers";

/**
 * ProductTableColumns - Table columns definition cho product table
 * Tách riêng để dễ maintain và tái sử dụng
 */
export const productColumns: ColumnDef<ProductType>[] = [
    {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => {
            const product = row.original;
            const imageUrl = product.imageUrl?.url || 'https://via.placeholder.com/60';

            return (
                <div className="flex items-start gap-4 py-2">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover w-16 h-16 flex-shrink-0"
                        unoptimized
                    />
                    <div className="flex flex-col justify-center h-16">
                        <span className="font-semibold text-gray-900">{product.name}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const product = row.original;
            const originalPrice = product.price;
            const discountValue = product.discount || 0;
            const currentPrice = originalPrice - discountValue;
            const hasDiscount = discountValue > 0;

            return (
                <div className="flex flex-col">
                    <span className={`font-semibold text-gray-900 ${hasDiscount ? 'text-primary' : ''}`}>
                        ${currentPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    )}
                </div>
            );
        },
        size: 100,
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        cell: ({ row }) => {
            const discountValue = row.original.discount || 0;
            const discountPercentage = Math.round((discountValue / row.original.price) * 100);

            return (
                <span className="font-semibold text-red-600">
                    {discountValue > 0 ? `${discountPercentage}%` : '—'}
                </span>
            );
        },
        size: 80,
    },
    {
        accessorKey: 'totalStock',
        header: 'Stock',
        cell: info => <span className="text-gray-700">{info.getValue() as number}</span>,
        size: 80,
    },
    {
        accessorKey: 'countSell',
        header: 'Sold',
        cell: info => <span className="text-gray-700">{info.getValue() as number}</span>,
        size: 80,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const product = row.original;
            const productId = product.id;
            const productName = product.name;
            const deleteProductMutation = useDeleteProduct();

            const handleDelete = async () => {
                await deleteProductMutation.mutateAsync(productId);
            };

            return (
                <div className="flex gap-2 items-center">
                    {/* Edit Info */}
                    <ProductForm
                        productId={productId}
                        mode={FormMode.info}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                                title="Edit Product Info"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                    />

                    {/* Edit Images */}
                    <ProductForm
                        productId={productId}
                        mode={FormMode.images}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit Product Images"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                        }
                    />


                    <ConfirmAlert
                        onConfirm={handleDelete}
                        itemName={productName}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            disabled={deleteProductMutation.isPending}
                            title="Delete Product"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </ConfirmAlert>
                </div>
            );
        },
        size: 80,
    },
];

