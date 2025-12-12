import * as z from "zod";

const sizeSchema = z.object({
  size: z.number().min(1, "Size must be >= 1"),
  stock: z.number().min(0, "Stock must be >= 0"),
});

export const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  sizes: z.array(sizeSchema).min(1, "At least one size is required"),
});

// Base schema với các field chung
const baseProductSchema = {
  name: z.string().min(2, "Product name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Category is required."),
  brand: z.string().trim().optional(),
  price: z.number().min(0, "Price must be >= 0"),
  discount: z.number().min(0).max(100),
  image: z.any().optional(),
};

// Schema cho create mode (cần đầy đủ)
export const productCreateSchema = z.object({
  ...baseProductSchema,
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

// Schema cho edit info mode (chỉ cần basic info)
export const productInfoSchema = z.object({
  ...baseProductSchema,
  variants: z.array(variantSchema).optional(),
});

// Schema cho edit images mode (không cần validate gì, chỉ cần image field)
export const productImagesSchema = z.object({
  ...baseProductSchema,
  image: z.any().optional(),
  variants: z.array(variantSchema).optional(),
});

// Schema cho edit variants mode (cần variants)
export const productVariantsSchema = z.object({
  ...baseProductSchema,
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

// Export types - dùng union type từ các schema
export type ProductFormValues =
  | z.infer<typeof productCreateSchema>
  | z.infer<typeof productInfoSchema>
  | z.infer<typeof productImagesSchema>
  | z.infer<typeof productVariantsSchema>;
