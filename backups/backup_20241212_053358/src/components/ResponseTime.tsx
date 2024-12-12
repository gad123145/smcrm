import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { useClientStore } from "@/data/clientsData";
import { useMemo } from "react";

export const ResponseTime = () => {
  const { t, i18n } = useTranslation();
  const clients = useClientStore((state) => state.clients);
  const isRTL = i18n.language === 'ar';

  const data = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    return days.map(date => {
      const dayClients = clients.filter(client => {
        const clientDate = new Date(client.createdAt);
        clientDate.setHours(0, 0, 0, 0);
        return clientDate.getTime() === date.getTime();
      });

      const respondedClients = dayClients.filter(client => 
        client.status === 'responded' || client.status === 'interested'
      );

      const avgResponseTime = respondedClients.length > 0 ? 
        respondedClients.reduce((acc, client) => {
          const createdAt = new Date(client.createdAt);
          const updatedAt = new Date(client.updatedAt);
          return acc + (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60); // Convert to minutes
        }, 0) / respondedClients.length : 0;

      return {
        name: date.getDate().toString(),
        value: Math.round(avgResponseTime)
      };
    });
  }, [clients]);

  const averageResponseTime = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((acc, item) => acc + item.value, 0) / data.length);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("dashboard.weeklyResponseTime")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis 
                dataKey="name" 
                hide 
                reversed={isRTL}
              />
              <Tooltip 
                contentStyle={{ 
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}
                formatter={(value: number) => [
                  `${value} ${t("dashboard.minutes")}`,
                  t("dashboard.responseTime")
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={`mt-4 text-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center justify-center gap-1`}>
          <span className="text-2xl font-bold">{averageResponseTime}</span>
          <span className="text-sm text-gray-500">{t("dashboard.minutes")}</span>
        </div>
      </CardContent>
    </Card>
  );
};