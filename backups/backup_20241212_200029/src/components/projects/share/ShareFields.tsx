import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

interface ShareFieldsProps {
  fields: { id: string; label: string }[];
  selectedFields: string[];
  setSelectedFields: (fields: string[]) => void;
}

export function ShareFields({ fields, selectedFields, setSelectedFields }: ShareFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
      <h4 className="font-medium">
        {isRTL ? "اختر الحقول المراد مشاركتها" : "Select fields to share"}
      </h4>
      {fields.map((field) => (
        <div key={field.id} className="flex items-center space-x-2">
          <Checkbox
            id={field.id}
            checked={selectedFields.includes(field.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedFields([...selectedFields, field.id]);
              } else {
                setSelectedFields(selectedFields.filter(id => id !== field.id));
              }
            }}
          />
          <label htmlFor={field.id} className="text-sm">
            {field.label}
          </label>
        </div>
      ))}
    </div>
  );
}