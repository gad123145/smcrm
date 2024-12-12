import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

type ProjectFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  projects: string[];
};

export function ProjectFields({ form, projects }: ProjectFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الحالة</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">عملاء جدد</SelectItem>
                <SelectItem value="potential">عملاء محتملين</SelectItem>
                <SelectItem value="interested">عملاء مهتمين</SelectItem>
                <SelectItem value="responded">عملاء متجاوبين</SelectItem>
                <SelectItem value="noResponse">لا يوجد رد</SelectItem>
                <SelectItem value="scheduled">موعد محدد</SelectItem>
                <SelectItem value="postMeeting">بعد الاجتماع</SelectItem>
                <SelectItem value="booked">تم الحجز</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
                <SelectItem value="sold">تم البيع</SelectItem>
                <SelectItem value="postponed">مؤجل</SelectItem>
                <SelectItem value="resale">إعادة بيع</SelectItem>
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
              <FormLabel>المشروع</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
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
              <FormLabel>الميزانية</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
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
            <FormLabel>الحملة (اختياري)</FormLabel>
            <FormControl>
              <Input placeholder="اسم الحملة" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}