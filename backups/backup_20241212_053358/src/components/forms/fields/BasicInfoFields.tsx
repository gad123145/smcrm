import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

type BasicInfoFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الاسم</FormLabel>
            <FormControl>
              <Input placeholder="اسم العميل" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>البريد الإلكتروني</FormLabel>
            <FormControl>
              <Input type="email" placeholder="example@domain.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>معرف الفيسبوك</FormLabel>
            <FormControl>
              <Input placeholder="معرف الفيسبوك" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}