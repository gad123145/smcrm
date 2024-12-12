import { z } from "zod";

export const actionFormSchema = z.object({
  nextAction: z.string().optional(),
  nextActionDate: z.date().optional(),
  nextActionTime: z.string().optional(),
  comment: z.string().optional(),
});

export type ActionFormData = z.infer<typeof actionFormSchema>;