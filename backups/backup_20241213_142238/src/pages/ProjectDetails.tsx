import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getProjectById, updateProject, deleteProject } from "@/lib/projects";
import { ProjectImages } from "@/components/projects/details/ProjectImages";
import { ProjectInfo } from "@/components/projects/details/ProjectInfo";
import { ProjectHeader } from "@/components/projects/details/ProjectHeader";
import type { Project } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Share2 } from "lucide-react";
import { ProjectShareDialog } from "@/components/projects/details/ProjectShareDialog";
import { ShareButton } from "@/components/projects/ShareButton";

export default function ProjectDetails() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load project data
  useEffect(() => {
    const loadProject = () => {
      if (!id) return;
      
      try {
        const projectData = getProjectById(id);
        console.log('Loaded project data:', projectData);
        if (projectData) {
          // Ensure images array exists
          projectData.images = projectData.images || [];
          setProject(projectData);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات المشروع" : "Error loading project data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id, isRTL]);

  const handleSubmit = async (data: any) => {
    try {
      if (!project?.id) return;

      // Process images if they exist
      let processedImages = project.images || [];
      if (data.images && data.images.length > 0) {
        processedImages = [...processedImages, ...data.images];
      }

      const result = await updateProject(project.id, {
        name: data.title,
        description: data.description || null,
        price: `${data.pricePerMeterFrom || ''} - ${data.pricePerMeterTo || ''}`,
        location: data.location || null,
        operating_company: data.operatingCompany || null,
        project_area: data.area || null,
        project_division: data.projectSections || null,
        available_units: data.availableUnits || null,
        start_date: data.deliveryDate || null,
        images: processedImages,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setProject(result.data);
      toast.success(isRTL ? "تم تحديث المشروع بنجاح" : "Project updated successfully");
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث المشروع" : "Error updating project");
    }
  };

  const handleDeleteProject = async () => {
    if (!project?.id) {
      toast.error(isRTL ? "معرف المشروع غير صالح" : "Invalid project ID");
      return;
    }

    // Show confirmation dialog with more details
    if (!window.confirm(
      isRTL 
        ? "هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع البيانات المرتبطة به."
        : "Are you sure you want to delete this project? This will delete all associated data."
    )) {
      return;
    }

    try {
      const result = await deleteProject(project.id);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent className="flex-1">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent className="flex-1">
          <div className="text-center py-8">
            {isRTL ? "المشروع غير موجود" : "Project not found"}
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent className="flex-1">
        <div className={cn(
          "h-full w-full",
          isRTL ? "font-cairo" : ""
        )}>
          <ProjectHeader project={project} isRTL={isRTL} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ProjectInfo project={project} onSubmit={handleSubmit} isRTL={isRTL} />
            <ProjectImages images={project.images} isRTL={isRTL} />
          </div>

          <div className={cn(
            "flex items-center gap-4 mt-6",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              variant="destructive"
              className={cn("gap-2", isRTL && "flex-row-reverse")}
              onClick={handleDeleteProject}
            >
              <Trash2 className="w-4 h-4" />
              {isRTL ? "حذف المشروع" : "Delete Project"}
            </Button>
            <ShareButton project={project} isRTL={isRTL} />
          </div>
        </div>
      </DashboardContent>
      <ProjectShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        project={project}
        isRTL={isRTL}
      />
    </DashboardLayout>
  );
}