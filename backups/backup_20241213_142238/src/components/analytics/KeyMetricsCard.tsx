import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Props {
  conversionRate: string;
  averageProjectValue: string;
}

export const KeyMetricsCard = ({ conversionRate, averageProjectValue }: Props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="md:col-span-2 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.analytics.keyMetrics")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg bg-white/50 dark:bg-gray-800/50",
            "hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              isRTL && "font-cairo text-right"
            )}>
              {t("dashboard.analytics.conversionRate")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {conversionRate}%
            </p>
          </div>
          <div className={cn(
            "p-4 rounded-lg bg-white/50 dark:bg-gray-800/50",
            "hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              isRTL && "font-cairo text-right"
            )}>
              {t("dashboard.analytics.averageProjectValue")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              ${averageProjectValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};