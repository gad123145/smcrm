import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { SupabaseSync } from '@/lib/supabaseSync';
import { SupabaseCompanySync } from '@/lib/supabaseCompanySync';

export function SupabaseSyncManager() {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncService, setSyncService] = useState<SupabaseSync | null>(null);
  const [companySync, setCompanySync] = useState<SupabaseCompanySync | null>(null);

  useEffect(() => {
    const initializeSyncService = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error(t('errors.notAuthenticated'));
          return;
        }

        const newSyncService = new SupabaseSync(user.id);
        const newCompanySync = new SupabaseCompanySync(user.id);
        
        setSyncService(newSyncService);
        setCompanySync(newCompanySync);
        
        // Set up auto-sync
        await newSyncService.setupAutoSync(5); // Sync every 5 minutes
        
        // Perform initial sync
        const initialSyncSuccess = await newSyncService.initialSync();
        if (initialSyncSuccess) {
          const syncTime = localStorage.getItem('last_sync_time');
          setLastSyncTime(syncTime);
          toast.success(t('sync.initialSyncComplete'));
        }

        // Initial company and project sync
        await newCompanySync.syncAll();
      } catch (error) {
        console.error('Error initializing sync:', error);
        toast.error(t('errors.syncInitFailed'));
      }
    };

    initializeSyncService();
  }, [t]);

  const handleManualSync = async () => {
    if (!syncService || !companySync) {
      toast.error(t('errors.syncServiceNotInitialized'));
      return;
    }

    setIsSyncing(true);
    try {
      // Sync clients
      const uploadResult = await syncService.syncToCloud();
      if (!uploadResult.success) {
        throw new Error(uploadResult.message);
      }

      const downloadResult = await syncService.syncFromCloud();
      if (!downloadResult.success) {
        throw new Error(downloadResult.message);
      }

      // Sync companies and projects
      const companySyncResult = await companySync.syncAll();
      if (!companySyncResult.success) {
        throw new Error(companySyncResult.message);
      }

      const syncTime = new Date().toISOString();
      localStorage.setItem('last_sync_time', syncTime);
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
        {isSyncing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('sync.syncing')}
          </span>
        ) : (
          t('sync.syncNow')
        )}
      </Button>
      {lastSyncTime && (
        <span className="text-sm text-gray-500">
          {t('sync.lastSync')}: {new Date(lastSyncTime).toLocaleString()}
        </span>
      )}
    </div>
  );
}
