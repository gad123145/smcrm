import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabaseCompanySync } from '@/lib/supabaseCompanySync';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export function SyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(
    localStorage.getItem('lastSyncTime')
  );
  const { toast } = useToast();
  const { user } = useUser();

  const handleSync = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Please login to sync data',
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const syncManager = new SupabaseCompanySync(user.id);
      const result = await syncManager.syncAll();

      if (result.success) {
        const now = new Date().toLocaleString();
        localStorage.setItem('lastSyncTime', now);
        setLastSyncTime(now);
        toast({
          title: 'Sync Successful',
          description: 'Your data has been synchronized successfully',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync data',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Data Synchronization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Last synced: {lastSyncTime || 'Never'}
          </p>
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              'Sync Now'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
