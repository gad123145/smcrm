import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectShareDialog } from "./ProjectShareDialog";
import { useState } from "react";
import type { Project } from "@/types/project";

interface ProjectHeaderProps {
  project: Project;
  onDelete: () => Promise<void>;
  isRTL?: boolean;
}

export function ProjectHeader({ project, onDelete, isRTL = false }: ProjectHeaderProps) {
  const { t } = useTranslation();
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className={cn(
        "flex items-center justify-between mb-6",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <h1 className={cn(
          "text-3xl font-bold",
          isRTL && "font-cairo"
        )}>
          {project.name}
        </h1>
        <div className={cn(
          "flex items-center gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsShareOpen(true)}
            className={cn(
              "text-primary hover:text-primary",
              isRTL && "ml-2"
            )}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
            className={cn(
              "text-destructive-foreground",
              isRTL && "mr-2"
            )}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ProjectShareDialog
        project={project}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}