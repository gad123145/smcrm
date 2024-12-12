import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { useClientStore } from "@/data/clientsData";
import { cn } from "@/lib/utils";

export const DailyTasks = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const clients = useClientStore((state) => state.clients);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Get the last 3 days
    const last3Days = Array.from({ length: 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    // Process data for each day
    const processedData = last3Days.map(date => {
      const dayClients = clients.filter(client => {
        const clientDate = new Date(client.createdAt);
        clientDate.setHours(0, 0, 0, 0);
        return clientDate.getTime() === date.getTime();
      });

      return {
        name: date.getDate().toString(),
        completed: dayClients.filter(client => 
          client.status === 'sold' || client.status === 'booked'
        ).length,
        pending: dayClients.filter(client => 
          client.status === 'new' || client.status === 'potential' || client.status === 'interested'
        ).length,
        cancelled: dayClients.filter(client => 
          client.status === 'cancelled'
        ).length
      };
    });

    setChartData(processedData);
  }, [clients]);

  // Calculate total clients added today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayClients = clients.filter(client => {
    const clientDate = new Date(client.createdAt);
    clientDate.setHours(0, 0, 0, 0);
    return clientDate.getTime() === today.getTime();
  }).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.dailyStats")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                reversed={isRTL}
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 12,
                  fontFamily: isRTL ? 'Cairo' : 'inherit'
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr',
                  fontFamily: isRTL ? 'Cairo' : 'inherit',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px'
                }}
                formatter={(value, name) => [value, t(`dashboard.${name}`)]}
                labelFormatter={(label) => `${t("dashboard.day")} ${label}`}
              />
              <Bar 
                name="completed"
                dataKey="completed" 
                fill="#22C55E" 
                radius={[4, 4, 0, 0]}
                stackId="stack" 
              />
              <Bar 
                name="pending"
                dataKey="pending" 
                fill="#EAB308" 
                radius={[4, 4, 0, 0]}
                stackId="stack" 
              />
              <Bar 
                name="cancelled"
                dataKey="cancelled" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                stackId="stack" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={cn(
          "mt-6 flex items-center justify-center gap-2",
          isRTL && "flex-row-reverse font-cairo"
        )}>
          <span className="text-2xl font-bold">{todayClients}</span>
          <span className="text-sm text-gray-500">
            {t("dashboard.newClients")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};