import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface StatusCardProps {
  label: string;
  count: number;
  total: number;
  Icon: LucideIcon;
  status: string;
}

export const StatusCard = ({ label, count, total, Icon, status }: StatusCardProps) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Link to={`/clients/${status}`}>
      <Card className={cn(
        "bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300 cursor-pointer",
        "border border-gray-200 dark:border-gray-700",
        "group hover:border-primary/50 dark:hover:border-primary/50"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className={cn(
                "text-sm text-gray-500 dark:text-gray-400",
                isRTL && "font-cairo"
              )}>
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-2xl font-bold text-gray-900 dark:text-white",
                  isRTL && "font-cairo"
                )}>
                  {count}
                </span>
                <span className={cn(
                  "text-sm",
                  percentage > 50 ? "text-green-500" : "text-blue-500",
                  "dark:text-opacity-90"
                )}>
                  {percentage}%
                </span>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-xl transition-colors duration-300",
              "bg-gray-50 dark:bg-gray-700/50",
              "group-hover:bg-primary/10 dark:group-hover:bg-primary/20"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                "text-gray-600 dark:text-gray-300",
                "group-hover:text-primary dark:group-hover:text-primary"
              )} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}