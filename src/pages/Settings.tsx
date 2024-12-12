import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSettings, NotificationSettingsJson } from "@/types/settings";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isRTL = i18n.language === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', session.user.id)
        .single();

      if (profile?.notification_settings) {
        const settings = profile.notification_settings as { [key: string]: boolean };
        setNotificationsEnabled(Boolean(settings.enabled));
        setSoundEnabled(Boolean(settings.sound));
        setEmailEnabled(Boolean(settings.email));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t("common.errors.unauthorized"));
        return;
      }

      const settings: NotificationSettingsJson = {
        enabled: notificationsEnabled,
        sound: soundEnabled,
        email: emailEnabled
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success(t("settings.notifications.saveSuccess"));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t("common.errors.saveFailed"));
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent>
        <div className={cn(
          "container mx-auto p-4 space-y-4",
          isRTL && "font-cairo"
        )} dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.theme.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("settings.theme.light")}</Label>
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    size="sm"
                  >
                    {t("settings.theme.light")}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t("settings.theme.dark")}</Label>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    size="sm"
                  >
                    {t("settings.theme.dark")}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t("settings.theme.system")}</Label>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    size="sm"
                  >
                    {t("settings.theme.system")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSwitcher />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.notifications.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("settings.notifications.enable")}</Label>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t("settings.notifications.sound")}</Label>
                  <Switch 
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t("settings.notifications.email")}</Label>
                  <Switch 
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  className="w-full mt-4"
                >
                  {t("settings.notifications.save")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.profile.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("settings.profile.name")}</Label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.profile.email")}</Label>
                  <Input type="email" />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.profile.role")}</Label>
                  <Input disabled />
                </div>
                <Button className="w-full">
                  {t("settings.profile.save")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
};
