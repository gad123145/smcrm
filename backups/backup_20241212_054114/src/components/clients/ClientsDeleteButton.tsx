import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientsDeleteButtonProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  variant?: "outline" | "destructive" | "default";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ClientsDeleteButton({ 
  selectedCount, 
  onDelete,
  variant = "destructive",
  size = "default"
}: ClientsDeleteButtonProps) {
  const { t } = useTranslation();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedCount > 0) {
      try {
        await onDelete();
      } catch (error) {
        console.error('Error in delete button click handler:', error);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className="h-8"
      disabled={selectedCount === 0}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {selectedCount === 1 ? t("clients.delete") : t("clients.deleteSelected", { count: selectedCount })}
    </Button>
  );
}