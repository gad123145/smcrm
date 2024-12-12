import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClientInsightsProps {
  client: {
    id: string;
    name: string;
    status: string;
    phone: string;
    email?: string;
    project?: string;
    budget?: string;
    createdAt: Date;
    comments?: string[];
  };
}

export function ClientInsights({ client }: ClientInsightsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { generateText, isLoading } = useGeminiAI();
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const analyzeClient = async () => {
      try {
        // Get existing insights
        const { data: existingInsights, error: fetchError } = await supabase
          .from('client_insights')
          .select('*')
          .eq('client_id', client.id)
          .order('last_analysis', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // If insights exist and are less than 24 hours old, use them
        if (existingInsights && 
            existingInsights.length > 0 && 
            new Date(existingInsights[0].last_analysis).getTime() > Date.now() - 24 * 60 * 60 * 1000) {
          setInsights(existingInsights[0]);
          return;
        }

        // Generate new insights using AI
        const prompt = `
          تحليل بيانات العميل التالية وتقديم توصيات:
          - الاسم: ${client.name}
          - الحالة: ${client.status}
          - المشروع المهتم به: ${client.project || 'غير محدد'}
          - الميزانية: ${client.budget || 'غير محددة'}
          - تاريخ التسجيل: ${client.createdAt}
          - التعليقات: ${client.comments?.join(', ') || 'لا يوجد'}

          المطلوب:
          1. تقييم احتمالية الشراء (نسبة مئوية)
          2. اقتراح أفضل وقت للتواصل
          3. اقتراح الخطوات التالية
          4. تقديم نصائح للتعامل مع العميل
        `;

        const aiResponse = await generateText(prompt);
        if (!aiResponse) throw new Error('Failed to generate insights');

        // Parse AI response and structure the data
        const purchaseProbability = parseFloat(aiResponse.match(/\d+%/)?.[0] || '0') || 0;
        const bestContactTime = aiResponse.match(/أفضل وقت للتواصل: (.*?)[\n\r]/)?.[1] || '';
        const nextSteps = aiResponse.match(/الخطوات التالية:([\s\S]*?)(?=\n\n|$)/)?.[1]
          ?.split('\n')
          .filter(step => step.trim())
          .map(step => step.trim().replace(/^-\s*/, '')) || [];

        const suggestedActions = {
          recommendations: aiResponse.match(/نصائح للتعامل:([\s\S]*?)(?=\n\n|$)/)?.[1]
            ?.split('\n')
            .filter(rec => rec.trim())
            .map(rec => rec.trim().replace(/^-\s*/, '')) || [],
        };

        // Save insights to database
        const { data: newInsights, error: insertError } = await supabase
          .from('client_insights')
          .insert({
            client_id: client.id,
            purchase_probability: purchaseProbability,
            best_contact_time: bestContactTime,
            next_steps: nextSteps,
            suggested_actions: suggestedActions,
            last_analysis: new Date().toISOString(),
          })
          .select();

        if (insertError) throw insertError;
        
        if (newInsights && newInsights.length > 0) {
          setInsights(newInsights[0]);
        }
        
      } catch (error) {
        console.error('Error analyzing client:', error);
        toast.error(t('errors.analysisError'));
      }
    };

    if (client.id) {
      analyzeClient();
    }
  }, [client.id, client.name, client.status, client.project, client.budget, client.createdAt, client.comments, generateText, t]);

  if (!insights) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle>{t('clients.insights.loading')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('clients.insights.purchaseProbability')}
            <Badge 
              variant={insights.purchase_probability > 70 ? "default" : 
                      insights.purchase_probability > 40 ? "secondary" : "destructive"}
              className="ml-2"
            >
              {insights.purchase_probability}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('clients.insights.bestTime')}: {insights.best_contact_time}
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">{t('clients.insights.nextSteps')}</h4>
              <ul className="list-disc list-inside space-y-1">
                {insights.next_steps?.map((step: string, index: number) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('clients.insights.recommendations')}</h4>
              <ul className="list-disc list-inside space-y-1">
                {insights.suggested_actions.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}