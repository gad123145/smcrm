import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/storage";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CompanyProjectsProps {
  companyId: string | undefined;
}

export function CompanyProjects({ companyId }: CompanyProjectsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const { data: projects, isLoading, error } = useQuery({
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
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      try {
        // Add delete logic here
        toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
      } catch (error) {
        toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
      }
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
  );
}