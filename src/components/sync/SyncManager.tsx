import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseSync } from '@/lib/syncService';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";

interface SyncDetails {
  clients: number;
  companies: number;
  properties: number;
  projects: number;
  tasks: number;
  notes: number;
  documents: number;
  activities: number;
  notifications: number;
  insights: number;
}

interface SyncLog {
  last_sync: string;
  status: 'success' | 'error';
  details?: SyncDetails;
  error_details?: string;
}

export function SyncManager() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncLog | null>(null);
  const [syncService, setSyncService] = useState<SupabaseSync | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const initializeSyncService = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const service = new SupabaseSync(user.id);
        setSyncService(service);
        const lastSyncTime = await service.getLastSyncTime();
        if (lastSyncTime) {
          const { data } = await supabase
            .from('sync_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('last_sync', { ascending: false })
            .limit(1)
            .single();
          
          setLastSync(data as SyncLog);
        }
      }
    };

    initializeSyncService();
  }, []);

  const handleSync = async () => {
    if (!syncService || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);
    
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      await syncService.syncData();
      setSyncProgress(100);
      
      // Fetch updated sync details
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sync_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('last_sync', { ascending: false })
          .limit(1)
          .single();
        
        setLastSync(data as SyncLog);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error(t('sync.error'));
    } finally {
      clearInterval(progressInterval);
      setIsSyncing(false);
      setTimeout(() => setSyncProgress(0), 1000);
    }
  };

  const formatSyncTime = (time: string) => {
    return new Date(time).toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn(
      "flex items-center gap-4",
      isRTL && "flex-row-reverse"
    )}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            data-sync-button
            className={cn(
              "flex items-center gap-2 min-w-[100px]",
              isRTL && "flex-row-reverse font-cairo"
            )}
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {syncProgress}%
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                {t('sync.button')}
              </>
            )}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent 
          className={cn(
            "w-80",
            isRTL && "font-cairo"
          )}
          align={isRTL ? "end" : "start"}
        >
          {lastSync ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('sync.lastSync')}:</span>
                <span className="text-sm text-muted-foreground">
                  {formatSyncTime(lastSync.last_sync)}
                </span>
              </div>
              
              {lastSync.status === 'success' && lastSync.details && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">{t('sync.syncedItems')}:</span>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(lastSync.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{t(`sync.items.${key}`)}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lastSync.status === 'error' && lastSync.error_details && (
                <div className="text-sm text-red-500">
                  {t('sync.errorDetails')}: {lastSync.error_details}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              {t('sync.noSyncYet')}
            </span>
          )}
        </HoverCardContent>
      </HoverCard>

      {syncProgress > 0 && (
        <Progress value={syncProgress} className="w-[100px]" />
      )}
    </div>
  );
}
