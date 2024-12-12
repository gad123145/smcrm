import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyHeaderProps {
  name: string;
  description?: string | null;
  isRTL: boolean;
  onAddProject: () => void;
}

export function CompanyHeader({ name, description, isRTL, onAddProject }: CompanyHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>
        <Button 
          className={cn(
            "gap-2",
            isRTL ? "flex-row-reverse" : ""
          )}
          onClick={onAddProject}
        >
          <Plus className="h-4 w-4" />
          {isRTL ? "إضافة مشروع" : "Add Project"}
        </Button>
      </div>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
          {description}
        </p>
      )}
    </>
  );
}