import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProjectForm } from "@/components/forms/ProjectForm";
import type { ProjectFormData } from "@/components/forms/projectFormSchema";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { useState } from "react";
import { CompanyProjects } from "@/components/companies/details/CompanyProjects";

export default function CompanyDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const { addProject } = useProjectMutations();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) {
        console.error('Company ID is missing');
        throw new Error('Company ID is required');
      }

      console.log('Fetching company with ID:', id);

      // التحقق من وجود جدول الشركات
      const { data: tablesData, error: tablesError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);

      if (tablesError) {
        console.error('Error checking companies table:', tablesError);
        throw new Error('Could not access companies table: ' + tablesError.message);
      }

      // أولاً، جلب بيانات الشركة
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, description, logo, created_at')
        .eq('id', id)
        .single();
      
      if (companyError) {
        console.error('Error fetching company:', companyError);
        throw new Error('Error fetching company: ' + companyError.message);
      }

      console.log('Company data:', companyData);

      if (!companyData) {
        console.error('Company not found with ID:', id);
        throw new Error('Company not found');
      }

      try {
        // ثانياً، جلب المشاريع المرتبطة بالشركة
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            description,
            price,
            location,
            operating_company,
            project_area,
            project_division,
            available_units,
            status,
            images,
            progress,
            start_date,
            company_id
          `)
          .eq('company_id', id);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw new Error('Error fetching projects: ' + projectsError.message);
        }

        console.log('Projects data:', projectsData);

        return {
          ...companyData,
          projects: projectsData || []
        };
      } catch (projectError) {
        console.error('Error in projects query:', projectError);
        // إذا فشل جلب المشاريع، نعيد بيانات الشركة فقط
        return {
          ...companyData,
          projects: []
        };
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error(t("auth.errors.notAuthenticated"));
        return;
      }

      let uploadedImages: string[] = [];
      if (data.images && data.images.length > 0) {
        uploadedImages = data.images;
      }

      console.log('Adding project with data:', {
        ...data,
        developer_id: id,
        user_id: session.user.id,
      });

      const result = await addProject.mutateAsync({
        name: data.name,
        description: data.description || null,
        price: data.pricePerMeter || null,
        location: data.location || null,
        operating_company: data.operatingCompany || null,
        project_area: data.minArea || null,
        project_division: data.projectSections || null,
        available_units: data.availableUnits || null,
        status: "planned",
        user_id: session.user.id,
        developer_id: id,
        company_id: null,
        floors_count: null,
        images: uploadedImages,
        progress: 0,
        start_date: data.deliveryDate || null,
        video: null,
      });

      console.log('Project added successfully:', result);
      
      // تحديث البيانات بعد إضافة المشروع
      await queryClient.invalidateQueries({ queryKey: ['company', id] });
      await queryClient.invalidateQueries({ queryKey: ['company-projects', id] });
      
      // إظهار رسالة النجاح
      toast.success(isRTL ? 'تم حفظ المشروع بنجاح' : 'Project saved successfully');
      
      // إغلاق النافذة المنبثقة
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(isRTL ? `حدث خطأ أثناء إضافة المشروع: ${errorMessage}` : `Error adding project: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Database connection error';
    console.error('Error in CompanyDetails:', error);
    
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-red-500 mb-4">
                {isRTL ? 'حدث خطأ أثناء تحميل بيانات الشركة' : 'Error loading company data'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {isRTL ? 'تفاصيل الخطأ:' : 'Error details:'} {errorMessage}
              </p>
              <p className="text-sm text-gray-500">
                {isRTL ? 'الرجاء التأكد من اتصال قاعدة البيانات والمحاولة مرة أخرى' : 'Please check database connection and try again'}
              </p>
            </div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="text-center py-8">
            {t("companies.notFound")}
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className={cn(
          "max-w-7xl mx-auto px-4 py-8",
          isRTL ? "font-cairo" : ""
        )}>
          {/* بيانات الشركة */}
          <div className="bg-white dark:bg-gray-800 min-h-full p-8 space-y-8">
            <div className={cn(
              "flex items-center justify-between",
              isRTL ? "flex-row-reverse" : ""
            )}>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h1>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button 
                    className={cn(
                      "gap-2",
                      isRTL ? "flex-row-reverse" : ""
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إضافة مشروع" : "Add Project"}
                  </Button>
                </SheetTrigger>
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
                      onSubmit={handleSubmit}
                      onCancel={() => setIsSheetOpen(false)}
                      isCompanyProject={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Company Description */}
            {company.description && (
              <p className={cn(
                "text-gray-600 dark:text-gray-300 mt-4",
                isRTL ? "text-right font-cairo" : ""
              )}>
                {company.description}
              </p>
            )}

            {/* Company Projects */}
            <CompanyProjects companyId={id} isRTL={isRTL} />
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
