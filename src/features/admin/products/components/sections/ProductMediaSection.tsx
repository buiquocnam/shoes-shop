"use client";

import { Control, useWatch, Controller } from "react-hook-form";
import { CloudUpload, X, Image as ImageIcon, Images, Check } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { ImageType } from "@/features/product/types";
import { Badge } from "@/components/ui/badge";

interface ProductMediaSectionProps {
    control: Control<any>;
    images: File[];
    existingImages?: ImageType[];
    deletedImageNames?: string[];
    onAddImages?: (files: FileList | null) => void;
    onRemoveNewImage?: (index: number) => void;
    onRemoveExistingImage?: (fileName: string) => void;
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
    control,
    images,
    existingImages = [],
    deletedImageNames = [],
    onAddImages,
    onRemoveNewImage,
    onRemoveExistingImage,
}) => {
    const primaryName = useWatch({ control, name: "primaryName" });

    // Filter out deleted existing images
    const visibleExistingImages = existingImages.filter(
        (img) => !deletedImageNames.includes(img.fileName)
    );

    // Combine all images into one list
    const allImages = [
        ...visibleExistingImages.map((img, idx) => ({
            type: 'existing' as const,
            img,
            idx,
            fileName: img.fileName,
            url: img.url,
        })),
        ...images.map((img, idx) => ({
            type: 'new' as const,
            img,
            idx,
            fileName: img.name,
            url: URL.createObjectURL(img),
        })),
    ];

    const totalImages = allImages.length;

    return (
        <div>
            <div className="bg-card rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-10 transition-shadow">
                <div className="mb-6 border-b border-border pb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        Hình ảnh sản phẩm
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Upload Area */}
                    <div className="md:col-span-3">
                        <Controller
                            control={control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <label
                                        htmlFor="file-upload"
                                        className="relative group cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-red-50/30 dark:hover:bg-slate-700 hover:border-primary dark:hover:border-primary transition-all duration-300 ease-in-out"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <div className="p-3 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 mb-3 text-slate-400 group-hover:text-primary">
                                                <CloudUpload className="h-8 w-8" />
                                            </div>
                                            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                <span className="text-primary hover:underline">Tải lên</span> hoặc kéo thả ảnh mới
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG tối đa 5MB</p>
                                        </div>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
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

                    {/* Images Grid */}
                    {totalImages > 0 && (
                        <div className="md:col-span-3 mt-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium flex items-center gap-2">
                                <Images className="h-4 w-4" />
                                Ảnh đã chọn ({totalImages})
                            </p>
                            <Controller
                                control={control}
                                name="primaryName"
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {allImages.map((item) => {
                                            const isPrimary = field.value === item.fileName;

                                            return (
                                                <div
                                                    key={`${item.type}-${item.idx}`}
                                                    onClick={() => field.onChange(item.fileName)}
                                                    className={`group relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                                                        isPrimary
                                                            ? 'border-2 border-primary ring-2 ring-primary/20'
                                                            : 'border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                                    }`}
                                                >
                                                    <Image
                                                        src={item.url}
                                                        alt={item.type === 'existing' ? item.img.fileName : `preview-${item.idx}`}
                                                        fill
                                                        className={`object-cover ${!isPrimary ? 'opacity-90 group-hover:opacity-100 transition-opacity' : ''}`}
                                                        unoptimized
                                                    />
                                                    
                                                    {/* Primary Badge */}
                                                   

                                                    {/* New Badge */}
                                                    {item.type === 'new' && !isPrimary && (
                                                        <div className="absolute top-2 left-2 z-10">
                                                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                                Mới
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className={`absolute inset-0 bg-black/0 ${
                                                        !isPrimary ? 'group-hover:bg-black/10' : ''
                                                    } transition-colors`}>
                                                        {/* Delete Button */}
                                                        {(onRemoveExistingImage || onRemoveNewImage) && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (item.type === 'existing' && onRemoveExistingImage) {
                                                                        onRemoveExistingImage(item.fileName);
                                                                        if (isPrimary) {
                                                                            const remaining = allImages
                                                                                .filter(img => img.fileName !== item.fileName)
                                                                                .map(img => img.fileName);
                                                                            if (remaining.length > 0) {
                                                                                field.onChange(remaining[0]);
                                                                            }
                                                                        }
                                                                    } else if (item.type === 'new' && onRemoveNewImage) {
                                                                        onRemoveNewImage(item.idx);
                                                                        if (isPrimary) {
                                                                            const remaining = allImages
                                                                                .filter(img => !(img.type === 'new' && img.idx === item.idx))
                                                                                .map(img => img.fileName);
                                                                            if (remaining.length > 0) {
                                                                                field.onChange(remaining[0]);
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                                className={`absolute top-2 right-2 p-1.5 bg-white/90 text-slate-400 rounded-full hover:bg-white hover:text-red-600 ${
                                                                    !isPrimary ? 'opacity-0 group-hover:opacity-100' : ''
                                                                } transition-all transform scale-90 group-hover:scale-100`}
                                                                title="Xóa ảnh"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}

                                                        {/* Set Primary Hint */}
                                                        {!isPrimary && (
                                                            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                <span className="text-[10px] text-white font-medium drop-shadow-md">
                                                                    Đặt làm chính
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Radio Button for Primary Selection */}
                                                    <label 
                                                        className="absolute bottom-2 right-2 cursor-pointer z-10"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="primary-image"
                                                            checked={isPrimary}
                                                            onChange={() => field.onChange(item.fileName)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                                                            isPrimary
                                                                ? 'bg-primary border-primary'
                                                                : 'bg-black/30 backdrop-blur-sm border-white/80 hover:bg-black/50'
                                                        }`}>
                                                            <Check className={`h-3 w-3 text-white ${isPrimary ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                                                        </div>
                                                    </label>
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
