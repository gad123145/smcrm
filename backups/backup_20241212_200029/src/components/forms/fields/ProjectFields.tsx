import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

type ProjectFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  projects: string[];
};

export function ProjectFields({ form, projects }: ProjectFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
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
                <SelectTrigger className={cn("font-normal", isRTL && "text-right font-cairo")}>
                  <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select status"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">{isRTL ? "جديد" : "New"}</SelectItem>
                <SelectItem value="potential">{isRTL ? "محتمل" : "Potential"}</SelectItem>
                <SelectItem value="interested">{isRTL ? "مهتم" : "Interested"}</SelectItem>
                <SelectItem value="responded">{isRTL ? "متجاوب" : "Responded"}</SelectItem>
                <SelectItem value="noResponse">{isRTL ? "لا يوجد رد" : "No Response"}</SelectItem>
                <SelectItem value="scheduled">{isRTL ? "موعد محدد" : "Scheduled"}</SelectItem>
                <SelectItem value="postMeeting">{isRTL ? "بعد الاجتماع" : "Post Meeting"}</SelectItem>
                <SelectItem value="booked">{isRTL ? "تم الحجز" : "Booked"}</SelectItem>
                <SelectItem value="cancelled">{isRTL ? "ملغي" : "Cancelled"}</SelectItem>
                <SelectItem value="sold">{isRTL ? "تم البيع" : "Sold"}</SelectItem>
                <SelectItem value="postponed">{isRTL ? "مؤجل" : "Postponed"}</SelectItem>
                <SelectItem value="resale">{isRTL ? "إعادة بيع" : "Resale"}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "المشروع" : "Project"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={cn("font-normal", isRTL && "text-right font-cairo")}>
                    <SelectValue placeholder={isRTL ? "اختر المشروع" : "Select project"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "الميزانية" : "Budget"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder={isRTL ? "أدخل الميزانية" : "Enter budget"} 
                  {...field} 
                  className={cn("font-normal", isRTL && "text-right font-cairo")} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="campaign"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الحملة (اختياري)" : "Campaign (Optional)"}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={isRTL ? "اسم الحملة" : "Campaign name"} 
                {...field} 
                className={cn("font-normal", isRTL && "text-right font-cairo")} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}