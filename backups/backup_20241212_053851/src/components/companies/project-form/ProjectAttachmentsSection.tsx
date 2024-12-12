import { useTranslation } from "react-i18next";
import { ProjectFileUpload } from "@/components/forms/fields/upload/ProjectFileUpload";
import { cn } from "@/lib/utils";

interface ProjectAttachmentsSectionProps {
  onUploadComplete: (urls: { images: string[], videos: string[], files: string[] }) => void;
  isRTL: boolean;
}

export function ProjectAttachmentsSection({ onUploadComplete, isRTL }: ProjectAttachmentsSectionProps) {
  const { i18n } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "font-medium",
        isRTL ? "text-right" : ""
      )}>
        {i18n.language === 'ar' ? 'المرفقات' : 'Attachments'}
      </h3>
      <ProjectFileUpload
        onUploadComplete={onUploadComplete}
        isRTL={isRTL}
      />
    </div>
  );
}