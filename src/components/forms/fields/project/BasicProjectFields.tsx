import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { ProjectFormData } from "../../projectFormSchema";
import { cn } from "@/lib/utils";

interface BasicProjectFieldsProps {
  form: UseFormReturn<ProjectFormData>;
}

export function BasicProjectFields({ form }: BasicProjectFieldsProps) {
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
                  <SelectItem value="residential">{isRTL ? "سكني" : "Residential"}</SelectItem>
                  <SelectItem value="commercial">{isRTL ? "تجاري" : "Commercial"}</SelectItem>
                  <SelectItem value="mixed">{isRTL ? "متعدد الاستخدام" : "Mixed Use"}</SelectItem>
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
                <Input type="date" {...field} className={cn(isRTL && "text-right font-cairo")} />
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
                <Input type="date" {...field} className={cn(isRTL && "text-right font-cairo")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="high">{isRTL ? "عالية" : "High"}</SelectItem>
                  <SelectItem value="medium">{isRTL ? "متوسطة" : "Medium"}</SelectItem>
                  <SelectItem value="low">{isRTL ? "منخفضة" : "Low"}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "الحالة" : "Status"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select status"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                  <SelectItem value="on_hold">{isRTL ? "متوقف مؤقتاً" : "On Hold"}</SelectItem>
                  <SelectItem value="completed">{isRTL ? "مكتمل" : "Completed"}</SelectItem>
                  <SelectItem value="cancelled">{isRTL ? "ملغي" : "Cancelled"}</SelectItem>
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