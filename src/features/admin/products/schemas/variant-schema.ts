import { z } from "zod";

/**
 * Schema cho Variant Size
 * stock: số lượng thay đổi (delta), có thể âm để giảm stock
 */
export const variantSizeSchema = z.object({
  id: z.string().optional(),
  size: z.number().min(0, "Size must be greater than 0"),
  stock: z.number().optional(), // Delta stock, có thể âm
  currentStock: z.number().optional(), // Stock hiện tại từ API, chỉ để hiển thị
});

/**
 * Schema cho Product Variant
 */
export const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  sizes: z.array(variantSizeSchema).min(1, "At least one size is required"),
});

/**
 * Schema cho Variants Form
 */
export const productVariantsSchema = z.object({
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type VariantSizeFormValues = z.infer<typeof variantSizeSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
export type VariantsFormValues = z.infer<typeof productVariantsSchema>;



