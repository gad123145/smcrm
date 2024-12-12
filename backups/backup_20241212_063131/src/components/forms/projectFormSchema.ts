import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, { message: "اسم المشروع مطلوب" }),
  engineeringConsultant: z.string().optional(),
  operatingCompany: z.string().optional(),
  projectSections: z.string().optional(),
  deliveryDate: z.string().optional(),
  pricePerMeter: z.string().optional(),
  availableUnits: z.string().optional(),
  unitPrice: z.string().optional(),
  minArea: z.string().optional(),
  rentalSystem: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  videos: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  files: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  user_id: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;