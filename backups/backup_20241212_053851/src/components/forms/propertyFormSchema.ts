import * as z from "zod";

export const propertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "يجب أن يكون اسم العقار أكثر من حرفين"
  }),
  type: z.string().optional(),
  area: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  ownerPhone: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;