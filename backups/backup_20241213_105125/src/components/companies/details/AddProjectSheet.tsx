import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { useQueryClient } from "@tanstack/react-query";
import { addProjectToCompany } from "@/storage/CompanyStorage";
import { toast } from "sonner";

interface AddProjectSheetProps {
  companyId: string;
}

export function AddProjectSheet({ companyId }: AddProjectSheetProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      const result = await addProjectToCompany(companyId, {
        name: data.name,
        description: data.description,
        status: data.status,
        start_date: data.start_date,
        price: data.price,
        project_area: data.project_area,
        images: data.images || [],
      });

      if (result) {
        queryClient.invalidateQueries(['company-projects', companyId]);
        toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
      } else {
        toast.error(isRTL ? 'حدث خطأ أثناء إضافة المشروع' : 'Error adding project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة المشروع' : 'Error adding project');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isRTL ? 'إضافة مشروع' : 'Add Project'}
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {isRTL ? 'إضافة مشروع جديد' : 'Add New Project'}
          </SheetTitle>
        </SheetHeader>
        <ProjectForm onSubmit={handleSubmit} />
      </SheetContent>
    </Sheet>
  );
}