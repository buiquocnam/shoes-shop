"use client";

import { Control, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProductFormValues } from "../../schema";
import { NumberInput } from "../shared/FormFields";

interface ProductVariantsSectionProps {
    control: Control<ProductFormValues>;
}

const VariantSizesField: React.FC<{
    control: Control<ProductFormValues>;
    variantIndex: number;
}> = ({ control, variantIndex }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${variantIndex}.sizes`,
    });

    return (
        <div className="space-y-2">
            {fields.map((field, sizeIndex) => (
                <div key={field.id} className="flex gap-2 items-center">
                    <NumberInput<ProductFormValues>
                        control={control}
                        name={`variants.${variantIndex}.sizes.${sizeIndex}.size` as any}
                        placeholder="Size (e.g. 41)"
                        className="flex-1"
                    />
                    <NumberInput<ProductFormValues>
                        control={control}
                        name={`variants.${variantIndex}.sizes.${sizeIndex}.stock` as any}
                        placeholder="Stock"
                        className="w-32"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(sizeIndex)}
                        disabled={fields.length === 1}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ size: 0, stock: 0 })}
                className="mt-2"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Size
            </Button>
        </div>
    );
};

/**
 * ProductVariantsSection - Component hiển thị form fields cho variants
 * Tách riêng để dễ tái sử dụng và maintain
 */
export const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({ control }) => {
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants",
    });

    return (
        <div className="bg-white rounded-lg border p-4 space-y-3">
            {variantFields.map((variant, variantIndex) => (
                <div key={variant.id} className="border rounded-lg p-3 space-y-3">
                    <FormField
                        control={control}
                        name={`variants.${variantIndex}.color`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Burgundy Red" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Sizes & Stock</label>
                        <VariantSizesField control={control} variantIndex={variantIndex} />
                    </div>

                    {variantFields.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(variantIndex)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Variant
                        </Button>
                    )}
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => appendVariant({ color: "", sizes: [{ size: 0, stock: 0 }] })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add New Color Variant
            </Button>
        </div>
    );
};

