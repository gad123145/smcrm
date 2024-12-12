import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { projectFormSchema } from "./projectFormSchema";
import { cn } from "@/lib/utils";
import { BasicFields } from "./fields/project/BasicFields";
import { ProjectFileUpload } from "./fields/upload/ProjectFileUpload";
import type { ProjectFormData } from "./projectFormSchema";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ProjectFormData>;
  isCompanyProject?: boolean;
}

export function ProjectForm({ onSubmit, onCancel, defaultValues, isCompanyProject = false }: ProjectFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues || {},
    mode: "onChange",
  });

  const handleFileUploadComplete = (urls: { images: string[], videos: string[], files: string[] }) => {
    if (urls.images.length > 0) {
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...urls.images]);
    }
    if (urls.files.length > 0) {
      const currentFiles = form.getValues('files') || [];
      form.setValue('files', [...currentFiles, ...urls.files]);
    }
    if (urls.videos.length > 0) {
      const currentVideos = form.getValues('videos') || [];
      form.setValue('videos', [...currentVideos, ...urls.videos]);
    }
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className={cn("space-y-6", isRTL && "text-right")}>
          <BasicFields form={form} isCompanyProject={isCompanyProject} />
          <ProjectFileUpload 
            onUploadComplete={handleFileUploadComplete}
            isRTL={isRTL}
          />
        </div>
        
        <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
          <Button type="submit" className="flex-1">
            {isRTL ? "حفظ" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}