import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  status: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

