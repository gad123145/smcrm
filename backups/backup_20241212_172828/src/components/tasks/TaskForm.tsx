import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "./taskSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { z } from "zod";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
    },
    mode: "all", // Changed to validate on all interactions but not submit
  });

  const createTask = useMutation({
    mutationFn: async (values: z.infer<typeof taskSchema>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
          created_by: session.session.user.id,
          due_date: values.due_date?.toISOString(),
          reminder_date: values.reminder_date?.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    createTask.mutate(values);
  };

  const handleDateChange = (date: Date | undefined, onChange: (date: Date | undefined) => void) => {
    onChange(date);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tasks.form.title")}</FormLabel>
              <FormControl>
                <Input {...field} className={cn(isRTL ? "text-right font-cairo" : "text-left")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tasks.form.description")}</FormLabel>
              <FormControl>
                <Textarea {...field} className={cn(isRTL ? "text-right font-cairo" : "text-left")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tasks.form.priority")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={cn(isRTL ? "text-right font-cairo" : "text-left")}>
                    <SelectValue placeholder={t("tasks.form.selectPriority")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">{t("tasks.priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("tasks.priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("tasks.priority.high")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("tasks.form.dueDate")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={(date) => handleDateChange(date, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reminder_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("tasks.form.reminderDate")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={(date) => handleDateChange(date, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn(
          "flex justify-end gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("tasks.cancel")}
          </Button>
          <Button type="submit">
            {t("tasks.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}