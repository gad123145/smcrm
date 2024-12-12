import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Project } from "@/types/project";

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

      await deleteProject.mutateAsync(project.id);
      await refetch(); // Refresh the projects list after deletion
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
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
                  <PropertyCard
                    key={project.id}
                    property={{
                      id: project.id,
                      title: project.name,
                      description: project.description || "",
                      types: ["residential"],
                      pricePerMeterFrom: project.price?.split(" - ")[0] || "",
                      pricePerMeterTo: project.price?.split(" - ")[1] || "",
                      operatingCompany: project.operating_company || "",
                      location: project.location || "",
                      deliveryDate: project.start_date || "",
                      files: [],
                      address: project.location || "",
                    }}
                    onEdit={async (data) => {
                      const updatedProject: Project = {
                        ...project,
                        name: data.title,
                        description: data.description,
                        price: `${data.pricePerMeterFrom} - ${data.pricePerMeterTo}`,
                        location: data.location || "",
                        operating_company: data.operatingCompany,
                      };
                      await updateProject.mutateAsync(updatedProject);
                    }}
                    onDelete={async () => {
                      await handleProjectDelete(project);
                    }}
                  />
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