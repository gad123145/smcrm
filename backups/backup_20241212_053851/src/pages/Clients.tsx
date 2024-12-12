import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { ClientsList } from "@/components/ClientsList";
import { useState } from "react";
import { formSchema } from "@/components/forms/formSchema";
import { z } from "zod";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { cn } from "@/lib/utils";

const Clients = () => {
  const { status = "new" } = useParams<{ status: z.infer<typeof formSchema>["status"] }>();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Enable realtime subscription for clients table
  useRealtimeSubscription('clients', ['clients']);

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        <DashboardSidebar open={sidebarOpen} />
        <main className={cn(
          "flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out",
          sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "m-0"
        )}>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{t(`status.${status}`)}</h1>
            </div>

            <ClientsList 
              status={status}
              searchQuery={searchQuery}
              showFavorites={showFavorites}
              selectedUser={selectedUser}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Clients;