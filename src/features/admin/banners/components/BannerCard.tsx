"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { bannerSchema, BannerFormValues } from "../schema";
import { Banner, BannerSlot } from "@/types/banner";

interface BannerCardProps {
    banner?: Banner;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading?: boolean;
}

export default function BannerCard({
    banner,
    onSubmit,
    isLoading,
}: BannerCardProps) {
   
    const [imagePreview, setImagePreview] = useState<string | null>(
        banner?.imageUrl || null
    );

    const form = useForm<BannerFormValues>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            title: banner?.title || "",
            link: banner?.link || "",
            slot: banner?.slot || "",
            image: undefined,
            active: banner?.active ?? false,
        },
    });

    const handleFormSubmit = async (data: BannerFormValues) => {
        if (!data.image && !banner) {
            form.setError("image", {
                type: "manual",
                message: "Vui lòng chọn hình ảnh",
            });
            return;
        }

        const formData = new FormData();
        const bannerData: {
            title: string;
            link: string;
            slot: BannerSlot;
            active?: boolean;
            id?: string;
        } = {
            title: data.title,
            link: data.link,
            slot: data.slot as BannerSlot,
        };

        if (banner?.id) {
            bannerData.id = banner.id;
            bannerData.active = data.active ?? false;
        }

        const requestBlob = new Blob([JSON.stringify(bannerData)], {
            type: "application/json",
        });
        formData.append("request", requestBlob);

        if (data.image) {
            formData.append("file", data.image);
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        form.setValue("image", file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        form.setValue("image", undefined);
        setImagePreview(banner?.imageUrl || null);
    };

    return (
        <Card className={`relative overflow-hidden ${isLoading ? "opacity-60" : ""}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50 pointer-events-none">
                    <Spinner className="h-8 w-8 pointer-events-auto" />
                </div>
            )}
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-xl">{banner?.slot}</CardTitle>
                            {banner && (
                                <Controller
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => {
                                        const handleActiveToggle = async (checked: boolean) => {
                                            field.onChange(checked);
                                            // Lấy toàn bộ giá trị form hiện tại
                                            const currentValues = form.getValues();
                                            // Tạo data với active mới
                                            const data = {
                                                ...currentValues,
                                                active: checked,
                                            };
                                            // Submit ngay với giá trị mới
                                            await handleFormSubmit(data);
                                        };

                                        return (
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={field.value ?? false}
                                                    onCheckedChange={handleActiveToggle}
                                                    disabled={isLoading}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {field.value ? "Hoạt động" : "Đã ẩn"}
                                                </span>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                        </div>
                        <CardDescription className="mt-1">
                            {banner ? "Cập nhật hoặc xóa banner" : "Tạo banner mới"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Image Preview/Upload */}
                    <Field data-invalid={!!form.formState.errors.image}>
                        <div className="space-y-3">
                            {imagePreview ? (
                                <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden bg-muted/30">
                                    <Image
                                        src={imagePreview}
                                        alt={banner?.title || "Banner preview"}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <label
                                            htmlFor={`banner-upload-${banner?.slot}`}
                                            className="p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
                                            title="Thay đổi ảnh"
                                        >
                                            <Upload className="h-4 w-4" />
                                            <Input
                                                id={`banner-upload-${banner?.slot}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(e.target.files)}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                                            title="Xóa ảnh"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor={`banner-upload-new-${banner?.slot}`}
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors bg-muted/10 border-muted-foreground/20"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                        <p className="mb-1 text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">Nhấp để tải lên</span> hoặc kéo thả
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
                                    </div>
                                    <Input
                                        id={`banner-upload-new-${banner?.slot}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e.target.files)}
                                    />
                                </label>
                            )}
                        </div>
                        <FieldError errors={[form.formState.errors.image]} />
                    </Field>

                    {/* Title */}
                    <Field data-invalid={!!form.formState.errors.title}>
                        <FieldLabel htmlFor={`title-${banner?.slot}`}>Tiêu đề</FieldLabel>
                        <Input
                            id={`title-${banner?.slot}`}
                            placeholder="Nhập tiêu đề banner"
                            {...form.register("title")}
                            className="h-11"
                        />
                        <FieldError errors={[form.formState.errors.title]} />
                    </Field>

                    {/* Link */}
                    <Field data-invalid={!!form.formState.errors.link}>
                        <FieldLabel htmlFor={`link-${banner?.slot}`}>Link</FieldLabel>
                        <Input
                            id={`link-${banner?.slot}`}
                            placeholder="Nhập link (ví dụ: /products)"
                            {...form.register("link")}
                            className="h-11"
                        />
                        <FieldError errors={[form.formState.errors.link]} />
                    </Field>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading 
                                ? (banner ? "Đang cập nhật..." : "Đang tạo...") 
                                : (banner ? "Cập nhật" : "Tạo Banner")
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
