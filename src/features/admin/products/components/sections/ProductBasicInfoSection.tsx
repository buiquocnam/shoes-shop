"use client";

import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProductFormValues } from "../../schema";
import { CategoryType, BrandType } from "@/features/product/types";
import { NumberInput, SelectField } from "../shared/FormFields";

interface ProductBasicInfoSectionProps {
    control: Control<ProductFormValues>;
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
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Classic Leather Sneaker" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter a detailed description..." rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <SelectField<ProductFormValues>
                        control={control}
                        name="brand"
                        label="Brand"
                        options={brands}
                    />
                    <SelectField<ProductFormValues>
                        control={control}
                        name="category"
                        label="Categories"
                        options={categories}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput<ProductFormValues>
                        control={control}
                        name="price"
                        label="Base Price ($)"
                        placeholder="e.g. 120.00"
                    />
                    <NumberInput<ProductFormValues>
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

