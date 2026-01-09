import { Controller } from "react-hook-form";
import { FileText, Tags, DollarSign } from "lucide-react";
import { CategoryType, BrandType } from "@/features/product/types";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, Control } from "react-hook-form";

interface ProductBasicInfoSectionProps {
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: any;
    categories: CategoryType[];
    brands: BrandType[];
}

export const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
    register,
    control,
    errors,
    categories,
    brands,
}) => {
    return (
        <FieldGroup className="gap-10">
            {/* Thông tin cơ bản */}
            <FieldSet className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
                <FieldLegend className="flex items-center gap-2 text-lg font-bold pb-2 border-b w-full">
                    <FileText className="h-5 w-5 text-primary" />
                    Thông tin cơ bản
                </FieldLegend>
                <FieldGroup className="pt-6">
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="product-name">Tên sản phẩm</FieldLabel>
                        <Input id="product-name" placeholder="Ví dụ: Giày thể thao da cổ điển" {...register("name")} className="h-11" />
                        <FieldError errors={[errors.name]} />
                    </Field>

                    <Field data-invalid={!!errors.description}>
                        <FieldLabel htmlFor="product-description">Mô tả sản phẩm</FieldLabel>
                        <Textarea
                            id="product-description"
                            placeholder="Nhập mô tả chi tiết..."
                            rows={4}
                            {...register("description")}
                        />
                        <FieldError errors={[errors.description]} />
                    </Field>
                </FieldGroup>
            </FieldSet>

            {/* Phân loại và Giá bán */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Phân loại */}
                <FieldSet className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
                    <FieldLegend className="flex items-center gap-2 text-lg font-bold pb-2 border-b w-full">
                        <Tags className="h-5 w-5 text-primary" />
                        Phân loại
                    </FieldLegend>
                    <FieldGroup className="pt-6">
                        <Controller
                            control={control}
                            name="brandId"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-brand">Thương hiệu</FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger id="product-brand" className="h-11 cursor-pointer">
                                            <SelectValue placeholder="Chọn thương hiệu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={control}
                            name="categoryId"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-category">Danh mục</FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger id="product-category" className="h-11 cursor-pointer">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                {/* Giá bán */}
                <FieldSet className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
                    <FieldLegend className="flex items-center gap-2 text-lg font-bold pb-2 border-b w-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Giá bán
                    </FieldLegend>
                    <FieldGroup className="pt-6">
                        <Field data-invalid={!!errors.price}>
                            <FieldLabel htmlFor="product-price">Giá cơ bản (VNĐ)</FieldLabel>
                            <Input
                                id="product-price"
                                type="number"
                                className="h-11"
                                placeholder="Ví dụ: 1200000"
                                {...register("price", { valueAsNumber: true })}
                            />
                            <FieldError errors={[errors.price]} />
                        </Field>
                        <Field data-invalid={!!errors.discount}>
                            <FieldLabel htmlFor="product-discount">Giảm giá (%)</FieldLabel>
                            <Input
                                id="product-discount"
                                type="number"
                                className="h-11"
                                placeholder="Ví dụ: 15"
                                min={0}
                                max={100}
                                {...register("discount", { valueAsNumber: true })}
                            />
                            <FieldError errors={[errors.discount]} />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
        </FieldGroup>
    );
};
