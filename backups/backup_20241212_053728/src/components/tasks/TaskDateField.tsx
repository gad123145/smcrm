import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { taskSchema } from "./taskSchema";
import { z } from "zod";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface TaskDateFieldProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  name: "due_date" | "reminder_date";
  label: string;
}

export function TaskDateField({ form, name, label }: TaskDateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
  );
}