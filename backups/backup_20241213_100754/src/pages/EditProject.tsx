import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectById, updateProject } from "@/storage/projects";
import { toast } from "sonner";
import { AddProjectForm, ProjectFormData } from "@/components/projects/AddProjectForm";
import { useSidebar } from "@/components/ui/sidebar";

export default function EditProject() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const isRTL = i18n.language === 'ar';
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      if (projectData) {
        setProject(projectData);
      } else {
        toast.error(t("projects.errors.notFound"));
        navigate("/");
      }
    }
  }, [id, navigate, t]);

  const handleSubmit = (data: ProjectFormData) => {
    try {
      if (!id) return;

      const updatedProject = updateProject(id, {
        ...data,
        price: Number(data.price),
        project_area: Number(data.project_area)
      });

      if (updatedProject) {
        toast.success(t("projects.messages.updated"));
        navigate(`/companies/${updatedProject.company_id}/projects`);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(t("projects.errors.updateFailed"));
    }
  };

  if (!project) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardSidebar open={open} onOpenChange={setOpen} />
      <DashboardContent>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between py-4 px-6 border-b">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/companies/${project.company_id}/projects`)}
              >
                <ArrowLeft className={isRTL ? "rotate-180" : ""} />
              </Button>
              <h1 className="text-2xl font-semibold">
                {t("projects.editProject")}
              </h1>
            </div>
          </div>

          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <AddProjectForm
                  onSubmit={handleSubmit}
                  companyId={project.company_id}
                  initialData={{
                    name: project.name,
                    description: project.description,
                    price: project.price,
                    project_area: project.project_area,
                    status: project.status,
                    start_date: project.start_date,
                    images: project.images || []
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
