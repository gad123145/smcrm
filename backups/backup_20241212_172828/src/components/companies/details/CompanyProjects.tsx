import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects, updateProject, deleteProject } from "@/lib/storage";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Image as ImageIcon } from "lucide-react";
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

interface CompanyProjectsProps {
  companyId: string | undefined;
}

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  manager: string;
  start_date: string;
  price: number;
  project_area: number;
  images?: string[];
}

export function CompanyProjects({ companyId }: CompanyProjectsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['company-projects', companyId],
    queryFn: () => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      const allProjects = getProjects();
      return allProjects.filter(project => project.company_id === companyId);
    },
  });

  const handleViewProject = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsViewDialogOpen(true);
    } else {
      toast.error(isRTL ? 'المشروع غير موجود' : 'Project not found');
    }
  };

  const handleEditProject = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    if (project) {
      setSelectedProject({ ...project });
      setIsEditDialogOpen(true);
    } else {
      toast.error(isRTL ? 'المشروع غير موجود' : 'Project not found');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateProject(selectedProject);
      toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
      setIsEditDialogOpen(false);
      refetch(); // تحديث قائمة المشاريع
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث المشروع' : 'Error updating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
        refetch(); // تحديث قائمة المشاريع
      } catch (error) {
        toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
      }
    }
  };

  // وظيفة تحويل الصورة إلى Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // وظيفة معالجة إضافة الصور
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedProject) return;

    try {
      const newImages = await Promise.all(
        Array.from(files).map(file => convertImageToBase64(file))
      );

      const updatedProject = {
        ...selectedProject,
        images: [...(selectedProject.images || []), ...newImages]
      };

      setSelectedProject(updatedProject);
      
      // تحديث المشروع في التخزين
      await updateProject(selectedProject.id, updatedProject);
      toast.success(isRTL ? 'تم تحديث الصور بنجاح' : 'Images updated successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحميل الصور' : 'Error uploading images');
    }
  };

  // وظيفة حذف صورة
  const handleDeleteImage = async (index: number) => {
    if (!selectedProject) return;

    const updatedImages = selectedProject.images.filter((_, i) => i !== index);
    const updatedProject = {
      ...selectedProject,
      images: updatedImages
    };

    try {
      await updateProject(selectedProject.id, updatedProject);
      setSelectedProject(updatedProject);
      toast.success(isRTL ? 'تم حذف الصورة بنجاح' : 'Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف الصورة' : 'Error deleting image');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          {isRTL ? 'حدث خطأ أثناء تحميل المشاريع' : 'Error loading projects'}
        </p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isRTL ? 'لا توجد مشاريع حالياً' : 'No projects yet'}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const formatArea = (area: number) => {
    return `${new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(area)} ${isRTL ? 'م²' : 'm²'}`;
  };

  const getProjectType = (type: string) => {
    const types = {
      residential: { ar: 'سكني', en: 'Residential' },
      commercial: { ar: 'تجاري', en: 'Commercial' },
      industrial: { ar: 'صناعي', en: 'Industrial' },
      infrastructure: { ar: 'بنية تحتية', en: 'Infrastructure' },
      other: { ar: 'أخرى', en: 'Other' }
    };
    return types[type]?.[isRTL ? 'ar' : 'en'] || type;
  };

  const getProjectStatus = (status: string) => {
    const statuses = {
      active: { ar: 'نشط', en: 'Active' },
      'on-hold': { ar: 'معلق', en: 'On Hold' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' }
    };
    return statuses[status]?.[isRTL ? 'ar' : 'en'] || status;
  };

  return (
    <>
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProject(project.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {isRTL ? 'معاينة' : 'View'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(project.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isRTL ? 'حذف' : 'Delete'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'نوع المشروع' : 'Project Type'}
                    </span>
                    <p>{getProjectType(project.type)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'الحالة' : 'Status'}
                    </span>
                    <p>{getProjectStatus(project.status)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'مدير المشروع' : 'Project Manager'}
                    </span>
                    <p>{project.manager}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'تاريخ البدء' : 'Start Date'}
                    </span>
                    <p>{format(new Date(project.start_date), 'PPP', { locale: isRTL ? ar : undefined })}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'السعر' : 'Price'}
                    </span>
                    <p>{formatCurrency(project.price)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'مساحة المشروع' : 'Project Area'}
                    </span>
                    <p>{formatArea(project.project_area)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نافذة معاينة المشروع */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تفاصيل المشروع' : 'Project Details'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            {selectedProject && (
              <div className="space-y-6">
                {/* صور المشروع */}
                <div>
                  <Label>{isRTL ? 'صور المشروع' : 'Project Images'}</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      selectedProject.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <AspectRatio ratio={16 / 9}>
                            <img
                              src={image}
                              alt={`Project image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </AspectRatio>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 text-gray-500">
                        {isRTL ? 'لا توجد صور للمشروع' : 'No images available'}
                      </div>
                    )}
                  </div>
                </div>

                {/* معلومات المشروع */}
                <div className="space-y-4">
                  <div>
                    <Label>{isRTL ? 'اسم المشروع' : 'Project Name'}</Label>
                    <p className="mt-1 text-lg font-semibold">{selectedProject.name}</p>
                  </div>
                  <div>
                    <Label>{isRTL ? 'الوصف' : 'Description'}</Label>
                    <p className="mt-1 text-gray-600">{selectedProject.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{isRTL ? 'النوع' : 'Type'}</Label>
                      <p className="mt-1">{getProjectType(selectedProject.type)}</p>
                    </div>
                    <div>
                      <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
                      <p className="mt-1">{getProjectStatus(selectedProject.status)}</p>
                    </div>
                  </div>
                  <div>
                    <Label>{isRTL ? 'مدير المشروع' : 'Project Manager'}</Label>
                    <p className="mt-1">{selectedProject.manager}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{isRTL ? 'تاريخ البدء' : 'Start Date'}</Label>
                      <p className="mt-1">
                        {format(new Date(selectedProject.start_date), 'PPP', { locale: isRTL ? ar : undefined })}
                      </p>
                    </div>
                    <div>
                      <Label>{isRTL ? 'السعر' : 'Price'}</Label>
                      <p className="mt-1 font-semibold">{formatCurrency(selectedProject.price)}</p>
                    </div>
                  </div>
                  <div>
                    <Label>{isRTL ? 'المساحة' : 'Area'}</Label>
                    <p className="mt-1">{formatArea(selectedProject.project_area)}</p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل المشروع */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تعديل المشروع' : 'Edit Project'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            {selectedProject && (
              <div className="space-y-6">
                {/* صور المشروع */}
                <div>
                  <Label>{isRTL ? 'صور المشروع' : 'Project Images'}</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedProject.images && selectedProject.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={image}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleDeleteImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AspectRatio>
                      </div>
                    ))}
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <AspectRatio ratio={16 / 9}>
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">
                              {isRTL ? 'انقر لإضافة صورة' : 'Click to add image'}
                            </p>
                          </div>
                        </div>
                      </AspectRatio>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>

                {/* حقول التعديل */}
                <div className="space-y-4">
                  <div>
                    <Label>{isRTL ? 'اسم المشروع' : 'Project Name'}</Label>
                    <Input
                      value={selectedProject.name}
                      onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{isRTL ? 'الوصف' : 'Description'}</Label>
                    <Textarea
                      value={selectedProject.description}
                      onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{isRTL ? 'النوع' : 'Type'}</Label>
                      <Select
                        value={selectedProject.type}
                        onValueChange={(value) => setSelectedProject({ ...selectedProject, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">{getProjectType('residential')}</SelectItem>
                          <SelectItem value="commercial">{getProjectType('commercial')}</SelectItem>
                          <SelectItem value="industrial">{getProjectType('industrial')}</SelectItem>
                          <SelectItem value="infrastructure">{getProjectType('infrastructure')}</SelectItem>
                          <SelectItem value="other">{getProjectType('other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{isRTL ? 'الحالة' : 'Status'}</Label>
                      <Select
                        value={selectedProject.status}
                        onValueChange={(value) => setSelectedProject({ ...selectedProject, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{getProjectStatus('active')}</SelectItem>
                          <SelectItem value="on-hold">{getProjectStatus('on-hold')}</SelectItem>
                          <SelectItem value="completed">{getProjectStatus('completed')}</SelectItem>
                          <SelectItem value="cancelled">{getProjectStatus('cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{isRTL ? 'مدير المشروع' : 'Project Manager'}</Label>
                    <Input
                      value={selectedProject.manager}
                      onChange={(e) => setSelectedProject({ ...selectedProject, manager: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{isRTL ? 'تاريخ البدء' : 'Start Date'}</Label>
                      <Input
                        type="date"
                        value={selectedProject.start_date}
                        onChange={(e) => setSelectedProject({ ...selectedProject, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? 'السعر' : 'Price'}</Label>
                      <Input
                        type="number"
                        value={selectedProject.price}
                        onChange={(e) => setSelectedProject({ ...selectedProject, price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{isRTL ? 'المساحة' : 'Area'}</Label>
                    <Input
                      type="number"
                      value={selectedProject.project_area}
                      onChange={(e) => setSelectedProject({ ...selectedProject, project_area: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button onClick={handleSaveEdit}>
              {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}