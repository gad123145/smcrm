import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { PropertyForm } from "@/components/forms/PropertyForm";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import type { Property } from "@/types/property";

export default function CompanyDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const { addProject } = useProjectMutations();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (data: Property) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error(t("auth.errors.notAuthenticated"));
        return;
      }

      let uploadedImages: string[] = [];
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('blob:')) {
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            
            const fileExt = 'jpg';
            const fileName = `${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('projects')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              return null;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('projects')
              .getPublicUrl(fileName);
            return publicUrl;
          } else {
            return image;
          }
        });

        uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      }

      await addProject.mutateAsync({
        name: data.title,
        description: data.description || null,
        price: `${data.pricePerMeterFrom || ''} - ${data.pricePerMeterTo || ''}`,
        location: data.location || null,
        operating_company: data.operatingCompany || null,
        project_area: data.area || null,
        project_division: data.projectSections || null,
        available_units: data.availableUnits || null,
        status: "planned",
        user_id: session.user.id,
        developer_id: id,
        floors_count: null,
        images: uploadedImages,
        progress: 0,
        start_date: data.deliveryDate || null,
        video: null,
      });
      
      toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة المشروع' : 'Error adding project');
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
          "max-w-4xl mx-auto px-4 pt-6",
          isRTL ? "font-cairo" : ""
        )}>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h1>
              <Sheet>
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
                    <PropertyForm
                      onSubmit={handleSubmit}
                      onCancel={() => {
                        const sheet = document.querySelector('[data-state="open"]');
                        if (sheet) {
                          const closeButton = sheet.querySelector('button[aria-label="Close"]');
                          if (closeButton) {
                            (closeButton as HTMLButtonElement).click();
                          }
                        }
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {company.description && (
              <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
                {company.description}
              </p>
            )}
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}