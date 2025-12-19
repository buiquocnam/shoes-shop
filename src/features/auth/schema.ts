import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(4, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
  .object({
    ...loginSchema.shape,
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().optional(),
    newPass: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmNewPass: z.string().min(6, "Vui lòng xác nhận mật khẩu mới của bạn"),
  })
  .refine((data) => data.newPass === data.confirmNewPass, {
    message: "Mật khẩu mới không khớp",
    path: ["confirmNewPass"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
