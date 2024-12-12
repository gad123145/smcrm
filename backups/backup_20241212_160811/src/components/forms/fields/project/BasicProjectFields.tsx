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
            <FormLabel>{t('project.fields.name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('project.placeholders.name')} {...field} className="font-normal" />
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
            <FormLabel>{t('project.fields.description')}</FormLabel>
            <FormControl>
              <Textarea placeholder={t('project.placeholders.description')} {...field} className="font-normal min-h-[100px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="project_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('project.fields.type')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="font-normal">
                  <SelectValue placeholder={t('project.placeholders.type')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`project.types.${type}`)}
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
        name="project_manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('project.fields.manager')}</FormLabel>
            <FormControl>
              <Input placeholder={t('project.placeholders.manager')} {...field} className="font-normal" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('project.fields.startDate')}</FormLabel>
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
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('project.fields.endDate')}</FormLabel>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) => field.onChange(date?.toISOString())}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('project.fields.status')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="font-normal">
                    <SelectValue placeholder={t('project.placeholders.status')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`project.status.${status}`)}
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
              <FormLabel>{t('project.fields.priority')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="font-normal">
                    <SelectValue placeholder={t('project.placeholders.priority')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_PRIORITY.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {t(`project.priority.${priority}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="estimated_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('project.fields.estimatedBudget')}</FormLabel>
              <FormControl>
                <Input type="number" placeholder={t('project.placeholders.estimatedBudget')} {...field} className="font-normal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="actual_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('project.fields.actualBudget')}</FormLabel>
              <FormControl>
                <Input type="number" placeholder={t('project.placeholders.actualBudget')} {...field} className="font-normal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="completion_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('project.fields.completionPercentage')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('project.placeholders.completionPercentage')} 
                min="0"
                max="100"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
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