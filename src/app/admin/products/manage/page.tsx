"use client"
import { adminProductsApi } from '@/features/admin/products/services/products.api';
import {CreateProductForm} from "@/features/admin/products/components";
export default function AdminProductsPage() {
    const onSubmit = async (data: FormData) => {
        try {
            const result = await adminProductsApi.create(data);
            console.log('Product created successfully:', result);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    }

    return <CreateProductForm onSubmit={onSubmit} />;
}