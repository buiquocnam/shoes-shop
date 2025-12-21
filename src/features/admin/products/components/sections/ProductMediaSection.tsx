"use client";

import { Control, useWatch, Controller } from "react-hook-form";
import { Upload, X, Star } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ImageType } from "@/features/product/types";

interface ProductMediaSectionProps {
    control: Control<any>;
    images: File[];
    existingImages?: ImageType[];
    deletedImageNames?: string[];
    mode?: "create" | "images";
    onAddImages?: (files: FileList | null) => void;
    onRemoveNewImage?: (index: number) => void;
    onRemoveExistingImage?: (fileName: string) => void;
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
    control,
    images,
    existingImages = [],
    deletedImageNames = [],
    mode = "images",
    onAddImages,
    onRemoveNewImage,
    onRemoveExistingImage,
}) => {
    const isCreateMode = mode === "create";
    const primaryName = useWatch({ control, name: "primaryName" });

    // Filter out deleted existing images
    const visibleExistingImages = existingImages.filter(
        (img) => !deletedImageNames.includes(img.fileName)
    );

    // Separate images by type
    const existingImagesList = visibleExistingImages.map((img, idx) => ({
        type: 'existing' as const,
        img,
        idx,
        fileName: img.fileName,
    }));

    const newImagesList = images.map((img, idx) => ({
        type: 'new' as const,
        img,
        idx,
        fileName: img.name,
    }));

    // Find primary image (only one)
    const primaryImage = [...existingImagesList, ...newImagesList].find(
        (item) => item.fileName === primaryName
    );

    return (
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-6">
                    {/* ===== KHU VỰC 1: IMPORT ẢNH ===== */}
                    <div>
                        <Controller
                            control={control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-2 block">
                                        Tải lên hình ảnh
                                    </FieldLabel>
                                    <label
                                        htmlFor="file-upload"
                                        className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:border-red-500 dark:hover:border-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    >
                                        <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
                                            <span className="font-semibold text-red-600 dark:text-red-500">Nhấp để tải lên</span> hoặc kéo thả
                                        </p>
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                            PNG, JPG, GIF
                                        </p>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
                                            onChange={(e) => {
                                                if (onAddImages) {
                                                    onAddImages(e.target.files);
                                                }
                                                field.onChange(undefined);
                                            }}
                                        />
                                    </label>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    {/* ===== KHU VỰC 2: ẢNH PRIMARY ===== */}
                    {primaryImage && (
                        <div>
                            <FieldLabel className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-3 block">
                                Ảnh chính
                            </FieldLabel>
                            <Controller
                                control={control}
                                name="primaryName"
                                render={({ field }) => (
                                    <div className="relative group aspect-square w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-yellow-500 dark:border-yellow-400 shadow-lg shadow-yellow-500/20">
                                        <Image
                                            src={primaryImage.type === 'existing'
                                                ? primaryImage.img.url
                                                : URL.createObjectURL(primaryImage.img)}
                                            alt={primaryImage.type === 'existing'
                                                ? primaryImage.img.fileName
                                                : `preview-${primaryImage.idx}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                            priority
                                        />
                                        <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1 shadow-lg z-10">
                                            <Star className="h-3 w-3 fill-white" />
                                        </div>
                                        {primaryImage.type === 'new' && (
                                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm z-10">
                                                Mới
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* ===== KHU VỰC 3: ẢNH CŨ (EXISTING) ===== */}
                    {existingImagesList.length > 0 && (
                        <div>
                            <FieldLabel className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-3 block">
                                Ảnh hiện có ({existingImagesList.length})
                            </FieldLabel>
                            <Controller
                                control={control}
                                name="primaryName"
                                render={({ field }) => (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                        {existingImagesList.map((item) => {
                                            const isPrimary = field.value === item.fileName;

                                            return (
                                                <div
                                                    key={`existing-${item.idx}`}
                                                    className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 transition-all duration-200 cursor-pointer ${isPrimary
                                                        ? 'border-yellow-500 dark:border-yellow-400 shadow-lg shadow-yellow-500/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600'
                                                        }`}
                                                    onClick={() => {
                                                        field.onChange(item.fileName);
                                                    }}
                                                >
                                                    <Image
                                                        src={item.img.url}
                                                        alt={item.img.fileName || `existing-${item.idx}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                        priority
                                                    />
                                                    {isPrimary && (
                                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1.5 shadow-lg z-10">
                                                            <Star className="h-3.5 w-3.5 fill-white" />
                                                        </div>
                                                    )}
                                                    {!isPrimary && (
                                                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            Nhấp để đặt làm ảnh chính
                                                        </div>
                                                    )}
                                                    {onRemoveExistingImage && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRemoveExistingImage(item.fileName);
                                                                // If deleting primary image, set first available as primary
                                                                if (isPrimary) {
                                                                    const remaining = [
                                                                        ...existingImagesList.filter(img => img.fileName !== item.fileName),
                                                                        ...newImagesList
                                                                    ].map(img => img.fileName);
                                                                    if (remaining.length > 0) {
                                                                        field.onChange(remaining[0]);
                                                                    }
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm z-10"
                                                            title="Xóa hình ảnh"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* ===== KHU VỰC 4: ẢNH MỚI (NEW) ===== */}
                    {newImagesList.length > 0 && (
                        <div>
                            <FieldLabel className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-3 block">
                                Ảnh mới ({newImagesList.length})
                            </FieldLabel>
                            <Controller
                                control={control}
                                name="primaryName"
                                render={({ field }) => (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                        {newImagesList.map((item) => {
                                            const isPrimary = field.value === item.fileName;

                                            return (
                                                <div
                                                    key={`new-${item.idx}`}
                                                    className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 transition-all duration-200 cursor-pointer ${isPrimary
                                                        ? 'border-yellow-500 dark:border-yellow-400 shadow-lg shadow-yellow-500/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600'
                                                        }`}
                                                    onClick={() => {
                                                        field.onChange(item.fileName);
                                                    }}
                                                >
                                                    <Image
                                                        src={URL.createObjectURL(item.img)}
                                                        alt={`preview-${item.idx}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                        priority
                                                    />
                                                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium shadow-sm z-10">
                                                        Mới
                                                    </div>
                                                    {isPrimary && (
                                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1.5 shadow-lg z-10">
                                                            <Star className="h-3.5 w-3.5 fill-white" />
                                                        </div>
                                                    )}
                                                    {!isPrimary && (
                                                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            Nhấp để đặt làm ảnh chính
                                                        </div>
                                                    )}
                                                    {onRemoveNewImage && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRemoveNewImage(item.idx);
                                                                // If deleting primary image, set first available as primary
                                                                if (isPrimary) {
                                                                    const remaining = [
                                                                        ...existingImagesList,
                                                                        ...newImagesList.filter((_, i) => i !== item.idx)
                                                                    ].map(img => img.fileName);
                                                                    if (remaining.length > 0) {
                                                                        field.onChange(remaining[0]);
                                                                    }
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm z-10"
                                                            title="Xóa hình ảnh"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
