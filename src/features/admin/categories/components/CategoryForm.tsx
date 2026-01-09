"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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

                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <FieldGroup>
                        <Field data-invalid={!!form.formState.errors.name}>
                            <FieldLabel htmlFor="category-name">Tên danh mục</FieldLabel>
                            <Input id="category-name" placeholder="Nhập tên danh mục" {...form.register("name")} className="h-11" />
                            <FieldError errors={[form.formState.errors.name]} />
                        </Field>

                        <Field data-invalid={!!form.formState.errors.description}>
                            <FieldLabel htmlFor="category-description">Mô tả</FieldLabel>
                            <Textarea
                                id="category-description"
                                placeholder="Nhập mô tả danh mục"
                                rows={4}
                                {...form.register("description")}
                                className="min-h-[120px]"
                            />
                            <FieldError errors={[form.formState.errors.description]} />
                        </Field>

                        <div className="flex justify-end gap-3 pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isLoading}>Hủy</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading} className="font-bold px-8">
                                {isLoading ? <Spinner className="h-4 w-4" /> : category ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </div>
                    </FieldGroup>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
