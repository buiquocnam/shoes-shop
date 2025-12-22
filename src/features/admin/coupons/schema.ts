import * as z from "zod";

export const couponSchema = z.object({
  code: z.string().min(1, "Mã giảm giá không được để trống"),
  discountPercent: z.number().min(1, "Giá trị giảm giá phải lớn hơn 0").max(100, "Giá trị giảm giá không được vượt quá 100%"),
  minOrder: z.number().min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0"),
  quantity: z.number().min(1, "Số lượng sử dụng phải lớn hơn 0").optional(),
  expirationDate: z.string().min(1, "Ngày hết hạn không được để trống"),
  active: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;

