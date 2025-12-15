import { ProductVariant } from "@/features/product/types";
import { VariantFormValues } from "../schemas";

/**
 * Generate slug from product name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Transform variants from API to form values
 * Stock trong form là delta (thay đổi), default 0, không phải stock hiện tại
 */
export const transformVariantsToForm = (
  variants: ProductVariant[]
): VariantFormValues[] => {
  return variants.map((variant) => ({
    id: variant.id,
    color: variant.color,
    sizes: variant.sizes.map((size) => ({
      id: size.id,
      size: Number(size.size),
      stock: 0, // Delta stock, default 0
      currentStock: size.stock, // Lưu stock hiện tại để hiển thị
    })),
  }));
};



