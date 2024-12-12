import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Share2, Trash } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ProjectShareDialog } from "@/components/projects/share/ProjectShareDialog";
import { toast } from "sonner";
import type { Project } from "@/types/project";

interface ProjectActionsProps {
  project: Project;
  onDelete: () => void;
  onUpdate: (data: any) => void;
  isRTL?: boolean;
}

export function ProjectActions({ project, onDelete, onUpdate, isRTL = false }: ProjectActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await onDelete();
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
    }
  };

  return (
    <>
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
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            {t("projects.editProject")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn("gap-2", isRTL && "flex-row-reverse")}
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            {t("projects.share.title")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn("gap-2 text-destructive", isRTL && "flex-row-reverse")}
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
            {isRTL ? "حذف" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent 
          side={isRTL ? "right" : "left"} 
          className={cn(
            "w-full sm:max-w-2xl overflow-y-auto",
            isRTL ? "font-cairo" : ""
          )}
        >
          <SheetHeader>
            <SheetTitle className={cn(
              isRTL ? "text-right font-cairo" : ""
            )}>
              {t("projects.editProject")}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PropertyForm
              onSubmit={onUpdate}
              onCancel={() => setIsEditOpen(false)}
              defaultValues={{
                title: project.name,
                description: project.description || "",
                location: project.location || "",
                operatingCompany: project.operating_company || "",
                area: project.project_area || "",
                price: project.price || "",
                images: project.images || [],
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ProjectShareDialog
        project={project}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}