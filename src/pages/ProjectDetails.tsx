import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { ProjectImages } from "@/components/projects/details/ProjectImages";
import { ProjectInfo } from "@/components/projects/details/ProjectInfo";
import { ProjectHeader } from "@/components/projects/details/ProjectHeader";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { updateProject } = useProjectMutations();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          developer:developer_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        toast.error(isRTL ? "حدث خطأ أثناء جلب بيانات المشروع" : "Error fetching project data");
        throw error;
      }
      return data as Project;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  const handleDeleteProject = async () => {
    if (!project?.id) {
      toast.error(isRTL ? "معرف المشروع غير صالح" : "Invalid project ID");
      return;
    }

    // Show confirmation dialog with more details
    if (!window.confirm(
      isRTL 
        ? "هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع البيانات المرتبطة به بما في ذلك المهام والتعليقات والإشعارات."
        : "Are you sure you want to delete this project? This will delete all associated data including tasks, comments, and notifications."
    )) {
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('delete_project_cascade', { project_id_param: project.id });

      if (error) throw error;

      if (data.success) {
        // Show success message with deletion details
        const deletedCounts = data.deleted_counts;
        const deletionDetails = isRTL
          ? `تم حذف المشروع وكل البيانات المرتبطة به (${Object.entries(deletedCounts)
              .map(([key, count]) => `${key}: ${count}`)
              .join(', ')})`
          : `Project and all associated data deleted (${Object.entries(deletedCounts)
              .map(([key, count]) => `${key}: ${count}`)
              .join(', ')})`;
        
        toast.success(deletionDetails);
        navigate("/projects");
      } else {
        console.error('Failed to delete project:', data.error);
        toast.error(isRTL 
          ? `فشل في حذف المشروع: ${data.error}`
          : `Failed to delete project: ${data.error}`
        );
      }
    } catch (error) {
      console.error('Error in handleDeleteProject:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(isRTL 
        ? `حدث خطأ أثناء حذف المشروع: ${errorMessage}`
        : `Error deleting project: ${errorMessage}`
      );
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (!project?.id) return;

      // Upload images first if they exist
      let uploadedImages: string[] = [];
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(async (image: File | string) => {
          if (image instanceof File) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('projects')
              .upload(filePath, image);

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

      const updatedProject: Project = {
        id: project.id,
        name: data.title,
        description: data.description || null,
        price: `${data.pricePerMeterFrom || ''} - ${data.pricePerMeterTo || ''}`,
        location: data.location || null,
        operating_company: data.operatingCompany || null,
        project_area: data.area || null,
        project_division: data.projectSections || null,
        available_units: data.availableUnits || null,
        status: project.status,
        images: uploadedImages.length > 0 ? uploadedImages : project.images,
        start_date: data.deliveryDate || null,
        floors_count: project.floors_count,
        progress: project.progress,
        video: project.video,
        developer_id: project.developer_id,
        user_id: project.user_id,
        created_at: project.created_at,
        updated_at: new Date().toISOString(),
      };

      await updateProject.mutateAsync(updatedProject);
      toast.success(isRTL ? "تم تحديث المشروع بنجاح" : "Project updated successfully");
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث المشروع" : "Error updating project");
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
          <div className="bg-white dark:bg-gray-800 min-h-full p-8 space-y-8">
            <div className="flex justify-between items-center">
              <ProjectHeader 
                project={project}
                isRTL={isRTL}
                onDelete={handleDeleteProject}
                onUpdate={handleSubmit}
              />
            </div>

            {/* Images Carousel */}
            {project && <ProjectImages images={project.images} isRTL={isRTL} />}

            {/* Project Info */}
            {project && <ProjectInfo project={project} isRTL={isRTL} />}
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}