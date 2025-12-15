import { z } from "zod";

/**
 * Schema cho Create Product
 * Step 1: Product Info
 */
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be greater than 0"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  slug: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  primaryName: z.string().optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;












