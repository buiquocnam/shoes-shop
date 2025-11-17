"use client";

import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProductFormValues } from "../schema";
import { CategoryType, BrandType } from "@/features/product/types";

interface ProductBasicInfoSectionProps {
    control: Control<ProductFormValues>;
    categories: CategoryType[];
    brands: BrandType[];
}

const SelectField: React.FC<{
    control: Control<ProductFormValues>;
    name: string;
    label: string;
    options: Array<{ id: string; name: string }>;
}> = ({ control, name, label, options }) => (
    <FormField
        control={control}
        name={name as any}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <select {...field} className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const NumberField: React.FC<{
    control: Control<ProductFormValues>;
    name: string;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
}> = ({ control, name, label, placeholder, min, max }) => (
    <FormField
        control={control}
        name={name as any}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        type="number"
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
    control,
    categories,
    brands,
}) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
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
                <h3 className="text-lg font-semibold text-gray-900">Organization</h3>
                <div className="grid grid-cols-2 gap-4">
                    <SelectField control={control} name="brand" label="Brand" options={brands} />
                    <SelectField control={control} name="category" label="Categories" options={categories} />
                </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                    <NumberField control={control} name="price" label="Base Price ($)" placeholder="e.g. 120.00" />
                    <NumberField control={control} name="discount" label="Discount (%)" placeholder="e.g. 15" min={0} max={100} />
                </div>
            </div>
        </div>
    );
};

