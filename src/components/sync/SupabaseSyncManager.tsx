import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseSync } from '@/lib/supabaseSync';
import { cn } from '@/lib/utils';

export function SupabaseSyncManager() {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncService, setSyncService] = useState<SupabaseSync | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSyncService = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('خطأ في الجلسة:', sessionError);
          toast.error(t('errors.sessionError'));
          return;
        }

        if (!session?.user) {
          console.log('لا توجد جلسة نشطة');
          toast.error(t('errors.notAuthenticated'));
          return;
        }

        if (!mounted) return;

        const newSyncService = new SupabaseSync(session.user.id);
        setSyncService(newSyncService);
        
        // المزامنة الأولية
        await handleManualSync();

        // إعداد المزامنة التلقائية
        const autoSyncInterval = setInterval(() => {
          if (mounted) {
            handleManualSync();
          }
        }, 5 * 60 * 1000); // كل 5 دقائق

        return () => clearInterval(autoSyncInterval);
      } catch (error) {
        console.error('خطأ في تهيئة خدمة المزامنة:', error);
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

    if (!syncService) {
      console.error('خدمة المزامنة غير مهيأة');
      toast.error(t('errors.syncServiceNotInitialized'));
      return;
    }

    if (isSyncing) {
      console.log('المزامنة قيد التنفيذ');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('بدء المزامنة...');
      const syncResult = await syncService.syncAll();
      
      if (!syncResult.success) {
        throw new Error(syncResult.message || 'فشلت المزامنة');
      }

      const syncTime = new Date().toISOString();
      localStorage.setItem('last_sync_time', syncTime);
      setLastSyncTime(syncTime);
      toast.success(t('sync.syncComplete'));
    } catch (error: any) {
      console.error('خطأ في المزامنة اليدوية:', error);
      toast.error(t('errors.syncFailed') + ': ' + (error.message || 'خطأ غير معروف'));
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
        <span className={cn(
          "text-sm text-gray-500",
          "font-cairo"
        )}>
          {t('sync.lastSync')}: {new Date(lastSyncTime).toLocaleString()}
        </span>
      )}
    </div>
  );
}
