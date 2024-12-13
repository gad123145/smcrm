import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useState, useEffect } from "react";
import { CompanyProjects } from "@/components/companies/details/CompanyProjects";
import { getCompanyById, initializeTestData, getCompanies } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const { createProject } = useProjectMutations();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Initialize test data and redirect if needed
  useEffect(() => {
    const companies = getCompanies();
    console.log('Current companies:', companies);
    
    if (companies.length === 0) {
      console.log('No companies found, initializing test data...');
      const companyId = initializeTestData();
      if (companyId && (!id || id === 'undefined')) {
        console.log('Redirecting to company:', companyId);
        navigate(`/companies/${companyId}`);
      }
    } else if (!id || id === 'undefined') {
      console.log('No ID provided, redirecting to first company:', companies[0].id);
      navigate(`/companies/${companies[0].id}`);
    }
  }, [id, navigate]);

  // Set sidebar open by default on desktop
  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id || id === 'undefined') {
        throw new Error('Company ID is required');
      }

      console.log('Fetching company with ID:', id);
      const company = getCompanyById(id);
      console.log('Found company:', company);
      
      if (!company) {
        // If company not found, try to get first available company
        const companies = getCompanies();
        if (companies.length > 0) {
          navigate(`/companies/${companies[0].id}`);
          return companies[0];
        }
        throw new Error('Company not found');
      }

      return company;
    },
    retry: false,
  });

  if (error) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent className={cn("pb-8", open && "lg:pl-64")}>
          <Card className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                {t('error.company_not_found')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('error.company_not_found_description')}
              </p>
              <Button onClick={() => navigate('/companies')}>
                {t('actions.back_to_companies')}
              </Button>
            </div>
          </Card>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent className={cn("pb-8", open && "lg:pl-64")}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  const handleAddProject = async (data: ProjectFormData) => {
    if (!id || id === 'undefined') return;

    try {
      await createProject.mutateAsync({
        ...data,
        company_id: id,
      });
      
      queryClient.invalidateQueries({ queryKey: ['company-projects', id] });
      setIsSheetOpen(false);
      toast.success(isRTL ? "تم إضافة المشروع بنجاح" : "Project added successfully");
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إضافة المشروع" : "Error adding project");
    }
  };

  return (
    <DashboardLayout>
      <DashboardSidebar open={open} />
      <DashboardContent className={cn("pb-8", open && "lg:pl-64")}>
        <div className="space-y-8">
          {/* Company Details Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{company?.name}</h1>
                  <p className="text-gray-600">{company?.description}</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="gap-2">
                      <Plus size={16} />
                      {t('projects.addProject')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t('projects.addProject')}</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <ProjectForm 
                        onSubmit={handleAddProject} 
                        onCancel={() => setIsSheetOpen(false)}
                        isCompanyProject={true}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <Separator className="my-6" />
              
              {/* Company Projects */}
              <CompanyProjects companyId={company?.id} />
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
