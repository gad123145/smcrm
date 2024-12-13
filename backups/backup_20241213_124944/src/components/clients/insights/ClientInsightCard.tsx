import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, ListChecks } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ClientInsightCardProps {
  insight: {
    purchaseProbability: number;
    bestContactTime: string;
    recommendations: string[];
    nextSteps: string[];
  };
}

export function ClientInsightCard({ insight }: ClientInsightCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getProbabilityColor = (probability: number) => {
    if (probability > 70) return "bg-green-500";
    if (probability > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      isRTL ? "font-cairo" : ""
    )}>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          {t("clients.insights.aiAnalysis")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t("clients.insights.purchaseProbability")}
            </span>
          </div>
          <Badge 
            className={cn(
              "text-white",
              getProbabilityColor(insight.purchaseProbability)
            )}
          >
            {insight.purchaseProbability}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t("clients.insights.bestTime")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {insight.bestContactTime}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t("clients.insights.recommendations")}
            </span>
          </div>
          <ul className="space-y-2">
            {insight.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t("clients.insights.nextSteps")}
            </span>
          </div>
          <ul className="space-y-2">
            {insight.nextSteps.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}