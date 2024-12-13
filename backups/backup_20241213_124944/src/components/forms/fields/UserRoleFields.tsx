import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UserSchema } from "../userSchema";
import { cn } from "@/lib/utils";

type UserRoleFieldsProps = {
  form: UseFormReturn<UserSchema>;
};

export function UserRoleFields({ form }: UserRoleFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo text-right")}>
              {t('users.role')}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(isRTL && "font-cairo text-right")}>
                  <SelectValue placeholder={t('users.form.selectRole')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin" className={cn(isRTL && "font-cairo text-right")}>
                  {t('users.roles.admin')}
                </SelectItem>
                <SelectItem value="supervisor" className={cn(isRTL && "font-cairo text-right")}>
                  {t('users.roles.supervisor')}
                </SelectItem>
                <SelectItem value="sales" className={cn(isRTL && "font-cairo text-right")}>
                  {t('users.roles.sales')}
                </SelectItem>
                <SelectItem value="employee" className={cn(isRTL && "font-cairo text-right")}>
                  {t('users.roles.employee')}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
}