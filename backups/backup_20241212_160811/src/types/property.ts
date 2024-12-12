import { z } from "zod";
import { propertySchema } from "@/components/forms/propertySchema";

export type Property = z.infer<typeof propertySchema>;