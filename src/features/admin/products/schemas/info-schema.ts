import { z } from "zod";

/**
 * Schema cho Update Product Info
 */
export const productInfoSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be greater than 0"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
});

export type InfoFormValues = z.infer<typeof productInfoSchema>;

/**
 * Input type cho Update Product Info API
 */
export interface ProductContentInput {
  productId: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  discount: number;
  slug: string;
}












