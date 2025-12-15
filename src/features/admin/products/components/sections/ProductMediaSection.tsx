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
    mode?: "create" | "images";
    onAddImages?: (files: FileList | null) => void;
    onRemoveImage?: (index: number) => void;
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
    control,
    images,
    existingImages = [],
    mode = "images",
    onAddImages,
    onRemoveImage,
}) => {
    const isCreateMode = mode === "create";
    const primaryName = useWatch({ control, name: "primaryName" });

    // Combine existing images (from API) and new images (just uploaded)
    const allImages = [
        ...existingImages.map((img, idx) => ({
            type: 'existing' as const,
            img,
            idx,
            fileName: img.fileName,
        })),
        ...images.map((img, idx) => ({
            type: 'new' as const,
            img,
            idx,
            fileName: img.name,
        })),
    ];

    return (
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-6">
                    {/* Upload Area */}
                    <div>
                        <Controller
                            control={control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-2 block">
                                        Product Images
                                    </FieldLabel>
                                    <label
                                        htmlFor="file-upload"
                                        className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:border-red-500 dark:hover:border-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    >
                                        <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
                                            <span className="font-semibold text-red-600 dark:text-red-500">Click to upload</span> or drag and drop
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

                    {/* Preview Area */}
                    {allImages.length > 0 && (
                        <div>
                            <p className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal pb-3">
                                Image Preview
                                <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                                    ({allImages.length} {allImages.length === 1 ? 'image' : 'images'})
                                </span>
                            </p>
                            {isCreateMode ? (
                                <Controller
                                    control={control}
                                    name="primaryName"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                                {allImages.map((item) => {
                                                    const itemFileName = item.type === 'existing' ? item.img.fileName : item.img.name;
                                                    const isPrimary = item.type === 'new' && field.value === itemFileName;

                                                    return (
                                                        <div
                                                            key={`${item.type}-${item.idx}`}
                                                            className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 transition-all duration-200 ${item.type === 'new' ? 'cursor-pointer' : ''} ${isPrimary
                                                                ? 'border-yellow-500 dark:border-yellow-400 shadow-lg shadow-yellow-500/20'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600'
                                                                }`}
                                                            onClick={() => {
                                                                if (item.type === 'new') {
                                                                    field.onChange(itemFileName);
                                                                }
                                                            }}
                                                        >
                                                            <Image
                                                                src={item.type === 'existing' ? item.img.url : URL.createObjectURL(item.img)}
                                                                alt={
                                                                    item.type === 'existing'
                                                                        ? item.img.fileName || `existing-${item.idx}`
                                                                        : `preview-${item.idx}`
                                                                }
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                                priority
                                                            />
                                                            {item.type === 'new' && (
                                                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium shadow-sm z-10">
                                                                    New
                                                                </div>
                                                            )}
                                                            {isPrimary && (
                                                                <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1.5 shadow-lg z-10">
                                                                    <Star className="h-3.5 w-3.5 fill-white" />
                                                                </div>
                                                            )}
                                                            {!isPrimary && item.type === 'new' && (
                                                                <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                    Click to set as primary
                                                                </div>
                                                            )}
                                                            {onRemoveImage && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (item.type === 'new') {
                                                                            onRemoveImage(item.idx);
                                                                        }
                                                                    }}
                                                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm z-10"
                                                                    title="Remove image"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <input type="hidden" {...field} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                    {allImages.map((item) => (
                                        <div
                                            key={`${item.type}-${item.idx}`}
                                            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-200"
                                        >
                                            <Image
                                                src={item.type === 'existing' ? item.img.url : URL.createObjectURL(item.img)}
                                                alt={
                                                    item.type === 'existing'
                                                        ? item.img.fileName || `existing-${item.idx}`
                                                        : `preview-${item.idx}`
                                                }
                                                fill
                                                className="object-cover"
                                                unoptimized
                                                priority
                                            />
                                            {item.type === 'new' && (
                                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium shadow-sm z-10">
                                                    New
                                                </div>
                                            )}
                                            {onRemoveImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (item.type === 'new') {
                                                            onRemoveImage(item.idx);
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm z-10"
                                                    title="Remove image"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
