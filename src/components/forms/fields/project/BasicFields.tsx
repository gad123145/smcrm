import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { ProjectFormData } from "../../projectFormSchema";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";

interface BasicFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isCompanyProject?: boolean;
}

const PROJECT_TYPES = [
  { value: "residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "commercial", labelAr: "تجاري", labelEn: "Commercial" },
  { value: "mixed", labelAr: "متعدد الاستخدام", labelEn: "Mixed Use" }
];

const PROJECT_STATUS = [
  { value: "active", labelAr: "نشط", labelEn: "Active" },
  { value: "on_hold", labelAr: "متوقف مؤقتاً", labelEn: "On Hold" },
  { value: "completed", labelAr: "مكتمل", labelEn: "Completed" },
  { value: "cancelled", labelAr: "ملغي", labelEn: "Cancelled" }
];

const PRIORITY_LEVELS = [
  { value: "high", labelAr: "عالية", labelEn: "High" },
  { value: "medium", labelAr: "متوسطة", labelEn: "Medium" },
  { value: "low", labelAr: "منخفضة", labelEn: "Low" }
];

export function BasicFields({ form, isCompanyProject }: BasicFieldsProps) {
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "تفاصيل المشروع" : "Project Details"}
            </FormLabel>
            <FormControl>
              <Textarea {...field} className={cn("min-h-[100px]", isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="project_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "نوع المشروع" : "Project Type"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر نوع المشروع" : "Select project type"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {isRTL ? type.labelAr : type.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "مدير المشروع" : "Project Manager"}
              </FormLabel>
              <FormControl>
                <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "تاريخ البدء" : "Start Date"}
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "تاريخ الانتهاء" : "End Date"}
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "حالة المشروع" : "Project Status"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر حالة المشروع" : "Select project status"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {isRTL ? status.labelAr : status.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "الأولوية" : "Priority"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر الأولوية" : "Select priority"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {isRTL ? priority.labelAr : priority.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="estimated_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "الميزانية المقدرة" : "Estimated Budget"}
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} className={cn(isRTL && "text-right font-cairo")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completion_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "نسبة الإنجاز" : "Completion Percentage"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  {...field} 
                  className={cn(isRTL && "text-right font-cairo")} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}