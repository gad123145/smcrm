import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FieldSelectProps {
  field: { key: string; label: string };
  value: string;
  headers: string[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function FieldSelect({ field, value, headers, onChange, required }: FieldSelectProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="grid gap-2">
      <Label className={cn(isRTL && "text-right")}>
        {field.label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue 
            placeholder={t('clients.importClients.mapping.sourceColumn')} 
          />
        </SelectTrigger>
        <SelectContent>
          {headers.map((header) => (
            <SelectItem key={header} value={header}>
              {header}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}