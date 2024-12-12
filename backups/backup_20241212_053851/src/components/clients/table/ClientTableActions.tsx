import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientTableActionsProps {
  isSelected: boolean;
  onSelect: (id: string) => void;
  clientId: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => Promise<void>;
}

export function ClientTableActions({
  isSelected,
  onSelect,
  clientId,
  isFavorite = false,
  onToggleFavorite
}: ClientTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(clientId)}
      />
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(clientId);
          }}
          className={cn(
            "p-0 h-8 w-8",
            isFavorite && "text-yellow-500"
          )}
        >
          <Star className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}