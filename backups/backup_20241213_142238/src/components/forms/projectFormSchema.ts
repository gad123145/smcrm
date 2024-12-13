import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  description: z.string().optional().nullable(),
  type: z.string().min(1, "نوع المشروع مطلوب"),
  manager: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
  budget: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  project_area: z.number().optional().nullable(),
  company_id: z.string().optional().nullable(),
  images: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  videos: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  files: z.array(z.union([z.instanceof(File), z.string()])).default([]),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;