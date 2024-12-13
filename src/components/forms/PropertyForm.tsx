import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { propertyFormSchema, PropertyFormData } from "./propertyFormSchema";
import { cn } from "@/lib/utils";
import { PropertyBasicFields } from "./fields/PropertyBasicFields";
import { PropertyTypeFields } from "./fields/PropertyTypeFields";
import { PropertyDetailsFields } from "./fields/PropertyDetailsFields";
import { PropertyFileUpload } from "./fields/upload/PropertyFileUpload";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<PropertyFormData>;
}

export function PropertyForm({ onSubmit, onCancel, defaultValues }: PropertyFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      type: defaultValues?.type || "",
      location: defaultValues?.location || "",
      area: defaultValues?.area || "",
      price: defaultValues?.price || "",
      description: defaultValues?.description || "",
      ownerPhone: defaultValues?.ownerPhone || "",
      images: defaultValues?.images || [],
    },
  });

  const handleFileUploadComplete = (urls: { images: string[] }) => {
    if (urls.images.length > 0) {
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...urls.images]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={cn("space-y-6", isRTL && "text-right")}>
          <PropertyBasicFields form={form} />
          <PropertyTypeFields form={form} />
          <PropertyDetailsFields form={form} />
          <PropertyFileUpload 
            onUploadComplete={handleFileUploadComplete}
            isRTL={isRTL}
          />
        </div>
        
        <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
          <Button type="submit" className="flex-1">
            {isRTL ? "حفظ" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}