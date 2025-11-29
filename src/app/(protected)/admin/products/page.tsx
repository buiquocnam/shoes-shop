"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ProductType } from "@/features/product/types";
import { useProducts } from "@/features/admin/products/hooks";
import { productColumns, ProductForm } from "@/features/admin/products/components";
import { FormMode } from "@/features/admin/products/utils/productFormHelpers";
import { Spinner } from "@/components/ui/spinner";

const AdminProductsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useProducts({ page, limit: 10 });
    const products: ProductType[] = data?.data || [];

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
                <Spinner className="size-8 " />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Manage Products</h1>

                <ProductForm
                    mode={FormMode.create}
                    trigger={
                        <Button className="bg-red-700 hover:bg-red-800 font-semibold px-4 py-2 rounded-lg shadow-md">
                            + Add Product
                        </Button>
                    }
                />
            </div>

            <div className="rounded-xl overflow-hidden">
                <DataTable
                    columns={productColumns}
                    data={products}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AdminProductsPage;