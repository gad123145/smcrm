import { Project } from "@/storage/projects";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency, formatArea } from "@/lib/format";

interface ProjectSharePreviewProps {
  project: Project;
  selectedFields: string[];
}

export function ProjectSharePreview({ project, selectedFields }: ProjectSharePreviewProps) {
  const isRTL = true; // Since we're using Arabic

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: "اسم المشروع",
      description: "وصف المشروع",
      status: "حالة المشروع",
      start_date: "تاريخ البدء",
      price: "السعر",
      project_area: "المساحة",
      consultant: "الاستشاري",
      operatingCompany: "الشركة المشغلة",
      projectDivision: "قسم المشروع",
      location: "الموقع",
      deliveryDate: "تاريخ التسليم",
      pricePerMeter: "سعر المتر",
      availableUnits: "الوحدات المتاحة",
      unitPrice: "سعر الوحدة",
      areaStart: "المساحة الابتدائية",
      rentalSystem: "نظام الإيجار",
      details: "التفاصيل",
      images: "الصور"
    };
    return labels[field] || field;
  };

  const renderField = (field: string, value: any) => {
    if (!selectedFields.includes(field) || !value) return null;

    let displayValue = value;

    // Format special fields
    switch (field) {
      case 'start_date':
      case 'deliveryDate':
        displayValue = formatDate(value, isRTL);
        break;
      case 'price':
      case 'pricePerMeter':
      case 'unitPrice':
        displayValue = formatCurrency(value, isRTL);
        break;
      case 'project_area':
      case 'areaStart':
        displayValue = formatArea(value, isRTL);
        break;
      case 'images':
        return value.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 my-4">
            {value.map((image: string, index: number) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={image}
                  alt={`${project.name} - ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : null;
      default:
        displayValue = value.toString();
    }

    return (
      <div key={field} className="break-inside-avoid mb-4">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {getFieldLabel(field)}
        </dt>
        <dd className={cn(
          "mt-1 text-sm text-gray-900 dark:text-gray-100",
          "font-arabic"
        )}>
          {displayValue}
        </dd>
      </div>
    );
  };

  if (selectedFields.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        الرجاء اختيار حقل واحد على الأقل
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={cn(
        "text-2xl font-semibold text-gray-900 dark:text-gray-100",
        "font-arabic"
      )}>
        {project.name}
      </h2>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
        {Object.entries(project).map(([field, value]) => renderField(field, value))}
      </dl>
    </div>
  );
}
