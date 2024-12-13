import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  companyId: string;
  initialData?: Partial<ProjectFormData>;
}

export interface ProjectFormData {
  name: string;
  consultant: string;
  operatingCompany: string;
  projectDivision: string;
  location: string;
  deliveryDate: string;
  pricePerMeter: string;
  availableUnits: string;
  unitPrice: string;
  areaStart: string;
  rentalSystem: string;
  details: string;
  images: string[];
}

export function AddProjectForm({ onSubmit, companyId, initialData }: AddProjectFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    consultant: initialData?.consultant || "",
    operatingCompany: initialData?.operatingCompany || "",
    projectDivision: initialData?.projectDivision || "",
    location: initialData?.location || "",
    deliveryDate: initialData?.deliveryDate || "",
    pricePerMeter: initialData?.pricePerMeter || "",
    availableUnits: initialData?.availableUnits || "",
    unitPrice: initialData?.unitPrice || "",
    areaStart: initialData?.areaStart || "",
    rentalSystem: initialData?.rentalSystem || "",
    details: initialData?.details || "",
    images: initialData?.images || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (files: FileList) => {
    const imageUrls = Array.from(files).map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imageUrls).then(urls => {
      setFormData(prev => ({
        ...prev,
        images: urls
      }));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "اسم المشروع" : "Project Name"}
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل اسم المشروع" : "Enter project name"}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "الاستشاري الهندسي" : "Consultant"}
        </label>
        <Input
          name="consultant"
          value={formData.consultant}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل اسم الاستشاري" : "Enter consultant name"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "شركة الإدارة والتشغيل" : "Operating Company"}
        </label>
        <Input
          name="operatingCompany"
          value={formData.operatingCompany}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل اسم شركة الإدارة" : "Enter operating company name"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "تقسيم المشروع" : "Project Division"}
        </label>
        <Input
          name="projectDivision"
          value={formData.projectDivision}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل تقسيم المشروع" : "Enter project division"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "موقع المشروع" : "Location"}
        </label>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل موقع المشروع" : "Enter project location"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "تاريخ التسليم" : "Delivery Date"}
        </label>
        <Input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "السعر لكل متر" : "Price Per Meter"}
        </label>
        <Input
          name="pricePerMeter"
          value={formData.pricePerMeter}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل السعر لكل متر" : "Enter price per meter"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "الوحدات المتاحة" : "Available Units"}
        </label>
        <Input
          name="availableUnits"
          value={formData.availableUnits}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل عدد الوحدات المتاحة" : "Enter available units"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "السعر للوحدات" : "Unit Price"}
        </label>
        <Input
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل السعر للوحدات" : "Enter unit price"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "بداية المساحات" : "Area Start"}
        </label>
        <Input
          name="areaStart"
          value={formData.areaStart}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل بداية المساحات" : "Enter area start"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "نظام الإيجار" : "Rental System"}
        </label>
        <Input
          name="rentalSystem"
          value={formData.rentalSystem}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل نظام الإيجار" : "Enter rental system"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "تفاصيل المشروع" : "Project Details"}
        </label>
        <Textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder={isRTL ? "أدخل تفاصيل المشروع" : "Enter project details"}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isRTL ? "صور المشروع" : "Project Images"}
        </label>
        <Input
          type="file"
          name="images"
          onChange={(e) => handleImageUpload(e.target.files as FileList)}
          multiple
          accept="image/*"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          {isRTL ? "إضافة المشروع" : "Add Project"}
        </Button>
      </div>
    </form>
  );
}
