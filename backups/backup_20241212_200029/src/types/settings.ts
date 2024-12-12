import { Json } from "@/integrations/supabase/types";

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  email: boolean;
}

export type NotificationSettingsJson = {
  [K in keyof NotificationSettings]: boolean;
}