import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Control } from "react-hook-form";
import { ProjectFormData } from "../../projectFormSchema";
import { useTranslation } from "react-i18next";
import cn from "classnames";

interface BasicProjectFieldsProps {
  control: Control<ProjectFormData>;
}

const PROJECT_TYPES = [
  "residential",
  "commercial",
  "industrial",
  "infrastructure",
  "other"
];

const PROJECT_STATUS = [
  "active",
  "on-hold",
  "completed",
  "cancelled"
];

const PROJECT_PRIORITY = [
  "low",
  "medium",
  "high",
  "urgent"
];

export function BasicProjectFields({ control }: BasicProjectFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4 rtl:space-x-reverse">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "اسم المشروع" : "Project Name"}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={isRTL ? "أدخل اسم المشروع" : "Enter project name"} 
                {...field} 
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "وصف المشروع" : "Project Description"}
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder={isRTL ? "أدخل وصف المشروع" : "Enter project description"} 
                {...field} 
                className={cn("font-normal min-h-[100px]", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "نوع المشروع" : "Project Type"}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn("font-normal", isRTL && "text-right font-cairo")}>
                  <SelectValue placeholder={isRTL ? "اختر نوع المشروع" : "Select project type"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="residential">{isRTL ? "سكني" : "Residential"}</SelectItem>
                <SelectItem value="commercial">{isRTL ? "تجاري" : "Commercial"}</SelectItem>
                <SelectItem value="industrial">{isRTL ? "صناعي" : "Industrial"}</SelectItem>
                <SelectItem value="infrastructure">{isRTL ? "بنية تحتية" : "Infrastructure"}</SelectItem>
                <SelectItem value="other">{isRTL ? "أخرى" : "Other"}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "مدير المشروع" : "Project Manager"}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={isRTL ? "أدخل اسم مدير المشروع" : "Enter project manager name"} 
                {...field} 
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
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
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "حالة المشروع" : "Project Status"}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn("font-normal", isRTL && "text-right font-cairo")}>
                  <SelectValue placeholder={isRTL ? "اختر حالة المشروع" : "Select project status"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                <SelectItem value="on-hold">{isRTL ? "معلق" : "On Hold"}</SelectItem>
                <SelectItem value="completed">{isRTL ? "مكتمل" : "Completed"}</SelectItem>
                <SelectItem value="cancelled">{isRTL ? "ملغي" : "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "أولوية المشروع" : "Project Priority"}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn("font-normal", isRTL && "text-right font-cairo")}>
                  <SelectValue placeholder={isRTL ? "اختر أولوية المشروع" : "Select project priority"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">{isRTL ? "منخفضة" : "Low"}</SelectItem>
                <SelectItem value="medium">{isRTL ? "متوسطة" : "Medium"}</SelectItem>
                <SelectItem value="high">{isRTL ? "عالية" : "High"}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الميزانية المقدرة" : "Estimated Budget"}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={isRTL ? "أدخل الميزانية المقدرة" : "Enter estimated budget"} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر" : "Price"}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={isRTL ? "أدخل السعر" : "Enter price"} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="project_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "مساحة المشروع" : "Project Area"}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={isRTL ? "أدخل مساحة المشروع" : "Enter project area"} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}