import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ProjectFormData } from "../projectFormSchema";
import { cn } from "@/lib/utils";
import { BasicFields } from "./project/BasicFields";
import { PriceFields } from "./project/PriceFields";

interface ProjectDetailsFieldsProps {
  form: UseFormReturn<ProjectFormData>;
}

export function ProjectDetailsFields({ form }: ProjectDetailsFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn("space-y-6", isRTL && "text-right")}>
      <BasicFields form={form} />
      <PriceFields form={form} />
    </div>
  );
}