"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/features/admin/variants/components/columns";
import { useVariants } from "@/features/admin/variants/hooks/useVariants";
import { ProductVariantHistory } from "@/features/admin/variants/types";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export default function AdminVariantsPage() {
    const [page, setPage] = useState(1);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const { data, isLoading } = useVariants();

    const variants: ProductVariantHistory[] = data?.data || [];
    const pagination = {
        currentPage: data?.currentPage || 1,
        totalPages: data?.totalPages || 1,
        totalElements: data?.totalElements || 0,
        pageSize: data?.pageSize || 10,
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Variant History</h1>
            </div>

            {/* Filter Section */}
            <div className="mb-6 flex gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by product name..."
                        onChange={(e) => {
                            setColumnFilters((prev) => {
                                const otherFilters = prev.filter((f) => f.id !== "product");
                                const value = e.target.value;
                                return value
                                    ? [...otherFilters, { id: "product", value }]
                                    : otherFilters;
                            });
                        }}
                        className="pl-10 pr-3 rounded-lg bg-gray-100"
                    />
                </div>
                {/* Có thể thêm các filter khác ở đây */}
                <div>
                    <Input
                        type="number"
                        placeholder="Search by count..."
                        onChange={(e) => {
                            setColumnFilters((prev) => {
                                const otherFilters = prev.filter((f) => f.id !== "count");
                                const value = e.target.value;
                                return value
                                    ? [...otherFilters, { id: "count", value }]
                                    : otherFilters;
                            });
                        }}
                        className="pl-10 pr-3 rounded-lg bg-gray-100"
                    />
                </div>
            </div>

            <div className="rounded-xl overflow-hidden">
                <DataTable
                    columns={columns}
                    data={variants}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    columnFilters={columnFilters}
                    onColumnFiltersChange={setColumnFilters}
                />
            </div>
        </div>
    );
}