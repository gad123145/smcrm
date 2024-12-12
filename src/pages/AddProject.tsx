import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import type { ProjectFormData } from "@/components/forms/projectFormSchema";
import { supabase } from "@/integrations/supabase/client";

const AddProject = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { addProject } = useProjectMutations();

  const handleSubmit = async (data: ProjectFormData) => {
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

      // Create project with uploaded image URLs
      await addProject.mutateAsync({
        name: data.name,
        description: data.description || null,
        project_type: data.project_type || null,
        project_manager: data.project_manager || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        status: data.status || "active",
        priority: data.priority || "medium",
        estimated_budget: data.estimated_budget || null,
        actual_budget: data.actual_budget || null,
        completion_percentage: data.completion_percentage || 0,
        user_id: session.user.id,
        images: uploadedImages,
      });
      
      toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
      navigate("/projects");
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
              {t("projects.addProject")}
            </h1>
            
            <ProjectForm
              onSubmit={handleSubmit}
              onCancel={() => navigate("/projects")}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AddProject;