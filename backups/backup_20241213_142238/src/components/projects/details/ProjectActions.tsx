import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MoreHorizontal, Pencil, Share2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { cn } from '@/lib/utils';
import { ProjectShareDialog } from './ProjectShareDialog';

interface ProjectActionsProps {
  project: any;
  onDelete: () => Promise<void>;
  onUpdate: (data: any) => Promise<void>;
  isRTL?: boolean;
}

export function ProjectActions({ project, onDelete, onUpdate, isRTL = false }: ProjectActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      // Show confirmation dialog
      if (!window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
        return;
      }

      console.log('Initiating project deletion from actions menu');
      await onDelete();
      console.log('Project deletion completed');
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
    } catch (error) {
      console.error('Error in project actions delete:', error);
      if (error instanceof Error) {
        const errorMessage = error.message || (isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
        console.error('Error details:', errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
      }
    }
  };

  return (
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
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            {t("projects.editProject")}
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
              defaultValues={project}
              onSubmit={onUpdate}
              isRTL={isRTL}
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
    </div>
  );
}