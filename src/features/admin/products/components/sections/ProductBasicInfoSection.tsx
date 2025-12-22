"use client";

import { Control } from "react-hook-form";
import { FileText, Tags, DollarSign } from "lucide-react";
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
        <div className="space-y-10">
            {/* Thông tin cơ bản */}
            <div className="bg-card rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-10 transition-shadow">
                <div className="mb-6 border-b border-border pb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Thông tin cơ bản
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-y-8">
                    <div className="group">
                        <InputField
                            control={control}
                            name="name"
                            label="Tên sản phẩm"
                            placeholder="Ví dụ: Giày thể thao da cổ điển"
                        />
                    </div>
                    <div className="group">
                        <TextareaField
                            control={control}
                            name="description"
                            label="Mô tả sản phẩm"
                            placeholder="Nhập mô tả chi tiết..."
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            {/* Phân loại và Giá bán - Grid 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Phân loại */}
                <div className="bg-card rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-10 h-full">
                    <div className="mb-6 border-b border-border pb-4">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Tags className="h-5 w-5 text-primary" />
                            Phân loại
                        </h2>
                    </div>
                    <div className="space-y-6">
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

                {/* Giá bán */}
                <div className="bg-card rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-10 h-full">
                    <div className="mb-6 border-b border-border pb-4">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Giá bán
                        </h2>
                    </div>
                    <div className="space-y-6">
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
        </div>
    );
};
