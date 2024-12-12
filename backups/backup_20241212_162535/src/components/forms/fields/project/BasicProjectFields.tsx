import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Control } from "react-hook-form";
import { ProjectFormData } from "../../projectFormSchema";
import { useTranslation } from "react-i18next";

interface BasicProjectFieldsProps {
  control: Control<ProjectFormData>;
}

const PROJECT_TYPES = [
  "residential",
  "commercial",
  "industrial",
  "infrastructure",
  "other"
];

const PROJECT_STATUS = [
  "active",
  "on-hold",
  "completed",
  "cancelled"
];

const PROJECT_PRIORITY = [
  "low",
  "medium",
  "high",
  "urgent"
];

export function BasicProjectFields({ control }: BasicProjectFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 rtl:space-x-reverse">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('projects.placeholders.name')} {...field} className="font-normal" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.description')}</FormLabel>
            <FormControl>
              <Textarea placeholder={t('projects.placeholders.description')} {...field} className="font-normal min-h-[100px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.type')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="font-normal">
                  <SelectValue placeholder={t('projects.placeholders.type')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`projects.types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.manager')}</FormLabel>
            <FormControl>
              <Input placeholder={t('projects.placeholders.manager')} {...field} className="font-normal" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('projects.fields.startDate')}</FormLabel>
            <DatePicker
              date={field.value ? new Date(field.value) : undefined}
              setDate={(date) => field.onChange(date?.toISOString())}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.status')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="font-normal">
                  <SelectValue placeholder={t('projects.placeholders.status')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`projects.status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.priority')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="font-normal">
                  <SelectValue placeholder={t('projects.placeholders.priority')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_PRIORITY.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(`projects.priority.${priority}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.estimatedBudget')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('projects.placeholders.estimatedBudget')} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className="font-normal" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.price')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('projects.fields.price')} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className="font-normal" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="project_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('projects.fields.projectArea')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('projects.fields.projectArea')} 
                {...field} 
                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                className="font-normal" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}