import * as z from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  link: z.string().min(1, "Link không được để trống"),
  slot: z.string().min(1, "Slot không được để trống"),
  image: z.instanceof(File).optional(),
  active: z.boolean().optional(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;

