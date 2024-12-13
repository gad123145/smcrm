import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ClientCommentsTabProps {
  client: Client;
}

interface Action {
  id: string;
  action_type: string;
  comment: string;
  created_at: string;
  created_by: string;
}

export function ClientCommentsTab({ client }: ClientCommentsTabProps) {
  const { t, i18n } = useTranslation();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchActions = async () => {
      const { data, error } = await supabase
        .from("client_actions")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching actions:", error);
      } else {
        setActions(data || []);
      }
      setLoading(false);
    };

    fetchActions();
  }, [client.id]);

  if (loading) {
    return <div className="text-center py-4">{t("common.loading")}</div>;
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {isRTL ? "لا توجد تعليقات" : "No comments"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <Card key={action.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">
                  {t(`clients.status.${action.action_type}`)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(action.created_at), "yyyy-MM-dd HH:mm")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{action.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}