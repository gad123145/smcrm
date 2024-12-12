import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const companySchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون اسم الشركة أكثر من حرفين" }),
  description: z.string().min(10, { message: "يجب أن يكون الوصف أكثر من 10 أحرف" }).optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
}

export function CompanyForm({ onSubmit, onCancel }: CompanyFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "اسم الشركة" : "Company Name"}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className={cn(isRTL && "text-right font-cairo")}
                  placeholder={isRTL ? "أدخل اسم الشركة" : "Enter company name"}
                />
              </FormControl>
              <FormMessage className={cn(isRTL && "font-cairo")} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(isRTL && "font-cairo")}>
                {isRTL ? "نبذة عن الشركة" : "Company Description"}
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className={cn(
                    "min-h-[100px] resize-none",
                    isRTL && "text-right font-cairo"
                  )}
                  placeholder={isRTL ? "أدخل نبذة عن الشركة" : "Enter company description"}
                />
              </FormControl>
              <FormMessage className={cn(isRTL && "font-cairo")} />
            </FormItem>
          )}
        />

        <div className={cn(
          "flex gap-4",
          isRTL ? "flex-row-reverse" : ""
        )}>
          <Button 
            type="submit" 
            className={cn(isRTL && "font-cairo")}
            disabled={form.formState.isSubmitting}
          >
            {isRTL ? "حفظ" : "Save"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}