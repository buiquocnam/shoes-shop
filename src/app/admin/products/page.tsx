"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ProductType } from "@/features/product/types";
import { useProducts } from "@/features/admin/products/hooks";
import { productColumns, ProductForm } from "@/features/admin/products/components";

const AdminProductsPage: React.FC = () => {
    const { data, isLoading } = useProducts();

    const products: ProductType[] = data?.data || [];

    if (isLoading) {
        return (
            <div className="p-8 text-xl text-gray-700">
                Loading products...
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Manage Products</h1>

                <ProductForm
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
                    filterColumnKey="name"
                    filterPlaceholder="Search product..."
                />
            </div>
        </div>
    );
};

export default AdminProductsPage;