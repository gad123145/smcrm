import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import type { Property } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export default function AddCompanyProject() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { addProject } = useProjectMutations();

  const handleSubmit = async (data: Property) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error(t("auth.errors.notAuthenticated"));
        navigate("/login");
        return;
      }

      // Upload images first if they exist
      let uploadedImages: string[] = [];
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('blob:')) {
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            
            const fileExt = 'jpg';
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('projects')
              .upload(filePath, file);

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('projects')
              .getPublicUrl(filePath);

            return publicUrl;
          } else {
            return image;
          }
        });

        uploadedImages = await Promise.all(uploadPromises);
      }

      // Create project with uploaded image URLs and company ID
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
        developer_id: id, // Link project to company
        floors_count: null,
        images: uploadedImages,
        progress: 0,
        start_date: data.deliveryDate || null,
        video: null,
      });
      
      toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
      navigate(`/companies/${id}`);
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة المشروع' : 'Error adding project');
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar open={sidebarOpen} />
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "m-0"
        )}>
          <div className={cn(
            "max-w-4xl mx-auto",
            isRTL ? "font-cairo" : ""
          )}>
            <h1 className="text-2xl font-semibold mb-6">
              {isRTL ? "إضافة مشروع جديد" : "Add New Project"}
            </h1>
            
            <PropertyForm
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/companies/${id}`)}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}