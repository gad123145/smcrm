import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectInfoProps {
  project: Project;
  isRTL?: boolean;
}

export function ProjectInfo({ project, isRTL = false }: ProjectInfoProps) {
  const { t } = useTranslation();

  const infoItems = [
    { label: t("projects.form.location"), value: project.location },
    { label: t("projects.form.startDate"), value: project.start_date },
    { label: t("projects.form.status"), value: project.status },
    { label: t("projects.form.price"), value: project.price },
    { label: t("projects.form.operatingCompany"), value: project.operating_company },
    { label: t("projects.form.projectArea"), value: project.project_area },
    { label: t("projects.form.floorsCount"), value: project.floors_count },
    { label: t("projects.form.availableUnits"), value: project.available_units },
  ];

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold",
        isRTL ? "text-right" : "text-left"
      )}>
        {project.name}
      </h3>
      
      {project.description && (
        <p className={cn(
          "text-muted-foreground",
          isRTL ? "text-right" : "text-left"
        )}>
          {project.description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          item.value && (
            <div 
              key={index}
              className={cn(
                "space-y-1",
                isRTL ? "text-right" : "text-left"
              )}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.value}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}