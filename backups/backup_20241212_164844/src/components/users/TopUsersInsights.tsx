import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface TopUsersInsightsProps {
  insights: string | null;
  isRTL: boolean;
}

export function TopUsersInsights({ insights, isRTL }: TopUsersInsightsProps) {
  const [showInsights, setShowInsights] = useState(false);
  const { t } = useTranslation();

  if (!insights) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-between mb-2"
        onClick={() => setShowInsights(!showInsights)}
      >
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className={cn(
            "text-sm font-medium",
            isRTL && "font-cairo"
          )}>
            {t("dashboard.aiRecommendations")}
          </span>
        </div>
        {showInsights ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      {showInsights && (
        <p className={cn(
          "text-sm text-muted-foreground whitespace-pre-wrap",
          isRTL && "font-cairo text-right"
        )}>
          {insights}
        </p>
      )}
    </div>
  );
}