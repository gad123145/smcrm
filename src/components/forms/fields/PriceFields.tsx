import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Property } from "../propertySchema";

interface PriceFieldsProps {
  form: UseFormReturn<Property>;
}

export function PriceFields({ form }: PriceFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="pricePerMeterFrom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("projects.form.pricePerMeterFrom")}</FormLabel>
            <FormControl>
              <Input {...field} type="text" className={isRTL ? "text-right" : "text-left"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pricePerMeterTo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("projects.form.pricePerMeterTo")}</FormLabel>
            <FormControl>
              <Input {...field} type="text" className={isRTL ? "text-right" : "text-left"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}