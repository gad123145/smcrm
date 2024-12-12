import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientAnalysisButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isRTL: boolean;
}

export function ClientAnalysisButton({ onClick, isLoading, isRTL }: ClientAnalysisButtonProps) {
  return (
    <div className={cn(
      "flex justify-end",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {isRTL ? "تحليل" : "Analyze"}
      </Button>
    </div>
  );
}