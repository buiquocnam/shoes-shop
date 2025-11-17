"use client";

import { Control } from "react-hook-form";
import { X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ProductFormValues } from "../schema";
import { ImageType } from "@/features/product/types";
import Image from "next/image";
interface ProductMediaSectionProps {
    control: Control<ProductFormValues>;
    images: File[];
    existingImages?: ImageType[]; // Existing images from product (for edit mode)
    onAddImages: (files: FileList | null) => void;
    onRemoveImage: (index: number) => void;
    onRemoveExistingImage?: (index: number) => void; // Remove existing image
    isEditMode?: boolean; // Whether in edit mode
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
    control,
    images,
    existingImages = [],
    onAddImages,
    onRemoveImage,
    onRemoveExistingImage,
    isEditMode = false,
}) => {
    // Combine existing images (from API) and new images (just uploaded)
    // Existing images have type 'existing', new uploads have type 'new'
    const allImages = [
        ...existingImages.map((img, idx) => ({
            type: 'existing' as const,
            img,
            idx
        })),
        ...images.map((img, idx) => ({
            type: 'new' as const,
            img,
            idx
        })),
    ];

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Media</h3>

            {isEditMode ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Upload Area */}
                    <div>
                        <FormField
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                                        Upload New Images
                                    </FormLabel>
                                    <FormControl>
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex flex-col items-center justify-center pointer-events-none">
                                                <ImageIcon className="mb-3 h-10 w-10 text-gray-400" />
                                                <span className="text-sm text-gray-600 font-medium mb-1">
                                                    Click to upload or drag and drop
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    PNG, JPG, GIF up to 10MB
                                                </span>
                                            </div>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    onAddImages(e.target.files);
                                                    field.onChange(undefined);
                                                }}
                                            />
                                        </label>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right: Preview Area */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">
                            Image Preview
                            {allImages.length > 0 && (
                                <span className="text-gray-500 font-normal ml-2">
                                    ({allImages.length} {allImages.length === 1 ? 'image' : 'images'})
                                </span>
                            )}
                        </h4>
                        {allImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                {allImages.map((item) => (
                                    <div
                                        key={`${item.type}-${item.idx}`}
                                        className={`relative group aspect-square border-2 rounded-lg overflow-hidden bg-gray-100 ${item.type === 'existing'
                                            ? 'border-gray-200 hover:border-red-400'
                                            : 'border-blue-300 hover:border-blue-400'
                                            } transition-colors`}
                                    >
                                        <Image
                                            src={item.type === 'existing' ? item.img.url : URL.createObjectURL(item.img)}
                                            alt={item.type === 'existing' ? item.img.fileName || `existing-${item.idx}` : `preview-${item.idx}`}
                                            className="w-full h-full object-cover"
                                            width={200}
                                            height={200}
                                            unoptimized
                                        />
                                        {item.type === 'new' && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                                                New
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (item.type === 'existing' && onRemoveExistingImage) {
                                                    onRemoveExistingImage(item.idx);
                                                } else if (item.type === 'new') {
                                                    onRemoveImage(item.idx);
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-400">No images yet. Upload images to see preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <FormControl>
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-gray-50 transition"
                                >
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Click to upload or drag and drop
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">
                                            PNG, JPG, GIF up to 10MB
                                        </span>
                                    </div>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            onAddImages(e.target.files);
                                            field.onChange(undefined);
                                        }}
                                    />
                                </label>
                            </FormControl>
                            <FormMessage />

                            {/* New Images (File objects) */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {images.map((img, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100"
                                        >
                                            <Image
                                                src={URL.createObjectURL(img)}
                                                alt={`preview-${idx}`}
                                                className="w-full h-full object-cover"
                                                width={100}
                                                height={100}
                                                unoptimized
                                            />
                                            <button
                                                type="button"
                                                onClick={() => onRemoveImage(idx)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};

