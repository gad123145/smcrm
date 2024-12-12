import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "هذا الحقل مطلوب"),
  phone: z.string().min(1, "هذا الحقل مطلوب"),
  email: z.string().optional(),
  facebook: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  project: z.string().optional(),
  budget: z.string().optional(),
  campaign: z.string().optional(),
  status: z.string().optional(),
  next_action_date: z.date().optional(),
  next_action_type: z.string().optional(),
  sales_person: z.string().optional(),
  contact_method: z.string().optional(),
  user_id: z.string().optional(),
  
  // Property fields
  title: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  price: z.string().optional(),
  images: z.array(z.string()).optional(),
  video: z.string().optional(),
  projectType: z.string().optional(),
  companyName: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  constructionArea: z.string().optional(),
  projectStatus: z.string().optional(),
  salesPerson: z.string().optional(),
  contactMethod: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;