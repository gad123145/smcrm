import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProjectMutations } from "@/hooks/useProjectMutations";

interface CompanyProjectsProps {
  companyId: string;
  isRTL: boolean;
}

export function CompanyProjects({ companyId, isRTL }: CompanyProjectsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { deleteProject } = useProjectMutations();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['company-projects', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('developer_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const handleDelete = async (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking delete
    
    if (!projectId) {
      toast.error(isRTL ? "معرف المشروع غير صالح" : "Invalid project ID");
      return;
    }

    try {
      await deleteProject.mutateAsync(projectId);
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['company-projects', companyId] });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className={cn(
        "mt-8 text-center text-muted-foreground",
        isRTL ? "font-cairo" : ""
      )}>
        {isRTL ? "لا توجد مشاريع حالياً" : "No projects yet"}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className={cn(
        "text-2xl font-semibold",
        isRTL ? "text-right font-cairo" : ""
      )}>
        {isRTL ? "المشاريع" : "Projects"}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg group",
              isRTL ? "text-right" : ""
            )}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <CardHeader className="relative">
              <CardTitle className={cn(
                "text-lg line-clamp-2",
                isRTL ? "font-cairo" : ""
              )}>
                {project.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={(e) => handleDelete(project.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}