import { useTranslation } from "react-i18next";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useSidebar } from "@/components/ui/sidebar";

export default function Chat() {
  const { i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <div className={`flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-background ${isRTL ? "mr-64" : "ml-64"}`}>
        <div className="flex-1 overflow-hidden">
          <ChatMessages isRTL={isRTL} />
        </div>
        <ChatInput isRTL={isRTL} />
      </div>
    </DashboardLayout>
  );
}