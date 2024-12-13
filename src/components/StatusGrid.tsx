import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "./StatusCard";
import { useClientStatuses } from "@/data/clientStatuses";
import { useTranslation } from "react-i18next";
import { useClientStore } from "@/data/clientsData";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const StatusGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const clientStatuses = useClientStatuses();
  const clients = useClientStore((state) => state.clients);
  const displayedStatuses = showAll ? clientStatuses : clientStatuses.slice(0, 4);

  // Fetch user role when component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    fetchUserRole();
  }, []);

  const getStatusCount = (status: string) => {
    try {
      console.log('Counting clients for status:', status);
      return clients.filter(client => {
        if (status === "all") return true;
        return client?.status?.toLowerCase() === status.toLowerCase();
      }).length;
    } catch (error) {
      console.error('Error counting clients:', error);
      return 0;
    }
  };

  const getTotalCount = () => {
    try {
      return clients.length;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  };

  const handleToggleDisplay = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={cn(
      "space-y-6",
      isRTL && "font-cairo"
    )}>
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        isRTL && "font-cairo"
      )}>
        {displayedStatuses.map((status) => (
          <StatusCard
            key={status.label}
            label={t(status.label)}
            count={getStatusCount(status.key)}
            total={getTotalCount()}
            Icon={status.icon}
            status={status.key}
          />
        ))}
      </div>

      <div className={cn(
        "flex justify-center",
        isRTL && "font-cairo"
      )}>
        <Button
          variant="outline"
          onClick={handleToggleDisplay}
          className={cn(
            "text-sm hover:bg-primary/10 dark:hover:bg-primary/20",
            "transition-all duration-300",
            isRTL && "font-cairo"
          )}
        >
          {showAll ? t("status.showLess") : t("status.showMore")}
        </Button>
      </div>
    </div>
  );
};