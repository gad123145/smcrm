import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  description: z.string().optional().nullable(),
  project_type: z.string().optional().nullable(),
  project_manager: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
  estimated_budget: z.string().optional().nullable(),
  actual_budget: z.string().optional().nullable(),
  completion_percentage: z.number().min(0).max(100).default(0),
  risks: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  milestones: z.array(z.any()).default([]),
  team_members: z.array(z.string()).default([]),
  images: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  videos: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  files: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  user_id: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;