"use client";

import { Control, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NumberField, CustomField } from "@/components/form";
import { useDeleteVariant } from "../../hooks/mutations";
import { Spinner } from "@/components/ui/spinner";

interface ProductVariantsSectionProps {
    control: Control<any>;
    productId: string;
}

const VariantSizesField = ({
    control,
    variantIndex,
}: {
    control: Control<any>;
    variantIndex: number;
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${variantIndex}.sizes`,
    });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-[1fr_100px_120px_auto] gap-4 items-center text-sm">
                <label className="font-medium text-gray-500 dark:text-gray-400">Size</label>
                <label className="font-medium text-gray-500 dark:text-gray-400">Tồn kho hiện tại</label>
                <label className="font-medium text-gray-500 dark:text-gray-400">Số lượng mới</label>
                <div className="w-8"></div>
            </div>

            {fields.map((field, sizeIndex) => {
                // currentStock từ API data ban đầu (lưu trong field.currentStock)
                // stock là delta (thay đổi), default 0
                const currentStock = (field as any).currentStock ?? 0;

                return (
                    <div key={field.id} className="grid grid-cols-[1fr_100px_120px_auto] gap-4 items-center">
                        {/* Size input */}
                        <NumberField
                            control={control}
                            name={`variants.${variantIndex}.sizes.${sizeIndex}.size`}
                            placeholder="Size (e.g. 41)"
                            className="w-full"
                            showLabel={false}
                        />

                        {/* Current Stock - chỉ hiển thị, không chỉnh sửa */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentStock}
                        </p>

                        {/* Stock Delta - số lượng thay đổi (+/-) */}
                        <NumberField
                            control={control}
                            name={`variants.${variantIndex}.sizes.${sizeIndex}.stock`}
                            placeholder="+/- số lượng"
                            className="bg-gray-50"
                            showLabel={false}
                        />

                        {/* Delete button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(sizeIndex)}
                            disabled={fields.length === 1}
                            className="text-gray-500  hover:text-red-500 "
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                );
            })}

            {/* Add Size button */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ size: 0, stock: 0, currentStock: 0 })}
                className="text-primary hover:text-primary/80"
            >
                <Plus className="h-4 w-4 mr-2" />
                Thêm size mới
            </Button>
        </div>
    );
};

export const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
    control,
    productId,
}) => {
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants",
    });
    const deleteVariant = useDeleteVariant();

    const handleRemoveVariant = async (variantIndex: number) => {
        const variant = control._formValues.variants[variantIndex];
        const variantId = variant?.id;

        // Nếu variant có id (đã tồn tại trên server), gọi API xóa
        if (variantId) {
            try {
                await deleteVariant.mutateAsync({
                    variantId,
                    productId,
                });
            } catch (error) {
            }
        } else {
            removeVariant(variantIndex);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200  p-4 space-y-3">
            {variantFields.map((variant, variantIndex) => (
                <div key={variant.id} className="border border-gray-200  rounded-lg p-4 space-y-3 bg-gray-50 ">
                    <CustomField
                        control={control}
                        name={`variants.${variantIndex}.color`}
                        render={(field, fieldState) => (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-300 border-gray-400 "></div>
                                <Input
                                    placeholder="Ví dụ: Đỏ đậm"
                                    {...field}
                                    className="flex-1"
                                />
                            </div>
                        )}
                    />

                    <div>
                        <VariantSizesField
                            control={control}
                            variantIndex={variantIndex}
                        />
                    </div>

                    {variantFields.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variantIndex)}
                            disabled={deleteVariant.isPending}
                            className="text-red-600 hover:text-red-700"
                        >
                            {deleteVariant.isPending ? (
                                <Spinner className="h-4 w-4 mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Xóa biến thể
                        </Button>
                    )}
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => appendVariant({ color: "", sizes: [{ size: 0, stock: 0, currentStock: 0 }] })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Thêm biến thể màu mới
            </Button>
        </div>
    );
};
