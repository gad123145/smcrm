import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { AIAssistant } from "@/components/AIAssistant";
import { ActiveUsers } from "@/components/ActiveUsers";
import { DailyStats } from "@/components/DailyStats";
import { DailyTasks } from "@/components/DailyTasks";
import { ResponseTime } from "@/components/ResponseTime";
import { StatusGrid } from "@/components/StatusGrid";
import { TopUsers } from "@/components/TopUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WhatsappStats } from "@/components/WhatsappStats";
import { MessengerStats } from "@/components/MessengerStats";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { t, i18n } = useTranslation();
  const { generateText } = useGeminiAI();
  const isRTL = i18n.language === 'ar';
  
  useRealtimeSubscription('profiles', ['profiles']);

  const { data: aiRecommendations } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: async () => {
      const { data: clients } = await supabase
        .from('clients')
        .select('status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: projects } = await supabase
        .from('projects')
        .select('status, progress')
        .order('created_at', { ascending: false })
        .limit(100);

      const prompt = `
        تحليل البيانات التالية وتقديم توصيات:
        
        العملاء:
        ${clients?.map(c => `- ${c.status} (${new Date(c.created_at).toLocaleDateString()})`).join('\n')}
        
        المشاريع:
        ${projects?.map(p => `- حالة: ${p.status}, تقدم: ${p.progress}%`).join('\n')}
        
        المطلوب:
        1. تحليل اتجاهات المبيعات
        2. توصيات لتحسين الأداء
        3. فرص النمو المحتملة
      `;

      const response = await generateText(prompt);
      return response;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <StatusGrid />

            {aiRecommendations && (
              <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full flex items-center justify-between",
                      "hover:bg-white/50 dark:hover:bg-gray-700/50",
                      "transition-all duration-300"
                    )}
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary animate-pulse" />
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isRTL && "font-cairo"
                      )}>
                        {t("dashboard.aiRecommendations")}
                      </CardTitle>
                    </div>
                    {showAIRecommendations ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                {showAIRecommendations && (
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className={cn(
                        "whitespace-pre-wrap text-sm leading-relaxed",
                        isRTL && "font-cairo text-right"
                      )}>
                        {aiRecommendations}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="space-y-6">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <ActiveUsers />
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <ResponseTime />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="space-y-6">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <WhatsappStats />
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <MessengerStats />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="space-y-6">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <DailyTasks />
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <TopUsers />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <AIAssistant />
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
};

export default Index;
