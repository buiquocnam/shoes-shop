"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { brandSchema, BrandFormValues } from "../schema";
import { BrandType } from "@/features/product/types";
import Image from "next/image";

interface BrandFormProps {
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
    brand?: BrandType;
    trigger?: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BrandForm({
    onSubmit,
    isLoading,
    brand,
    trigger,
    open,
    onOpenChange,
}: BrandFormProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        brand?.logo || null
    );

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: brand?.name || "",
            logo: undefined,
        },
    });

    const handleFormSubmit = async (data: BrandFormValues) => {
        const formData = new FormData();
        const brandData: { name: string; id?: string } = {
            name: data.name,
        };

        if (brand?.id) {
            brandData.id = brand.id;
        }

        const requestBlob = new Blob([JSON.stringify(brandData)], {
            type: "application/json",
        });
        formData.append("request", requestBlob);

        if (data.logo) {
            formData.append("file", data.logo);
        }

        try {
            await onSubmit(formData);
            form.reset();
            setLogoPreview(null);
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogoChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        form.setValue("logo", file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        form.setValue("logo", undefined);
        setLogoPreview(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {brand ? "Chỉnh sửa thương hiệu" : "Tạo thương hiệu mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <FieldGroup>
                        <Field data-invalid={!!form.formState.errors.name}>
                            <FieldLabel htmlFor="brand-name">Tên thương hiệu</FieldLabel>
                            <Input
                                id="brand-name"
                                placeholder="Nhập tên thương hiệu"
                                {...form.register("name")}
                                className="h-11"
                            />
                            <FieldError errors={[form.formState.errors.name]} />
                        </Field>

                        <Controller
                            control={form.control}
                            name="logo"
                            render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="brand-logo">Logo thương hiệu</FieldLabel>
                                    <div className="space-y-4">
                                        {logoPreview ? (
                                            <div className="relative w-full h-40 border-2 border-dashed rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center border-muted-foreground/20">
                                                <Image
                                                    src={logoPreview}
                                                    alt="Xem trước logo"
                                                    fill
                                                    unoptimized
                                                    className="object-contain p-4"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveLogo}
                                                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="brand-logo"
                                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors bg-muted/10 border-muted-foreground/20"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                                    <p className="mb-1 text-sm text-muted-foreground">
                                                        <span className="font-semibold text-foreground">Nhấp để tải lên</span> hoặc kéo thả
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
                                                </div>
                                                <Input
                                                    id="brand-logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleLogoChange(e.target.files)}
                                                    {...field}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isLoading}
                                >
                                    Hủy
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading} className="font-bold">
                                {isLoading ? "Đang lưu..." : brand ? "Cập nhật" : "Tạo mới"}
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
