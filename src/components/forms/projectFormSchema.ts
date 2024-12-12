import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, { message: "اسم المشروع مطلوب" }),
  description: z.string().optional(),
  project_type: z.string().optional(),
  project_manager: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().default('active'),
  priority: z.string().default('medium'),
  estimated_budget: z.string().optional(),
  actual_budget: z.string().optional(),
  completion_percentage: z.number().min(0).max(100).default(0),
  risks: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  milestones: z.array(z.any()).optional(),
  team_members: z.array(z.string()).optional(),
  engineeringConsultant: z.string().optional(),
  operatingCompany: z.string().optional(),
  projectSections: z.string().optional(),
  deliveryDate: z.string().optional(),
  pricePerMeter: z.string().optional(),
  availableUnits: z.string().optional(),
  unitPrice: z.string().optional(),
  minArea: z.string().optional(),
  rentalSystem: z.string().optional(),
  images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  videos: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  files: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  user_id: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;