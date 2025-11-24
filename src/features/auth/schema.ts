import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(4, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  ...loginSchema.shape,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


