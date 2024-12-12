import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClientStore } from "@/data/clientsData";

export const DailyStats = () => {
  const { t } = useTranslation();
  const clients = useClientStore((state) => state.clients);
  
  // Get today's clients
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayClients = clients.filter(client => {
    const clientDate = new Date(client.createdAt);
    clientDate.setHours(0, 0, 0, 0);
    return clientDate.getTime() === today.getTime();
  });

  // Calculate response rates
  const respondedClients = todayClients.filter(client => 
    client.status === 'responded' || client.status === 'interested'
  ).length;
  
  const noResponseClients = todayClients.filter(client => 
    client.status === 'noResponse'
  ).length;

  const totalClients = todayClients.length;
  const responseRate = totalClients > 0 ? Math.round((respondedClients / totalClients) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t("dashboard.dailyStats")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{responseRate}%</span>
          </div>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="8"
              strokeDasharray={`${(responseRate / 100) * 377} 377`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-red-500 text-red-500" />
            <span>{t("dashboard.noResponse")}: {noResponseClients}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-green-500 text-green-500" />
            <span>{t("dashboard.responded")}: {respondedClients}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};