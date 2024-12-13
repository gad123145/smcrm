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
    let mounted = true;

    const initializeSyncService = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error(t('errors.sessionError'));
          return;
        }

        if (!session?.user) {
          console.log('No active session');
          toast.error(t('errors.notAuthenticated'));
          return;
        }

        if (!mounted) return;

        const newSyncService = new SupabaseSync(session.user.id);
        const newCompanySync = new SupabaseCompanySync(session.user.id);
        
        setSyncService(newSyncService);
        setCompanySync(newCompanySync);
        
        // Perform initial sync
        await handleManualSync();

        // Set up auto-sync
        const autoSyncInterval = setInterval(() => {
          if (mounted) {
            handleManualSync();
          }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(autoSyncInterval);
      } catch (error) {
        console.error('Error initializing sync:', error);
        if (mounted) {
          toast.error(t('errors.syncInitFailed'));
        }
      }
    };

    initializeSyncService();

    return () => {
      mounted = false;
    };
  }, [t]);

  const handleManualSync = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error(t('errors.notAuthenticated'));
      return;
    }

    if (!syncService || !companySync) {
      console.error('Sync services not initialized');
      toast.error(t('errors.syncServiceNotInitialized'));
      return;
    }

    if (isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    setIsSyncing(true);
    try {
      // Sync clients
      console.log('Starting client sync...');
      const clientUploadResult = await syncService.syncToCloud();
      if (!clientUploadResult.success) {
        throw new Error(clientUploadResult.message || 'Client upload failed');
      }

      const clientDownloadResult = await syncService.syncFromCloud();
      if (!clientDownloadResult.success) {
        throw new Error(clientDownloadResult.message || 'Client download failed');
      }
      console.log('Client sync completed');

      // Sync companies and projects
      console.log('Starting company and project sync...');
      const companySyncResult = await companySync.syncAll();
      if (!companySyncResult.success) {
        throw new Error(companySyncResult.message || 'Company sync failed');
      }
      console.log('Company and project sync completed');

      const syncTime = new Date().toISOString();
      localStorage.setItem('last_sync_time', syncTime);
      setLastSyncTime(syncTime);
      toast.success(t('sync.syncComplete'));
    } catch (error: any) {
      console.error('Manual sync error:', error);
      toast.error(t('errors.syncFailed') + ': ' + (error.message || 'Unknown error'));
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
