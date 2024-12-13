import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Share2, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ProjectShareDialog } from "./details/ProjectShareDialog";

type ProjectCardProps = {
  project: Project;
  onEdit: (data: Project) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      isRTL ? "text-right" : "text-left"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-lg font-semibold",
          isRTL ? "font-cairo" : ""
        )}>
          {project.name}
        </CardTitle>
        <div className={cn(
          "flex items-center gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="outline"
            onClick={() => setIsShareOpen(true)}
            className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <Share2 className="h-4 w-4" />
            <span>{t("projects.share.title")}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem
                className={cn("gap-2", isRTL && "flex-row-reverse")}
                onClick={() => onEdit(project)}
              >
                <Pencil className="h-4 w-4" />
                {t("projects.editProject")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn("gap-2 text-destructive", isRTL && "flex-row-reverse")}
                onClick={onDelete}
              >
                <Trash className="h-4 w-4" />
                {isRTL ? "حذف" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("projects.form.location")}</p>
            <p className="text-sm">{project.location || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("projects.form.operatingCompany")}</p>
            <p className="text-sm">{project.operating_company || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("projects.form.price")}</p>
            <p className="text-sm">{project.price || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("projects.form.startDate")}</p>
            <p className="text-sm">{project.start_date || "-"}</p>
          </div>
          {project.project_area && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.projectArea")}</p>
              <p className="text-sm">{project.project_area}</p>
            </div>
          )}
          {project.available_units && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.availableUnits")}</p>
              <p className="text-sm">{project.available_units}</p>
            </div>
          )}
        </div>
      </CardContent>

      <ProjectShareDialog
        project={project}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </Card>
  );
}
