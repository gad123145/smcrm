import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ActiveUsers = () => {
  const { t, i18n } = useTranslation();
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: activeData } = await supabase
        .from('profiles')
        .select('count')
        .eq('status', 'active');
      
      const { data: inactiveData } = await supabase
        .from('profiles')
        .select('count')
        .eq('status', 'inactive');

      if (activeData) setActiveUsers(Number(activeData[0]?.count || 0));
      if (inactiveData) setInactiveUsers(Number(inactiveData[0]?.count || 0));
    };

    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {t("dashboard.activeUsers")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {t("dashboard.activeUsers")}
              </span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {activeUsers}
            </span>
          </div>
          <div className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'}`}>
            <span className="text-gray-700 dark:text-gray-300">
              {t("dashboard.inactiveUsers")}
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {inactiveUsers}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};