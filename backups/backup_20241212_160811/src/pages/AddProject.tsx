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

const AddProject = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { createProject } = useProjectMutations();

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync({
        ...data,
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(isRTL ? 'حدث خطأ أثناء إنشاء المشروع' : 'Error creating project');
      }
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