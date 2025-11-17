import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

