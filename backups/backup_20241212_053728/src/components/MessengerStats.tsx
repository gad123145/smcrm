import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MessengerStats = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [stats, setStats] = useState({
    dailyStats: [] as { date: string; count: number }[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) return;

      // Get daily Messenger contacts
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      const { data: clientStats } = await supabase
        .from('clients')
        .select('created_at, status')
        .eq('status', 'facebookContact')
        .gte('created_at', last7Days[0].toISOString());

      const dailyData = last7Days.map(date => {
        const count = (clientStats || []).filter(client => {
          const clientDate = new Date(client.created_at);
          return clientDate.toDateString() === date.toDateString();
        }).length;

        return {
          date: date.toLocaleDateString(i18n.language, { weekday: 'short' }),
          count
        };
      });

      setStats({
        dailyStats: dailyData
      });
    };

    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('messenger_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-medium flex items-center gap-2",
          isRTL ? "flex-row-reverse font-cairo" : "flex-row"
        )}>
          <MessageSquareDashed className="w-5 h-5 text-blue-500" />
          {t("dashboard.messenger")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                reversed={isRTL}
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 12,
                  fontFamily: isRTL ? 'Cairo' : 'inherit'
                }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};