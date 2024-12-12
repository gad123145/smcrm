import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ShareFields } from "./ShareFields";
import { ShareButtons } from "./ShareButtons";
import type { Project } from "@/types/project";

interface ProjectShareDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  isRTL?: boolean;
}

export function ProjectShareDialog({ project, isOpen, onClose, isRTL = false }: ProjectShareDialogProps) {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name",
    "description",
    "location",
    "price",
    "images"
  ]);

  const fields = [
    { id: "images", label: isRTL ? "صور المشروع" : "Project Images" },
    { id: "name", label: t("projects.form.name") },
    { id: "description", label: t("projects.form.description") },
    { id: "location", label: t("projects.form.location") },
    { id: "price", label: t("projects.form.price") },
    { id: "operating_company", label: t("projects.form.operatingCompany") },
    { id: "project_area", label: t("projects.form.projectArea") },
    { id: "floors_count", label: t("projects.form.floorsCount") },
    { id: "available_units", label: t("projects.form.availableUnits") },
  ];

  const generateShareText = () => {
    let text = "";
    selectedFields.forEach((field) => {
      if (field === 'images') {
        if (project.images && project.images.length > 0) {
          text += `${isRTL ? 'صور المشروع' : 'Project Images'}:\n`;
          project.images.forEach((img) => {
            text += `${img}\n`;
          });
          text += '\n';
        }
        return;
      }
      
      const value = project[field as keyof Project];
      const label = fields.find(f => f.id === field)?.label;
      if (value) {
        text += `${label}: ${value}\n`;
      }
    });
    return text;
  };

  const shareText = generateShareText();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md",
        isRTL ? "font-cairo" : ""
      )}>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : ""}>
            {t("projects.share.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ShareFields 
            fields={fields}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
          />

          <ShareButtons 
            shareUrl=""
            shareText={shareText}
            projectName={project.name}
            onExport={() => {
              // Export functionality
              const htmlContent = `
                <!DOCTYPE html>
                <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
                  <head>
                    <meta charset="UTF-8">
                    <title>${project.name}</title>
                    <style>
                      body { font-family: system-ui; padding: 2rem; }
                      img { max-width: 100%; height: auto; }
                    </style>
                  </head>
                  <body>
                    ${shareText.split('\n').map(line => `<p>${line}</p>`).join('')}
                    ${project.images ? project.images.map(img => `<img src="${img}" />`).join('') : ''}
                  </body>
                </html>
              `;
              
              const blob = new Blob([htmlContent], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${project.name}.html`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}