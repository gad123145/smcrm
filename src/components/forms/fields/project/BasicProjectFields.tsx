import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Control } from "react-hook-form";
import { ProjectFormData } from "../../projectFormSchema";

interface BasicProjectFieldsProps {
  control: Control<ProjectFormData>;
}

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Other"
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
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter project name" {...field} />
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter project description" {...field} />
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
            <FormLabel>Project Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
            <FormLabel>Project Manager</FormLabel>
            <FormControl>
              <Input placeholder="Enter project manager name" {...field} />
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
            <FormLabel>Start Date</FormLabel>
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
            <FormLabel>End Date</FormLabel>
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
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
            <FormLabel>Priority</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_PRIORITY.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
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
        name="estimated_budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Budget</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter estimated budget" {...field} />
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
            <FormLabel>Actual Budget</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter actual budget" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="completion_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Completion Percentage</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter completion percentage" 
                min="0"
                max="100"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}