import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Property } from "../propertySchema";
import { cn } from "@/lib/utils";

interface BasicPropertyFieldsProps {
  form: UseFormReturn<Property>;
}

export function BasicPropertyFields({ form }: BasicPropertyFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("projects.form.title")}</FormLabel>
            <FormControl>
              <Input {...field} className={isRTL ? "text-right" : "text-left"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("projects.form.description")}</FormLabel>
            <FormControl>
              <Textarea {...field} className={cn(
                "min-h-[100px] resize-none",
                isRTL ? "text-right" : "text-left"
              )} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}