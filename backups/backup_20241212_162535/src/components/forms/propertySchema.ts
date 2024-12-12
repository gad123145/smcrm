import { z } from "zod";

export const propertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { 
    message: "يجب أن يكون اسم المشروع أكثر من حرفين" 
  }),
  ownerName: z.string().min(2, {
    message: "يجب إدخال اسم المالك"
  }),
  engineeringConsultant: z.string().min(2, {
    message: "يجب إدخال اسم الاستشاري الهندسي"
  }),
  operatingCompany: z.string().min(2, {
    message: "يجب إدخال اسم شركة الإدارة والتشغيل"
  }),
  description: z.string().min(10, {
    message: "يجب أن يكون الوصف أكثر من 10 أحرف"
  }),
  projectSections: z.string().optional(),
  deliveryDate: z.string().optional(),
  availableUnits: z.string().optional(),
  pricePerMeterFrom: z.string().optional(),
  pricePerMeterTo: z.string().optional(),
  unitPriceFrom: z.string().optional(),
  unitPriceTo: z.string().optional(),
  minArea: z.string().optional(),
  rentalSystem: z.string().optional(),
  images: z.array(z.string()).optional(),
  files: z.array(z.instanceof(File)).optional(),
  types: z.array(z.string()).default([]),
  type: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  area: z.string().optional(),
  price: z.string().optional(),
  ownerPhone: z.string().optional(),
  developerId: z.string().optional(),
});

export type Property = z.infer<typeof propertySchema>;