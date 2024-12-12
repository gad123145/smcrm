import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface Props {
  data: Array<{ month: string; clients: number }>;
}

export const ClientGrowthCard = ({ data }: Props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.analytics.clientGrowth")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clients" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};