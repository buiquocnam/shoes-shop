import * as z from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters."),
  logo: z.instanceof(File).optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

