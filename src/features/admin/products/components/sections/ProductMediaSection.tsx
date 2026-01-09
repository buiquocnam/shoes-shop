"use client";

import { Control, useWatch, Controller } from "react-hook-form";
import { CloudUpload, X, Image as ImageIcon, Images, Check } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldSet, FieldLegend, FieldContent } from "@/components/ui/field";
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

    const visibleExistingImages = existingImages.filter(
        (img) => !deletedImageNames.includes(img.fileName)
    );

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
        <FieldSet className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
            <FieldLegend className="flex items-center gap-2 text-lg font-bold pb-2 border-b w-full">
                <ImageIcon className="h-5 w-5 text-primary" />
                Hình ảnh sản phẩm
            </FieldLegend>
            <FieldGroup className="pt-6">
                <Controller
                    control={control}
                    name="image"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <label
                                htmlFor="file-upload"
                                className="relative group cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed bg-muted/10 border-muted-foreground/20 hover:bg-muted/30 hover:border-primary transition-all duration-300"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <div className="p-3 rounded-full bg-background shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 mb-3 text-muted-foreground group-hover:text-primary">
                                        <CloudUpload className="h-8 w-8" />
                                    </div>
                                    <p className="mb-1 text-sm font-medium text-foreground">
                                        <span className="text-primary hover:underline font-semibold">Tải lên</span> hoặc kéo thả ảnh mới
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG tối đa 5MB</p>
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

                {totalImages > 0 && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Images className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Ảnh đã chọn ({totalImages})</p>
                        </div>
                        <Controller
                            control={control}
                            name="primaryName"
                            render={({ field }) => (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {allImages.map((item) => {
                                        const isPrimary = field.value === item.fileName;

                                        return (
                                            <div
                                                key={`${item.type}-${item.idx}`}
                                                onClick={() => field.onChange(item.fileName)}
                                                className={`group relative aspect-square rounded-lg overflow-hidden bg-muted transition-all cursor-pointer ${isPrimary
                                                        ? 'ring-2 ring-primary ring-offset-2'
                                                        : 'border hover:border-primary/50'
                                                    }`}
                                            >
                                                <Image
                                                    src={item.url}
                                                    alt={item.fileName}
                                                    fill
                                                    className={`object-cover ${!isPrimary ? 'opacity-90 group-hover:opacity-100 transition-opacity' : ''}`}
                                                    unoptimized
                                                />

                                                {item.type === 'new' && !isPrimary && (
                                                    <div className="absolute top-2 left-2 z-10">
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                                            Mới
                                                        </Badge>
                                                    </div>
                                                )}

                                                <div className={`absolute inset-0 transition-colors ${!isPrimary ? 'group-hover:bg-black/10' : ''}`}>
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
                                                            className={`absolute top-2 right-2 p-1 bg-background/90 text-muted-foreground rounded-full hover:bg-destructive hover:text-white ${!isPrimary ? 'opacity-0 group-hover:opacity-100' : ''
                                                                } transition-all`}
                                                            title="Xóa ảnh"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div
                                                    className="absolute bottom-2 right-2 z-10"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${isPrimary
                                                            ? 'bg-primary border-primary'
                                                            : 'bg-black/20 backdrop-blur-sm border-white/80 hover:bg-black/40'
                                                        }`}
                                                        onClick={() => field.onChange(item.fileName)}>
                                                        <Check className={`h-3 w-3 text-white ${isPrimary ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />
                    </div>
                )}
            </FieldGroup>
        </FieldSet>
    );
};
