"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductVariantHistory } from "../types";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export const columns: ColumnDef<ProductVariantHistory>[] = [
    {
        accessorKey: "product",
        id: "product",
        header: "Product",
        filterFn: (row, id, value) => {
            const productName = row.original.product?.name || "";
            return productName.toLowerCase().includes(String(value).toLowerCase());
        },
        cell: ({ row }) => {
            const variant = row.original;
            const productName = variant.product?.name || "Unknown Product";
            const imageUrl = variant.product?.imageUrl?.url || 'https://via.placeholder.com/60';

            return (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt={productName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{productName}</span>
                        {variant.color && (
                            <span className="text-sm text-gray-500">Color: {variant.color}</span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "count",
        header: "Stock Change",
        filterFn: (row, id, value) => {
            if (!value) return true;

            const filterValue = Number(value);

            return filterValue === row.original.count;
        },
        cell: ({ row }) => {
            const count = row.original.count;
            const isIncrease = count > 0;
            const isDecrease = count < 0;
            const isNeutral = count === 0;

            return (
                <div className="flex items-center gap-2">
                    {isIncrease && <ArrowUp className="h-4 w-4 text-green-500" />}
                    {isDecrease && <ArrowDown className="h-4 w-4 text-red-500" />}
                    <span
                        className={cn(
                            "font-semibold",
                            isIncrease && "text-green-600",
                            isDecrease && "text-red-600",
                            isNeutral && "text-gray-500"
                        )}
                    >
                        {isIncrease ? "+" : ""}{count}
                    </span>
                </div>
            );
        },
        size: 120,
    },

];