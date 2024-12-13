import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SyncService } from '@/lib/syncService';
import { supabase } from '@/integrations/supabase/client';

export function SyncManager() {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncService, setSyncService] = useState<SyncService | null>(null);

  useEffect(() => {
    const initializeSyncService = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error(t('errors.notAuthenticated'));
          return;
        }

        const newSyncService = new SyncService(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          user.id
        );

        setSyncService(newSyncService);
        
        // Set up auto-sync
        await newSyncService.setupAutoSync(5); // Sync every 5 minutes
        
        // Perform initial sync
        const initialSyncSuccess = await newSyncService.initialSync();
        if (initialSyncSuccess) {
          const syncTime = localStorage.getItem('last_sync_time');
          setLastSyncTime(syncTime);
          toast.success(t('sync.initialSyncComplete'));
        }
      } catch (error) {
        console.error('Error initializing sync:', error);
        toast.error(t('errors.syncInitFailed'));
      }
    };

    initializeSyncService();
  }, [t]);

  const handleManualSync = async () => {
    if (!syncService) {
      toast.error(t('errors.syncServiceNotInitialized'));
      return;
    }

    setIsSyncing(true);
    try {
      // Sync to cloud first
      const uploadResult = await syncService.syncToCloud();
      if (!uploadResult.success) {
        throw new Error(uploadResult.message);
      }

      // Then sync from cloud
      const downloadResult = await syncService.syncFromCloud();
      if (!downloadResult.success) {
        throw new Error(downloadResult.message);
      }

      const syncTime = localStorage.getItem('last_sync_time');
      setLastSyncTime(syncTime);
      toast.success(t('sync.syncComplete'));
    } catch (error: any) {
      console.error('Manual sync error:', error);
      toast.error(t('errors.syncFailed') + ': ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={handleManualSync}
        disabled={isSyncing}
        className="relative"
      >
        {isSyncing ? t('sync.syncing') : t('sync.syncNow')}
      </Button>
      {lastSyncTime && (
        <span className="text-sm text-gray-500">
          {t('sync.lastSync')}: {new Date(lastSyncTime).toLocaleString()}
        </span>
      )}
    </div>
  );
}
