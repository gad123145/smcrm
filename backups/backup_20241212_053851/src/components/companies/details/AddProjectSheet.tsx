import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface AddProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Project) => void;
  isRTL: boolean;
}

export function AddProjectSheet({ isOpen, onClose, onSubmit, isRTL }: AddProjectSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
            {isRTL ? "إضافة مشروع جديد" : "Add New Project"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProjectForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isCompanyProject={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}