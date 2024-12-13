import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PropertyFormData } from "./propertyFormSchema";
import { BasicPropertyFields } from "./fields/BasicPropertyFields";
import { PropertyTypeFields } from "./fields/PropertyTypeFields";
import { PropertyDetailsFields } from "./fields/PropertyDetailsFields";
import { UploadField } from "./fields/upload/UploadField";

interface PropertyFormFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

export function PropertyFormFields({ form }: PropertyFormFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <BasicPropertyFields form={form} />
      <PropertyTypeFields form={form} />
      <PropertyDetailsFields form={form} />
      <UploadField 
        form={form} 
        name="images"
        label={isRTL ? "صور العقار" : "Property Images"}
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        }}
        maxFiles={10}
        isRTL={isRTL}
      />
    </div>
  );
}