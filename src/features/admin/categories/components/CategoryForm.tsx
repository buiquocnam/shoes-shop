"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { categorySchema, CategoryFormValues } from "../schema";
import { CategoryType } from "@/features/product/types";

interface CategoryFormProps {
    onSubmit: (data: CategoryFormValues) => void;
    isLoading?: boolean;
    category?: CategoryType;
    trigger?: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CategoryForm({
    onSubmit,
    isLoading,
    category,
    trigger,
    open,
    onOpenChange,
}: CategoryFormProps) {

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
        },
    });

    const handleFormSubmit = async (data: CategoryFormValues) => {
        try {
            await onSubmit(data);
            form.reset();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {category ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <InputField
                                control={form.control}
                                name="name"
                                label="Tên danh mục"
                                placeholder="Nhập tên danh mục"
                            />

                            <TextareaField
                                control={form.control}
                                name="description"
                                label="Mô tả"
                                placeholder="Nhập mô tả danh mục"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Đang lưu..." : category ? "Cập nhật" : "Tạo"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
