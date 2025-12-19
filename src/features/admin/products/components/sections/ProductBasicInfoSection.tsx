"use client";

import { Control } from "react-hook-form";
import { InputField, TextareaField, NumberField, SelectField } from "@/components/form";
import { CategoryType, BrandType } from "@/features/product/types";

interface ProductBasicInfoSectionProps {
    control: Control<any>;
    categories: CategoryType[];
    brands: BrandType[];
}

export const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
    control,
    categories,
    brands,
}) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border p-4 space-y-3">
                <InputField
                    control={control}
                    name="name"
                    label="Tên sản phẩm"
                    placeholder="Ví dụ: Giày thể thao da cổ điển"
                />
                <TextareaField
                    control={control}
                    name="description"
                    label="Mô tả sản phẩm"
                    placeholder="Nhập mô tả chi tiết..."
                    rows={4}
                />
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        control={control}
                        name="brandId"
                        label="Thương hiệu"
                        options={brands}
                        placeholder="Chọn thương hiệu"
                    />
                    <SelectField
                        control={control}
                        name="categoryId"
                        label="Danh mục"
                        options={categories}
                        placeholder="Chọn danh mục"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <NumberField
                        control={control}
                        name="price"
                        label="Giá cơ bản (VNĐ)"
                        placeholder="Ví dụ: 1200000"
                    />
                    <NumberField
                        control={control}
                        name="discount"
                        label="Giảm giá (%)"
                        placeholder="Ví dụ: 15"
                        min={0}
                        max={100}
                    />
                </div>
            </div>
        </div>
    );
};
