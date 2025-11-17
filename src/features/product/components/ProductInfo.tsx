'use client';

import { StarIcon } from "lucide-react";
import { ProductType, ProductVariant } from "../types";
import { formatCurrency } from "@/utils/format";
import { useState, useMemo, useEffect } from "react";

// Dữ liệu mẫu cho Quantity Selector (giả định)
const QuantitySelector = ({ quantity, setQuantity, isInStock }: { quantity: number, setQuantity: (q: number) => void, isInStock: boolean }) => {
    const decrement = () => setQuantity(Math.max(1, quantity - 1));
    const increment = () => setQuantity(quantity + 1);

    return (
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full max-w-[120px] bg-white">
            <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1 || !isInStock}
                className={`px-2 py-1 text-lg font-medium ${quantity <= 1 || !isInStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
                −
            </button>
            <span className="flex-1 text-center text-xs font-semibold text-gray-800">
                {quantity}
            </span>
            <button
                type="button"
                onClick={increment}
                disabled={!isInStock}
                className={`px-2 py-1 text-lg font-medium ${!isInStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
                +
            </button>
        </div>
    );
};


interface ProductInfoProps {
    product: ProductType;
    variants: ProductVariant[];
}

const ProductInfo = ({ product, variants }: ProductInfoProps) => {
    const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;

    // --- LOGIC VARIANT SELECTION ---
    const availableColors = Array.from(
        new Set(variants.map(v => v.color).filter(Boolean))
    );
    const availableSizes = Array.from(
        new Set(
            variants
                .map(v => v.size?.label)
                .filter((label): label is string => Boolean(label))
        )
    );

    const [selectedColor, setSelectedColor] = useState<string | null>(
        availableColors[0] || null
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const variantsByColor = useMemo(() => {
        if (!selectedColor) return [];
        return variants.filter(v => v.color === selectedColor && v.status === 'ACTIVE');
    }, [variants, selectedColor]);

    const currentVariant = useMemo(() => {
        if (!selectedColor || !selectedSize) return null;
        return variantsByColor.find(
            v => v.size?.label === selectedSize
        );
    }, [variantsByColor, selectedColor, selectedSize]);

    useEffect(() => {
        const sizesForNewColor = Array.from(
            new Set(
                variantsByColor
                    .map((variant) => variant.size?.label)
                    .filter((label): label is string => Boolean(label))
            )
        );
        
        if (selectedSize && sizesForNewColor.includes(selectedSize)) {
            // Giữ size hiện tại
        } else if (sizesForNewColor.length > 0) {
            setSelectedSize(sizesForNewColor[0]);
        } else {
            setSelectedSize(null);
        }
        setQuantity(1);
    }, [selectedColor, variantsByColor]);

    const currentStock = currentVariant?.stock || 0;
    const isInStock = currentStock > 0;
    const currentDisplayPrice = currentVariant?.price || discountedPrice;
    
    const isReadyForPurchase = selectedColor && selectedSize && isInStock && quantity > 0;
    // --- END LOGIC VARIANT SELECTION ---


    return (
        <div className=" mx-auto">
            {/* TÊN SẢN PHẨM - Giảm từ text-3xl xuống text-2xl */}
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{product.name}</h1>
            
            {/* RATING & REVIEWS - Giảm margin bottom */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                        <StarIcon 
                            key={index} 
                            className={`w-3.5 h-3.5 ${index < Math.floor(Number(product.averageRating || 0)) ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300'}`} 
                        />
                    ))}
                </div>
                {/* Giảm font review */}
                <span className="text-xs text-gray-500">({product.reviewsCount || 0} Reviews)</span>
            </div>

            {/* GIÁ - Giảm kích thước */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl text-red-700 font-extrabold">{formatCurrency(currentDisplayPrice)}</span>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
            </div>

            {/* MÔ TẢ NGẮN - Giảm margin và padding */}
            <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                Engineered for the modern city dweller, the {product.name} combines peak 
                performance with street-ready style. Experience unparalleled comfort and durability.
            </p>

            {/* LỰA CHỌN MÀU - Giảm spacing */}
            <div className="mb-6">
                <span className="text-sm font-bold text-gray-800 uppercase mb-2 block">Color</span>
                <div className="flex gap-2 flex-wrap">
                    {availableColors.map((color) => {
                        const isSelected = selectedColor === color;
                        const colorStock = variants.filter(v => v.color === color && v.status === 'ACTIVE').reduce((sum, v) => sum + (v.stock || 0), 0);
                        const hasStock = colorStock > 0;

                        return (
                            <button
                                key={color}
                                type="button"
                                className={`
                                    rounded-full outline-none border-2 transition duration-200 shadow-sm
                                    ${isSelected
                                        ? "ring-2 ring-offset-2 ring-red-500 border-white scale-105"
                                        : "border-gray-300 hover:border-red-400"}
                                    ${!hasStock ? "opacity-40 cursor-not-allowed" : ""}
                                `}
                                style={{
                                    // Giảm kích thước vòng tròn màu
                                    backgroundColor: color,
                                    width: 28,
                                    height: 28,
                                }}
                                onClick={() => hasStock && setSelectedColor(color)}
                                disabled={!hasStock}
                                title={!hasStock ? "Out of Stock" : color}
                            />
                        );
                    })}
                </div>
            </div>

            {/* LỰA CHỌN SIZE - Giảm spacing */}
            <div className="mb-6">
                <span className="text-sm font-bold text-gray-800 uppercase mb-2 block">Size</span>
                <div className="flex gap-2 flex-wrap">
                    {availableSizes.map((size) => {
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
                                    px-3 py-1.5 rounded-lg border transition duration-200 text-xs font-semibold
                                    ${isSelected
                                        ? "bg-red-700 text-white border-red-700 shadow-md"
                                        : isSizeInStock
                                            ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-red-400"
                                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"}
                                    focus:outline-none
                                `}
                                onClick={() => isSizeInStock && setSelectedSize(size)}
                                title={!isSizeInStock ? "Out of Stock" : `${size} - Stock: ${sizeStock}`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TỒN KHO & SỐ LƯỢNG - Giảm margin và padding */}
            <div className="mb-6 border-b border-gray-200 pb-6">
                {selectedSize && (
                    <p className={`text-xs font-medium mb-2 ${isInStock ? 'text-red-700' : 'text-red-500'}`}>
                        {isInStock ? `${currentStock} left in stock for selected size` : 'Out of stock for selected size'}
                    </p>
                )}
                
                <div className="flex items-center gap-3">
                    <QuantitySelector 
                        quantity={quantity} 
                        setQuantity={setQuantity} 
                        isInStock={isInStock} 
                    />
                    
                    {/* NÚT THAO TÁC (Giả lập) - Giảm padding */}
                    <button
                        type="button"
                        disabled={!isReadyForPurchase}
                        className={`
                            flex-1 px-4 py-2.5 rounded-md text-sm text-white font-bold transition duration-200 shadow-lg 
                            ${isReadyForPurchase ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-400 cursor-not-allowed'}
                        `}
                    >
                        Add to Cart
                    </button>
                    <button
                        type="button"
                        disabled={!isReadyForPurchase}
                        className={`
                            flex-1 px-4 py-2.5 rounded-md text-sm font-bold transition duration-200 border-2 
                            ${isReadyForPurchase ? 'border-red-700 text-red-700 hover:bg-red-50' : 'border-gray-400 text-gray-400 cursor-not-allowed'}
                        `}
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* PHẦN MÔ TẢ DÀI - Giảm margin và font size */}
            <div className="mt-6">
                <h2 className="text-lg font-bold uppercase text-gray-900 mb-2">Description</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Featuring a lightweight FlyKnit upper for breathability and a responsive React foam midsole 
                    for all-day comfort. The durable rubber outsole provides excellent traction on urban surfaces.
                    The design is modern and minimalist, perfect for casual wear or light running.
                </p>
            </div>
        </div>
    );
};

export default ProductInfo;