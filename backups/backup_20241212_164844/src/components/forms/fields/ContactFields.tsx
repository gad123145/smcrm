import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

type ContactFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  salesPersons: string[];
  contactMethods: string[];
};

export function ContactFields({ form, salesPersons, contactMethods }: ContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="salesPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>مسؤول المبيعات</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مسؤول المبيعات" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {salesPersons.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
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
        name="contactMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>طريقة التواصل</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة التواصل" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contactMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}