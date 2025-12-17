"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {InputField} from "@/components/form/InputField";
import {TextareaField} from "@/components/form/TextareaField";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose} from "@/components/ui/dialog";
import { categorySchema, CategoryFormValues } from "../schema";
import { CategoryType } from "@/features/product/types";

interface CategoryFormProps {
    onSubmit: (data: CategoryFormValues) => void;
    isLoading?: boolean;
    category?: CategoryType;
    trigger?: React.ReactNode;
}

export default function CategoryForm({
    onSubmit,
    isLoading,
    category,
    trigger,
}: CategoryFormProps) {
    const [open, setOpen] = useState(false);

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
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Add Category</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {category ? "Edit Category" : "Create New Category"}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6"
                    >
                        <InputField
                            control={form.control}
                            name="name"
                            label="Category Name"
                            placeholder="Enter category name"
                            className="h-11"
                        />

                        <TextareaField
                            control={form.control}
                            name="description"
                            label="Description"
                            height="200px"
                            placeholder="Enter category description"
                            className="min-h-[100px] resize-none"
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : category ? "Update" : "Create"}
                        </Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

