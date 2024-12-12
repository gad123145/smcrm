import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { ProjectActions } from "./ProjectActions";

interface ProjectHeaderProps {
  project: Project;
  isRTL: boolean;
  onDelete: () => void;
  onUpdate: (data: any) => void;
}

export function ProjectHeader({ project, isRTL, onDelete, onUpdate }: ProjectHeaderProps) {
  return (
    <div className={cn(
      "flex items-center",
      isRTL ? "flex-row-reverse" : "",
      "justify-between"
    )}>
      <h1 className={cn(
        "text-3xl font-bold",
        isRTL ? "text-right" : ""
      )}>
        {project?.name}
      </h1>
      <ProjectActions 
        project={project}
        isRTL={isRTL}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
}