"use client";

import { Control } from "react-hook-form";
import { InputField, TextareaField, NumberField, SelectField } from "@/components/form";
import { CategoryType, BrandType } from "@/features/product/types";

interface ProductBasicInfoSectionProps {
    control: Control<any>;
    categories: CategoryType[];
    brands: BrandType[];
}

export const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
    control,
    categories,
    brands,
}) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border p-4 space-y-3">
                <InputField
                    control={control}
                    name="name"
                    label="Product Name"
                    placeholder="e.g. Classic Leather Sneaker"
                />
                <TextareaField
                    control={control}
                    name="description"
                    label="Product Description"
                    placeholder="Enter a detailed description..."
                    rows={4}
                />
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        control={control}
                        name="brandId"
                        label="Brand"
                        options={brands}
                        placeholder="Select a brand"
                    />
                    <SelectField
                        control={control}
                        name="categoryId"
                        label="Categories"
                        options={categories}
                        placeholder="Select a category"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <NumberField
                        control={control}
                        name="price"
                        label="Base Price ($)"
                        placeholder="e.g. 120.00"
                    />
                    <NumberField
                        control={control}
                        name="discount"
                        label="Discount (%)"
                        placeholder="e.g. 15"
                        min={0}
                        max={100}
                    />
                </div>
            </div>
        </div>
    );
};
