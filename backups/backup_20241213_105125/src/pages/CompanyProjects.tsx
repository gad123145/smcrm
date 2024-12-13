import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getCompanyById, addProjectToCompany, getCompanyProjects } from "@/storage/CompanyStorage";
import { cn, generateId } from "@/lib/utils";
import { ArrowLeft, Plus, Building2, Eye, Edit, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AddProjectForm } from "@/components/projects/AddProjectForm";
import { ProjectFormData } from "@/components/projects/AddProjectForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function CompanyProjects() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const companyData = getCompanyById(id);
      if (companyData) {
        // Get company projects from projects storage
        const projects = getCompanyProjects(id);
        setCompany({
          ...companyData,
          projects: projects
        });
      }
    }
  }, [id]);

  const handleAddProject = async (projectData: ProjectFormData) => {
    try {
      if (!company?.id) return;
      
      const newProject = addProjectToCompany(company.id, projectData);
      if (!newProject) {
        throw new Error("Failed to add project");
      }

      // Update local state with new project
      setCompany(prev => ({
        ...prev!,
        projects: [...(prev?.projects || []), newProject]
      }));
      
      setIsAddProjectOpen(false);
      toast.success(isRTL ? "تم إضافة المشروع بنجاح" : "Project added successfully");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error(isRTL ? "حدث خطأ أثناء إضافة المشروع" : "Error adding project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const updatedCompany = {
        ...company,
        projects: company.projects.filter((project: any) => project.id !== projectId),
      };
      setCompany(updatedCompany);
      // updateCompany(updatedCompany); // Save to local storage
      
      toast.success(isRTL ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المشروع" : "Error deleting project");
    }
  };

  if (!company) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </p>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => navigate("/companies")}
            >
              <ArrowLeft className="h-4 w-4" />
              {isRTL ? "العودة إلى الشركات" : "Back to Companies"}
            </Button>

            <Sheet open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {isRTL ? "إضافة مشروع" : "Add Project"}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isRTL ? "right" : "left"}
                className={cn("w-full sm:max-w-2xl", isRTL && "font-cairo")}
              >
                <SheetHeader>
                  <SheetTitle>
                    {isRTL ? "إضافة مشروع جديد" : "Add New Project"}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AddProjectForm onSubmit={handleAddProject} companyId={id} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Card className="mb-6">
            <CardContent className="py-6">
              <h1 className={cn(
                "text-3xl font-bold text-center mb-2",
                isRTL && "font-cairo"
              )}>
                {company.name}
              </h1>
              {company.description && (
                <p className={cn(
                  "text-muted-foreground text-center",
                  isRTL && "font-cairo"
                )}>
                  {company.description}
                </p>
              )}
            </CardContent>
          </Card>

          {company.projects?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? "لا توجد مشاريع" : "No projects found"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.projects?.map((project: any) => (
                <Card key={project.id}>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>{project.name}</CardTitle>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t("projects.view")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>{t("projects.edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{t("projects.delete")}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.images && project.images.length > 0 && (
                      <div className="mb-4">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={project.images[0]}
                            alt={t("projects.images.imageAlt")}
                            className="rounded-lg object-cover w-full h-full"
                            onError={(e) => {
                              console.error('Error loading image:', e);
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PC9zdmc+';
                            }}
                          />
                        </AspectRatio>
                      </div>
                    )}
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.price && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.price")}: </span>
                          {new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US', {
                            style: 'currency',
                            currency: 'EGP'
                          }).format(project.price)}
                        </div>
                      )}
                      {project.project_area && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.area")}: </span>
                          {project.project_area} m²
                        </div>
                      )}
                      {project.consultant && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.consultant")}: </span>
                          {project.consultant}
                        </div>
                      )}
                      {project.operatingCompany && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.operatingCompany")}: </span>
                          {project.operatingCompany}
                        </div>
                      )}
                      {project.projectDivision && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.projectDivision")}: </span>
                          {project.projectDivision}
                        </div>
                      )}
                      {project.location && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.location")}: </span>
                          {project.location}
                        </div>
                      )}
                      {project.deliveryDate && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.deliveryDate")}: </span>
                          {project.deliveryDate}
                        </div>
                      )}
                      {project.pricePerMeter && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.pricePerMeter")}: </span>
                          {project.pricePerMeter}
                        </div>
                      )}
                      {project.availableUnits && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.availableUnits")}: </span>
                          {project.availableUnits}
                        </div>
                      )}
                      {project.unitPrice && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.unitPrice")}: </span>
                          {project.unitPrice}
                        </div>
                      )}
                      {project.areaStart && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.areaStart")}: </span>
                          {project.areaStart}
                        </div>
                      )}
                      {project.rentalSystem && (
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.rentalSystem")}: </span>
                          {project.rentalSystem}
                        </div>
                      )}
                    </div>
                    {project.details && (
                      <div className="mt-4">
                        <div className="text-sm">
                          <span className="font-medium">{t("projects.fields.details")}: </span>
                          {project.details}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
