"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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

        // Nếu có id thì thêm vào để update, không có thì create
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

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên thương hiệu"
                                            {...field}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Logo thương hiệu</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {logoPreview ? (
                                                <div className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                    <Image
                                                        src={logoPreview}
                                                        alt="Xem trước logo thương hiệu"
                                                        fill
                                                        className="object-contain p-4"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveLogo}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">
                                                                Nhấp để tải lên
                                                            </span>{" "}
                                                            hoặc kéo thả
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF tối đa 10MB
                                                        </p>
                                                    </div>
                                                    <Input
                                                        id="logo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleLogoChange(e.target.files)}
                                                        {...field}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Đang lưu..." : brand ? "Cập nhật" : "Tạo"}
                            </Button>
                        </div>
                        {isLoading &&
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                                <Spinner />
                            </div>
                        }
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

