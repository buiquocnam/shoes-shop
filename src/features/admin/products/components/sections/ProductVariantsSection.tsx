"use client";

import { Control, useFieldArray, UseFormRegister, FieldErrors } from "react-hook-form";
import { Plus, Trash2, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet, FieldLegend, FieldLabel } from "@/components/ui/field";
import { useDeleteVariant } from "../../hooks/mutations";
import { Spinner } from "@/components/ui/spinner";

interface ProductVariantsSectionProps {
    control: Control<any>;
    productId: string;
}

const VariantSizesField = ({
    control,
    variantIndex,
    register,
    errors,
}: {
    control: Control<any>;
    variantIndex: number;
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${variantIndex}.sizes`,
    });

    return (
        <FieldGroup className="gap-3">
            <div className="grid grid-cols-[1fr_100px_120px_auto] gap-4 items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <label>Size</label>
                <label>Tồn hiện tại</label>
                <label>Số lượng mới</label>
                <div className="w-8"></div>
            </div>

            {fields.map((field, sizeIndex) => {
                const currentStock = (field as any).currentStock ?? 0;

                return (
                    <div key={field.id} className="grid grid-cols-[1fr_100px_120px_auto] gap-4 items-center">
                        <Field data-invalid={!!(errors?.variants as any)?.[variantIndex]?.sizes?.[sizeIndex]?.size} className="w-full">
                            <Input
                                type="number"
                                placeholder="Size (e.g. 41)"
                                {...register(`variants.${variantIndex}.sizes.${sizeIndex}.size`, { valueAsNumber: true })}
                                className="h-10"
                            />
                            <FieldError errors={[(errors?.variants as any)?.[variantIndex]?.sizes?.[sizeIndex]?.size]} />
                        </Field>

                        <div className="text-sm font-medium text-center bg-muted/30 h-10 flex items-center justify-center rounded-md border border-dashed">
                            {currentStock}
                        </div>

                        <Field data-invalid={!!(errors?.variants as any)?.[variantIndex]?.sizes?.[sizeIndex]?.stock}>
                            <Input
                                type="number"
                                placeholder="+/-"
                                {...register(`variants.${variantIndex}.sizes.${sizeIndex}.stock`, { valueAsNumber: true })}
                                className="h-10 text-center font-bold text-primary"
                            />
                            <FieldError errors={[(errors?.variants as any)?.[variantIndex]?.sizes?.[sizeIndex]?.stock]} />
                        </Field>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(sizeIndex)}
                            disabled={fields.length === 1}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ size: 0, stock: 0, currentStock: 0 })}
                className="text-primary hover:text-primary/80 self-start p-0"
            >
                <Plus className="h-4 w-4 mr-2" />
                Thêm size mới
            </Button>
        </FieldGroup>
    );
};

export const ProductVariantsSection: React.FC<ProductVariantsSectionProps & { register: UseFormRegister<any>, errors: FieldErrors<any> }> = ({
    control,
    productId,
    register,
    errors,
}) => {
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants",
    });
    const deleteVariant = useDeleteVariant();

    const handleRemoveVariant = async (variantIndex: number) => {
        const variant = control._formValues.variants[variantIndex];
        const variantId = variant?.id;

        if (variantId) {
            try {
                await deleteVariant.mutateAsync({
                    variantId,
                    productId,
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            removeVariant(variantIndex);
        }
    };

    return (
        <FieldSet className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
            <FieldLegend className="flex items-center gap-2 text-lg font-bold pb-2 border-b w-full">
                <Palette className="h-5 w-5 text-primary" />
                Biến thể và tồn kho
            </FieldLegend>
            <FieldGroup className="pt-6 gap-6">
                {variantFields.map((variant, variantIndex) => (
                    <div key={variant.id} className="rounded-xl border bg-muted/50 p-6 space-y-6 relative group/variant">
                        <Field data-invalid={!!(errors?.variants as any)?.[variantIndex]?.color}>
                            <FieldLabel className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full bg-primary/20 ring-1 ring-primary/40"></div>
                                Màu sắc biến thể
                            </FieldLabel>
                            <Input
                                placeholder="Ví dụ: Đỏ đậm, Xanh Navy, ..."
                                {...register(`variants.${variantIndex}.color`)}
                                className="h-11 bg-background"
                            />
                            <FieldError errors={[(errors?.variants as any)?.[variantIndex]?.color]} />
                        </Field>

                        <div className="pt-2 border-t border-muted-foreground/10">
                            <VariantSizesField
                                control={control}
                                variantIndex={variantIndex}
                                register={register}
                                errors={errors}
                            />
                        </div>

                        {variantFields.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveVariant(variantIndex)}
                                disabled={deleteVariant.isPending}
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 absolute -top-3 -right-3 rounded-full h-8 w-8 p-0 md:opacity-0 group-hover/variant:opacity-100 transition-opacity bg-background shadow-sm"
                            >
                                {deleteVariant.isPending ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary transition-all text-primary font-bold"
                    onClick={() => appendVariant({ color: "", sizes: [{ size: 0, stock: 0, currentStock: 0 }] })}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm biến thể màu sắc mới
                </Button>
            </FieldGroup>
        </FieldSet>
    );
};
