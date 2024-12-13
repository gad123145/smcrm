import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
        const autoSyncInterval = 5; // minutes
        setInterval(() => {
          handleManualSync();
        }, autoSyncInterval * 60 * 1000);
        
        // Perform initial sync
        await handleManualSync();
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
      console.log('Starting client sync...');
      const clientUploadResult = await syncService.syncToCloud();
      if (!clientUploadResult.success) {
        throw new Error(clientUploadResult.message);
      }

      const clientDownloadResult = await syncService.syncFromCloud();
      if (!clientDownloadResult.success) {
        throw new Error(clientDownloadResult.message);
      }
      console.log('Client sync completed');

      // Sync companies and projects
      console.log('Starting company and project sync...');
      const companySyncResult = await companySync.syncAll();
      if (!companySyncResult.success) {
        throw new Error(companySyncResult.message);
      }
      console.log('Company and project sync completed');

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
