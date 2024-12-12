import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectImages } from "./details/ProjectImages";
import { ProjectInfo } from "./details/ProjectInfo";
import { ProjectShareDialog } from "./share/ProjectShareDialog";
import { ProjectAIAnalysis } from "../ai/ProjectAIAnalysis";
import type { Project } from "@/types/project";
import { useState } from "react";

interface ProjectViewDialogProps {
  project: Project;
}

export function ProjectViewDialog({ project }: ProjectViewDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh]",
        isRTL ? "font-cairo" : ""
      )}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className={cn(
            "text-2xl font-semibold",
            isRTL ? "text-right" : ""
          )}>
            {project.name}
          </DialogTitle>
          <ProjectShareDialog 
            project={project} 
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            isRTL={isRTL}
          />
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <div className="space-y-6 p-4">
            <ProjectImages images={project.images} isRTL={isRTL} />
            <ProjectInfo project={project} isRTL={isRTL} />
            <ProjectAIAnalysis project={project} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}