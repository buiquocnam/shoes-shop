import { z } from "zod";

/**
 * Schema cho Update Images
 */
export const productImagesSchema = z.object({
  imageNames: z.array(z.string()).min(1, "At least one image is required"),
  primaryName: z.string().min(1, "Primary image is required"),
});

export type ImagesFormValues = z.infer<typeof productImagesSchema>;












