import { z } from "zod";
import { propertySchema } from "@/components/forms/propertySchema";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  area: number;
  location: string;
  city: string;
  features: string[];
  images: string[];
  ownerName: string;
  ownerPhone: string;
  status: "available" | "sold" | "rented" | "underContract";
  hasBasement?: boolean;
  otherDetails?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}