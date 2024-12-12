import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Project } from "./ProjectShareDialog";

interface ProjectSharePreviewProps {
  project: Project;
  selectedFields: string[];
  isRTL?: boolean;
}

export function ProjectSharePreview({ project, selectedFields, isRTL = false }: ProjectSharePreviewProps) {
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
    return types[type as keyof typeof types]?.[isRTL ? 'ar' : 'en'] || type;
  };

  const getProjectStatus = (status: string) => {
    const statuses = {
      active: { ar: 'نشط', en: 'Active' },
      'on-hold': { ar: 'معلق', en: 'On Hold' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' }
    };
    return statuses[status as keyof typeof statuses]?.[isRTL ? 'ar' : 'en'] || status;
  };

  const getFieldValue = (fieldId: string) => {
    switch (fieldId) {
      case 'type':
        return getProjectType(project.type);
      case 'status':
        return getProjectStatus(project.status);
      case 'price':
        return formatCurrency(project.price);
      case 'project_area':
        return formatArea(project.project_area);
      case 'start_date':
        return format(new Date(project.start_date), 'PPP', { locale: isRTL ? ar : undefined });
      default:
        return project[fieldId as keyof Project];
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg overflow-hidden",
      isRTL ? "font-cairo text-right" : ""
    )}>
      {/* Project Images */}
      {selectedFields.includes('images') && project.images && project.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 p-4">
          {project.images.slice(0, 4).map((image, index) => (
            <AspectRatio key={index} ratio={16 / 9}>
              <img
                src={image}
                alt={`${project.name} - ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
          ))}
        </div>
      )}

      {/* Project Details */}
      <div className="p-6 space-y-4">
        {selectedFields.includes('name') && (
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name}
          </h1>
        )}

        {selectedFields.includes('description') && (
          <p className="text-gray-600">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {selectedFields.includes('type') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'النوع' : 'Type'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('type')}</p>
            </div>
          )}

          {selectedFields.includes('status') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'الحالة' : 'Status'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('status')}</p>
            </div>
          )}

          {selectedFields.includes('manager') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'مدير المشروع' : 'Project Manager'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('manager')}</p>
            </div>
          )}

          {selectedFields.includes('start_date') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'تاريخ البدء' : 'Start Date'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('start_date')}</p>
            </div>
          )}

          {selectedFields.includes('price') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'السعر' : 'Price'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('price')}</p>
            </div>
          )}

          {selectedFields.includes('project_area') && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRTL ? 'المساحة' : 'Area'}
              </h3>
              <p className="mt-1 text-gray-900">{getFieldValue('project_area')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
