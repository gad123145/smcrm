import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { supabase } from "@/integrations/supabase/client";
import { ClientInsightCard } from "../insights/ClientInsightCard";
import { ClientAnalysisButton } from "../analysis/ClientAnalysisButton";
import { useClientAnalysis } from "../analysis/useClientAnalysis";

interface ClientAnalysisTabProps {
  client: Client;
}

export function ClientAnalysisTab({ client }: ClientAnalysisTabProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { insights, setInsights, analyzeClient, isLoading } = useClientAnalysis(client);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data, error } = await supabase
          .from('client_insights')
          .select('*')
          .eq('client_id', client.id)
          .order('last_analysis', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const suggestedActions = data.suggested_actions as { recommendations: string[] } | null;
          
          setInsights({
            purchaseProbability: data.purchase_probability,
            bestContactTime: data.best_contact_time,
            recommendations: suggestedActions?.recommendations || [],
            nextSteps: data.next_steps || []
          });
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    };

    fetchInsights();
  }, [client.id, setInsights]);

  return (
    <div className="space-y-4">
      <ClientAnalysisButton
        onClick={analyzeClient}
        isLoading={isLoading}
        isRTL={isRTL}
      />
      {insights && <ClientInsightCard insight={insights} />}
    </div>
  );
}