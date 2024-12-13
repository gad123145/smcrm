import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Project } from "@/storage/projects";
import { ProjectSharePreview } from "./ProjectSharePreview";

interface ProjectShareDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_FIELDS = {
  basic: [
    'name',
    'description',
    'status',
    'start_date',
  ],
  financial: [
    'price',
    'project_area',
    'pricePerMeter',
    'unitPrice',
    'availableUnits',
  ],
  details: [
    'consultant',
    'operatingCompany',
    'projectDivision',
    'location',
    'deliveryDate',
    'areaStart',
    'rentalSystem',
    'details',
  ],
  media: ['images']
} as const;

type FieldCategory = keyof typeof PROJECT_FIELDS;
type ProjectField = typeof PROJECT_FIELDS[FieldCategory][number];

export function ProjectShareDialog({ project, isOpen, onClose }: ProjectShareDialogProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [selectedFields, setSelectedFields] = useState<ProjectField[]>(
    Object.values(PROJECT_FIELDS).flat() as ProjectField[]
  );

  const handleFieldToggle = (field: ProjectField) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleCategoryToggle = (category: FieldCategory) => {
    const categoryFields = PROJECT_FIELDS[category] as ProjectField[];
    const allSelected = categoryFields.every(field => selectedFields.includes(field));
    
    if (allSelected) {
      setSelectedFields(prev => prev.filter(field => !categoryFields.includes(field)));
    } else {
      setSelectedFields(prev => [...new Set([...prev, ...categoryFields])]);
    }
  };

  const handleSelectAll = () => {
    setSelectedFields(Object.values(PROJECT_FIELDS).flat() as ProjectField[]);
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) {
      toast.error("حدث خطأ أثناء التصدير");
      return;
    }

    const loadingToast = toast.loading("جاري إعداد الملف...");

    try {
      const element = previewRef.current;
      element.style.width = '800px';
      element.style.padding = '20px';
      element.style.background = 'white';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      element.style.width = '';
      element.style.padding = '';
      element.style.background = '';

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const date = new Date().toLocaleDateString('ar-EG');
      pdf.save(`${project.name}_${date}.pdf`);
      
      toast.dismiss(loadingToast);
      toast.success("تم تصدير الملف بنجاح");
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

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

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      basic: "المعلومات الأساسية",
      financial: "المعلومات المالية",
      details: "التفاصيل الإضافية",
      media: "الوسائط"
    };
    return labels[category] || category;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>مشاركة المشروع</DialogTitle>
          <DialogDescription>اختر الحقول التي تريد مشاركتها</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">اختر الحقول</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  تحديد الكل
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  إلغاء تحديد الكل
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {(Object.keys(PROJECT_FIELDS) as FieldCategory[]).map((category) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox
                      id={category}
                      checked={PROJECT_FIELDS[category].every(field => selectedFields.includes(field))}
                      indeterminate={
                        PROJECT_FIELDS[category].some(field => selectedFields.includes(field)) &&
                        !PROJECT_FIELDS[category].every(field => selectedFields.includes(field))
                      }
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label htmlFor={category} className="text-sm font-medium cursor-pointer select-none">
                      {getCategoryLabel(category)}
                    </label>
                  </div>
                  <div className="ml-6 rtl:mr-6 space-y-2">
                    {PROJECT_FIELDS[category].map((field) => (
                      <div key={field} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={field}
                          checked={selectedFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <label htmlFor={field} className="text-sm cursor-pointer select-none">
                          {getFieldLabel(field)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <div ref={previewRef}>
              <ProjectSharePreview 
                project={project}
                selectedFields={selectedFields}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            className="gap-2"
            disabled={selectedFields.length === 0}
          >
            <Download className="h-4 w-4" />
            تصدير PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
