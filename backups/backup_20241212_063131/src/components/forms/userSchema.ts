import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "users.form.errors.nameRequired" }),
  email: z.string().email({ message: "users.form.errors.emailInvalid" }),
  password: z.string().min(6, { message: "users.form.errors.passwordLength" }),
  role: z.enum(["admin", "supervisor", "sales", "employee"]),
  avatar: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  lastLogin: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;