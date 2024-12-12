import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

type LocationFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  countries: Array<{ code: string; name: string; flag: string; phoneCode: string }>;
};

export function LocationFields({ form, countries }: LocationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>الدولة</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                const selectedCountry = countries.find(c => c.code === value);
                if (selectedCountry) {
                  const currentPhone = form.getValues("phone") || "";
                  // Remove the '+' from phoneCode and ensure it doesn't start with the code already
                  const phoneCode = selectedCountry.phoneCode.replace('+', '');
                  if (!currentPhone.startsWith(phoneCode)) {
                    form.setValue("phone", phoneCode);
                  }
                }
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>رقم الهاتف</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="رقم الهاتف" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المدينة (اختياري)</FormLabel>
            <FormControl>
              <Input placeholder="المدينة" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}