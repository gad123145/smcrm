import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserSchema } from "../userSchema";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type UserBasicFieldsProps = {
  form: UseFormReturn<UserSchema>;
};

export function UserBasicFields({ form }: UserBasicFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الاسم الكامل" : "Full Name"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage className={cn(isRTL && "font-cairo")} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </FormLabel>
            <FormControl>
              <Input 
                type="email" 
                {...field} 
                className={cn(isRTL && "text-right font-cairo")}
                dir="ltr"
              />
            </FormControl>
            <FormMessage className={cn(isRTL && "font-cairo")} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "كلمة المرور" : "Password"}
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                {...field} 
                className={cn(isRTL && "text-right font-cairo")}
                dir="ltr"
              />
            </FormControl>
            <FormMessage className={cn(isRTL && "font-cairo")} />
          </FormItem>
        )}
      />
    </>
  );
}