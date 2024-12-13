import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Building2, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { AddCompanyDialog } from "@/components/companies/AddCompanyDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { getCompaniesList, deleteCompany } from "@/storage/CompanyStorage";
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

export default function Companies() {
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...');
      return getCompaniesList();
    },
  });

  const handleDeleteCompany = async () => {
    if (!selectedCompanyId) return;

    try {
      deleteCompany(selectedCompanyId);
      queryClient.invalidateQueries(['companies']);
      toast.success(isRTL ? 'تم حذف الشركة بنجاح' : 'Company deleted successfully');
      setShowDeleteDialog(false);
      setSelectedCompanyId(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف الشركة' : 'Error deleting company');
    }
  };

  const confirmDelete = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setShowDeleteDialog(true);
  };

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className="flex justify-between items-center mb-6">
          <h1 className={cn("text-3xl font-bold", isRTL && "font-cairo")}>
            {t("companies.title")}
          </h1>
          <AddCompanyDialog />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? "جاري تحميل الشركات..." : "Loading companies..."}
            </p>
          </div>
        ) : companies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? "لا توجد شركات" : "No companies found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <span className="truncate">{company.name}</span>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/companies/${company.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/companies/${company.id}/projects`)}
                      >
                        <Building2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {company.email && (
                      <p className="text-sm text-muted-foreground">
                        {company.email}
                      </p>
                    )}
                    {company.phone && (
                      <p className="text-sm text-muted-foreground">
                        {company.phone}
                      </p>
                    )}
                    {company.address && (
                      <p className="text-sm text-muted-foreground">
                        {company.address}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
              <AlertDialogAction onClick={handleDeleteCompany}>
                {isRTL ? 'حذف' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardContent>
    </DashboardLayout>
  );
}