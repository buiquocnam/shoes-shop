'use client';

import { ProductVariant } from "../types";
import { formatCurrency } from "@/utils/format";
import { useState, useMemo, useEffect } from "react";

interface ProductVariantSelectorProps {
    variants: ProductVariant[];
    initialPrice: number;
}

const ProductVariantSelector = ({ variants, initialPrice }: ProductVariantSelectorProps) => {
    // Lấy danh sách màu duy nhất từ variants
    const availableColors = Array.from(
        new Set(variants.map(v => v.color).filter(Boolean))
    );

    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        availableColors[0] || null
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Filter variants theo màu đã chọn
    const variantsByColor = useMemo(() => {
        if (!selectedVariant) return [];
        return variants.filter(v => v.color === selectedVariant && v.status === 'ACTIVE');
    }, [variants, selectedVariant]);

    // Lấy danh sách sizes từ variants của màu đã chọn
    const sizesByColor = useMemo(() => {
        return Array.from(
            new Set(
                variantsByColor
                    .map((variant) => variant.size?.label)
                    .filter((label): label is string => Boolean(label))
            )
        );
    }, [variantsByColor]);

    // Reset selectedSize khi đổi màu
    useEffect(() => {
        if (sizesByColor.length > 0) {
            setSelectedSize(sizesByColor[0]);
        } else {
            setSelectedSize(null);
        }
    }, [selectedVariant, sizesByColor]);

    // Lấy variant hiện tại (theo màu và size đã chọn)
    const currentVariant = useMemo(() => {
        if (!selectedVariant || !selectedSize) return null;
        return variantsByColor.find(
            v => v.size?.label === selectedSize
        );
    }, [variantsByColor, selectedVariant, selectedSize]);

    // Stock và giá
    const currentStock = currentVariant?.stock || 0;
    const isInStock = currentStock > 0;
    const currentPrice = initialPrice; // Giữ giá cơ bản, có thể thay đổi nếu giá theo variant

    const handleColorChange = (color: string) => {
        setSelectedVariant(color);
    };

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
    };

    return (
        // ⭐️ PHẦN TƯƠNG TÁC (CHỌN MÀU/SIZE/HIỂN THỊ TỒN KHO)
        <div className="py-4">
            
            {/* Hiển thị Tồn kho (Dùng logic Client Component) */}
            <div className="flex-col gap-2 text-md text-black-500 border-b border-gray-200 pb-8">
                <div className="flex items-center gap-2 ">
                    <span className="font-bold min-w-[100px]">Availability:</span>
                    <span className={isInStock ? "text-green-600" : "text-red-600"}>
                        {isInStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>
            </div>

            {/* Lựa chọn Màu */}
            <div className="flex-col gap-2 text-md text-black-500 border-b border-gray-200 pb-8 pt-8">
                <div className="flex items-center gap-4 mb-4">
                    <span className="font-bold min-w-[100px]">Select Color:</span>
                    <div className="flex gap-2 flex-wrap">
                        {availableColors.map((color) => {
                            // ... (Logic chọn màu như code gốc)
                            const isSelected = selectedVariant === color;
                            const colorVariants = variants.filter(v => v.color === color && v.status === 'ACTIVE');
                            const colorStock = colorVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
                            const hasStock = colorStock > 0;

                            return (
                                <button
                                    key={color}
                                    type="button"
                                    className={`
                                        rounded-full outline-none border-2 transition duration-150 shadow-sm
                                        ${isSelected
                                            ? "ring-2 ring-blue-500 border-blue-500 scale-110"
                                            : "border-gray-300 hover:border-blue-400"}
                                        ${!hasStock ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                    style={{
                                        backgroundColor: color,
                                        width: 26,
                                        height: 26,
                                    }}
                                    onClick={() => hasStock && handleColorChange(color)}
                                    disabled={!hasStock}
                                    title={!hasStock ? "Out of Stock" : color}
                                >
                                    {isSelected && (
                                        <span className="block w-full h-full rounded-full border-2 border-white pointer-events-none" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Lựa chọn Size */}
                {selectedVariant && (
                    <>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-bold min-w-[100px]">Size:</span>
                            {/* ... (Logic chọn size như code gốc) */}
                            <div className="flex gap-2 flex-wrap">
                                {sizesByColor.length > 0 ? (
                                    sizesByColor.map((size) => {
                                        const sizeVariant = variantsByColor.find(v => v.size?.label === size);
                                        const sizeStock = sizeVariant?.stock || 0;
                                        const isSizeInStock = sizeStock > 0;
                                        const isSelected = selectedSize === size;

                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                disabled={!isSizeInStock}
                                                className={`
                                                    px-3 py-1 rounded-md border transition
                                                    ${isSelected
                                                        ? "bg-blue-600 text-white border-blue-600 shadow"
                                                        : isSizeInStock
                                                            ? "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"}
                                                    focus:outline-none
                                                `}
                                                onClick={() => isSizeInStock && handleSizeChange(size)}
                                                title={!isSizeInStock ? "Out of Stock" : `${size} - Stock: ${sizeStock}`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <span className="text-gray-500">No sizes available for this color</span>
                                )}
                            </div>
                        </div>

                        {/* Hiển thị tồn kho theo size */}
                        {selectedSize && currentVariant && (
                            <div className="flex items-center gap-4 mb-2">
                                <span className="font-bold min-w-[100px]">Stock:</span>
                                <span
                                    className={`
                                        px-2 py-0.5 rounded-md
                                        ${isInStock
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"}
                                    `}
                                >
                                    {isInStock ? currentStock : "Out of Stock"}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductVariantSelector;