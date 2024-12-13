import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCompany } from "@/storage/CompanyStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface CompanyActionsProps {
  companyId: string;
  onEdit: () => void;
}

export function CompanyActions({ companyId, onEdit }: CompanyActionsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      // حذف الشركة وكل البيانات المرتبطة بها
      deleteCompany(companyId);
      
      // تحديث واجهة المستخدم
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['company-projects']);
      
      toast.success(isRTL ? 'تم حذف الشركة بنجاح' : 'Company deleted successfully');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف الشركة' : 'Error deleting company');
    }
  };

  return (
    <>
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'هل أنت متأكد من حذف هذه الشركة؟' : 'Are you sure you want to delete this company?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? 'سيتم حذف الشركة وجميع المشاريع المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.'
                : 'This will delete the company and all its associated projects. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
