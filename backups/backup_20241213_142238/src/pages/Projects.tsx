import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Project } from "@/types/project";
import { ShareButton } from "@/components/projects/ShareButton";

const Projects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const { data: projects = [], isLoading, refetch } = useProjects();
  const { updateProject, deleteProject } = useProjectMutations();

  const handleProjectDelete = async (project: Project) => {
    try {
      if (!project.id) {
        toast.error(isRTL ? "معرف المشروع غير صالح" : "Invalid project ID");
        return;
      }

      // Show confirmation dialog
      if (!window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
        return;
      }

      console.log('Attempting to delete project:', project);
      await deleteProject.mutateAsync(project.id);
      console.log('Project deleted successfully');
      await refetch(); // Refresh the projects list after deletion
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
    } catch (error) {
      console.error('Error deleting project:', error);
      if (error instanceof Error) {
        const errorMessage = error.message || (isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
        console.error('Error message:', errorMessage);
        console.error('Error stack:', error.stack);
        toast.error(errorMessage);
      } else {
        toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
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
            "flex justify-between items-center mb-6",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <h1 className="text-2xl font-semibold">{t("projects.title")}</h1>
            <Button 
              className={cn("gap-2", isRTL ? "flex-row-reverse" : "")}
              onClick={() => navigate("/projects/add")}
            >
              <Plus className="w-4 h-4" />
              {t("projects.addProject")}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                  >
                    <div className={cn(
                      "flex items-center justify-between mb-4",
                      isRTL && "flex-row-reverse"
                    )}>
                      <h2 className="text-xl font-semibold">{project.name}</h2>
                      <ShareButton project={project} isRTL={isRTL} />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">{t("projects.form.location")}</p>
                        <p>{project.location || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("projects.form.price")}</p>
                        <p>{project.price || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("projects.form.operatingCompany")}</p>
                        <p>{project.operating_company || "-"}</p>
                      </div>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 mt-4",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {t("common.viewDetails")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Projects;