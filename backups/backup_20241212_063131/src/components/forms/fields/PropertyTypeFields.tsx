import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { PropertyFormData } from "../propertyFormSchema";
import { cn } from "@/lib/utils";

interface PropertyTypeFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

export const propertyTypes = [
  { id: "apartment", label: { ar: "شقة", en: "Apartment" } },
  { id: "villa", label: { ar: "فيلا", en: "Villa" } },
  { id: "land", label: { ar: "أرض", en: "Land" } },
  { id: "building", label: { ar: "مبنى", en: "Building" } },
  { id: "shop", label: { ar: "محل تجاري", en: "Shop" } },
] as const;

export function PropertyTypeFields({ form }: PropertyTypeFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(isRTL && "font-cairo")}>
            {isRTL ? "نوع العقار" : "Property Type"}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4"
            >
              {propertyTypes.map((type) => (
                <FormItem key={type.id} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={type.id} />
                  </FormControl>
                  <FormLabel className={cn("font-normal", isRTL && "font-cairo")}>
                    {isRTL ? type.label.ar : type.label.en}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}