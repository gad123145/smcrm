import { Metadata } from 'next';
import { SyncStatus } from '@/components/sync/SyncStatus';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your application settings',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Data Synchronization</h2>
          <SyncStatus />
        </section>
      </div>
    </div>
  );
}
