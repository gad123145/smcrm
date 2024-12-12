import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import type { PropertyFormData } from "../propertyFormSchema";
import { cn } from "@/lib/utils";

interface PropertyBasicFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

export function PropertyBasicFields({ form }: PropertyBasicFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "اسم العقار" : "Property Name"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "نوع العقار" : "Property Type"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "المساحة" : "Area"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الموقع" : "Location"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر" : "Price"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ownerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "رقم هاتف المالك" : "Owner Phone"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
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
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "وصف العقار" : "Property Description"}
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className={cn(
                  "min-h-[100px]",
                  isRTL && "text-right font-cairo"
                )} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}