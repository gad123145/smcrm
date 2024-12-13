import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Eye, Edit, Trash2, Image as ImageIcon, Share2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProjectShareDialog } from "@/components/projects/details/ProjectShareDialog";
import { 
  getCompanyProjects, 
  addProjectToCompany, 
  updateCompanyProject, 
  deleteCompanyProject,
  Project 
} from "@/storage/CompanyStorage";

interface CompanyProjectsProps {
  companyId: string | undefined;
}

export function CompanyProjects({ companyId }: CompanyProjectsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedShareProject, setSelectedShareProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['company-projects', companyId],
    queryFn: async () => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      console.log('Fetching projects for company:', companyId);
      return getCompanyProjects(companyId);
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isRTL ? "جاري تحميل المشاريع..." : "Loading projects..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          {isRTL ? "حدث خطأ أثناء تحميل المشاريع" : "Error loading projects"}
        </p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isRTL ? "لا توجد مشاريع لهذه الشركة" : "No projects for this company"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate">{project.name}</h3>
                <Badge variant={getStatusVariant(project.status)}>
                  {t(`projects.status.${project.status}`)}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center text-sm text-muted-foreground">
                <span>{format(new Date(project.start_date), 'PP', { locale: isRTL ? ar : undefined })}</span>
              </div>

              {project.images && project.images.length > 0 && (
                <div className="relative h-32 mt-2">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                  {project.images.length > 1 && (
                    <Badge
                      variant="secondary"
                      className="absolute bottom-2 right-2"
                    >
                      +{project.images.length - 1}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedShareProject(project);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedProject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تعديل المشروع" : "Edit Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleUpdateProject(e, selectedProject.id)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    {isRTL ? "اسم المشروع" : "Project Name"}
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedProject.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">
                    {isRTL ? "وصف المشروع" : "Description"}
                  </Label>
                  <Textarea
                    id="description"
                    defaultValue={selectedProject.description}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">
                    {isRTL ? "حالة المشروع" : "Status"}
                  </Label>
                  <Select defaultValue={selectedProject.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        {t('projects.status.pending')}
                      </SelectItem>
                      <SelectItem value="in_progress">
                        {t('projects.status.in_progress')}
                      </SelectItem>
                      <SelectItem value="completed">
                        {t('projects.status.completed')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_date">
                    {isRTL ? "تاريخ البدء" : "Start Date"}
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    defaultValue={selectedProject.start_date}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">
                    {isRTL ? "السعر" : "Price"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    defaultValue={selectedProject.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="project_area">
                    {isRTL ? "مساحة المشروع" : "Project Area"}
                  </Label>
                  <Input
                    id="project_area"
                    type="number"
                    defaultValue={selectedProject.project_area}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="images">
                    {isRTL ? "صور المشروع" : "Project Images"}
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">
                  {isRTL ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {selectedShareProject && (
        <ProjectShareDialog
          project={selectedShareProject}
          open={!!selectedShareProject}
          onOpenChange={() => setSelectedShareProject(null)}
        />
      )}
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "success" {
  switch (status) {
    case "pending":
      return "default";
    case "in_progress":
      return "secondary";
    case "completed":
      return "success";
    default:
      return "default";
  }
}

export default CompanyProjects;