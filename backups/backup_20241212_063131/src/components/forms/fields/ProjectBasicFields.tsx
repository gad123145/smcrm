import { UseFormReturn } from "react-hook-form";
import type { ProjectFormData } from "../projectFormSchema";
import { BasicProjectFields } from "./project/BasicProjectFields";

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isCompanyProject?: boolean;
}

export function ProjectBasicFields({ form, isCompanyProject = false }: ProjectBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <BasicProjectFields form={form} />
    </div>
  );
}