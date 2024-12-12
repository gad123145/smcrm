import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../formSchema";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "@/components/ui/date-time-picker";

type NextActionFieldsProps = {
  form: UseFormReturn<FormData>;
};

export function NextActionFields({ form }: NextActionFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <FormField
        control={form.control}
        name="next_action_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isRTL ? "نوع الإجراء التالي" : "Next Action Type"}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر الإجراء التالي" : "Select Next Action"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="call">{t("clients.actions.call")}</SelectItem>
                <SelectItem value="meeting">{t("clients.actions.meeting")}</SelectItem>
                <SelectItem value="followup">{t("clients.actions.followup")}</SelectItem>
                <SelectItem value="site_visit">{t("clients.actions.siteVisit")}</SelectItem>
                <SelectItem value="contract">{t("clients.actions.contract")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="next_action_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{isRTL ? "تاريخ الإجراء التالي" : "Next Action Date"}</FormLabel>
            <FormControl>
              <DateTimePicker
                date={field.value}
                setDate={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}