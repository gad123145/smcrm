import { z } from "zod";

export const propertySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  price: z.number().min(0, "Price must be positive"),
  area: z.number().min(0, "Area must be positive"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(1, "Owner phone is required"),
  status: z.enum(["available", "sold", "rented", "underContract"]).default("available"),
  hasBasement: z.boolean().default(false),
  otherDetails: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user_id: z.string().optional(),
});

export type Property = z.infer<typeof propertySchema>;