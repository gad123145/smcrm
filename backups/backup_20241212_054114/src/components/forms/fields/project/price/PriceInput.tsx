import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { ProjectFormData } from "../../../projectFormSchema";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  form: UseFormReturn<ProjectFormData>;
  name: keyof ProjectFormData;
  label: string;
  isRTL: boolean;
}

export function PriceInput({ form, name, label, isRTL }: PriceInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(isRTL && "font-cairo")}>{label}</FormLabel>
          <FormControl>
            <Input 
              type="text"
              {...field}
              value={field.value as string || ''} // Ensure value is always string
              className={cn(isRTL && "text-right font-cairo")} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}