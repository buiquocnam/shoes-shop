"use client";

import React, { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ProductType } from "@/features/product/types";
import { useProducts } from "@/features/admin/products/hooks";
import { productColumns, ProductForm } from "@/features/admin/products/components";
import { FormMode } from "@/features/admin/products/utils/productFormHelpers";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AdminProductsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filters
    const filters = useMemo(
        () => ({
            page,
            limit: 10,
            name: searchQuery,
        }),
        [page, searchQuery]
    );

    const { data, isLoading, isFetching } = useProducts(filters);
    const products: ProductType[] = data?.data || [];

    const pagination = useMemo(
        () => ({
            currentPage: data?.currentPage ?? 1,
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? 0,
            pageSize: data?.pageSize ?? 10,
        }),
        [data]
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Manage Products</h1>

                <ProductForm
                    mode={FormMode.create}
                    trigger={
                        <Button className="bg-red-700 hover:bg-red-800">
                            + Add Product
                        </Button>
                    }
                />
            </div>

            <div className="relative w-full max-w-sm mb-4 mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <Input
                    ref={inputRef}
                    placeholder="Search product... (Press Enter)"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const value = inputRef.current?.value.trim() || "";
                            setSearchQuery(value || undefined);
                            setPage(1);
                        }
                    }}
                    className="pl-10 pr-3 rounded-lg bg-gray-100"
                />
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden relative">
                {isLoading && !data && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <Spinner className="size-8" />
                    </div>
                )}

                <DataTable
                    columns={productColumns}
                    data={products}
                    pagination={pagination}
                    onPageChange={(p) => setPage(p)}
                />

                {isFetching && data && (
                    <div className="absolute top-2 right-2">
                        <Spinner className="size-4" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
