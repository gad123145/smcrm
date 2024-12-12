import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import type { ProjectFormData } from "../../projectFormSchema";
import { cn } from "@/lib/utils";

interface BasicFieldsProps {
  form: UseFormReturn<ProjectFormData>;
}

export function BasicFields({ form }: BasicFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "اسم المشروع" : "Project Name"}
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
        name="engineeringConsultant"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الاستشاري الهندسي" : "Engineering Consultant"}
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
        name="operatingCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "شركة الإدارة والتشغيل" : "Management and Operation Company"}
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
        name="projectSections"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "تقسيم المشروع" : "Project Division"}
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
        name="deliveryDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "تاريخ التسليم" : "Delivery Date"}
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="date" 
                className={cn(isRTL && "text-right font-cairo")}
                readOnly
                value={new Date().toISOString().split('T')[0]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pricePerMeter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر لكل متر" : "Price per Meter"}
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
        name="availableUnits"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الوحدات المتاحة" : "Available Units"}
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
        name="unitPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر للوحدات" : "Unit Price"}
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
        name="minArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "بداية المساحات" : "Start of Areas"}
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
        name="rentalSystem"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "نظام الإيجار" : "Rental System"}
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
              {isRTL ? "تفاصيل المشروع" : "Project Details"}
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