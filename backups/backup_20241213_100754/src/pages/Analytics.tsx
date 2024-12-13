import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { StatusDistributionCard } from "@/components/analytics/StatusDistributionCard";
import { ClientGrowthCard } from "@/components/analytics/ClientGrowthCard";
import { KeyMetricsCard } from "@/components/analytics/KeyMetricsCard";

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clientsAnalytics'],
    queryFn: async () => {
      const { data: clients } = await supabase
        .from('clients')
        .select('status, created_at, project, budget')
        .order('created_at', { ascending: true });
      return clients;
    }
  });

  const getStatusData = () => {
    if (!clientsData) return [];
    const statusCount = clientsData.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCount).map(([status, count]) => ({
      name: t(`clients.status.${status}`),
      value: count as number
    }));
  };

  const getGrowthData = () => {
    if (!clientsData) return [];
    const monthlyCount = clientsData.reduce((acc, client) => {
      // Changed from ar-SA to en-US for Gregorian calendar
      const month = new Date(client.created_at).toLocaleString('en-US', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(monthlyCount).map(([month, count]) => ({
      month,
      clients: count as number
    }));
  };

  const getConversionRate = () => {
    if (!clientsData || clientsData.length === 0) return "0";
    const soldClients = clientsData.filter(client => client.status === 'sold').length;
    return ((soldClients / clientsData.length) * 100).toFixed(1).toString();
  };

  const getAverageProjectValue = () => {
    if (!clientsData) return "0";
    const projectsWithBudget = clientsData.filter(client => client.budget);
    if (projectsWithBudget.length === 0) return "0";
    
    const total = projectsWithBudget.reduce((sum, client) => {
      const budget = parseFloat(client.budget?.replace(/[^0-9.-]+/g, "") || "0");
      return sum + budget;
    }, 0);
    
    return Math.round(total / projectsWithBudget.length).toString();
  };

  if (isLoadingClients) {
    return (
      <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <DashboardSidebar open={sidebarOpen} />
        <DashboardContent>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent>
        <div className="space-y-8">
          <h1 className={cn(
            "text-3xl font-bold",
            isRTL && "font-cairo text-right"
          )}>
            {t("nav.analytics")}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusDistributionCard data={getStatusData()} />
            <ClientGrowthCard data={getGrowthData()} />
            <KeyMetricsCard 
              conversionRate={getConversionRate()} 
              averageProjectValue={getAverageProjectValue()} 
            />
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
};

export default Analytics;