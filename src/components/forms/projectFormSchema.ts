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
  price: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  operating_company: z.string().optional().nullable(),
  project_area: z.string().optional().nullable(),
  project_division: z.string().optional().nullable(),
  available_units: z.string().optional().nullable(),
  floors_count: z.number().optional().nullable(),
  images: z.array(z.string()).default([]),
  video: z.string().optional().nullable(),
  developer_id: z.string().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;