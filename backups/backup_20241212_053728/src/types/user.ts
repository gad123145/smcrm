export type User = {
  id: string;
  full_name: string | null;
  role: string | null;
  status: string | null;
  avatar: string | null;
  email: string | null;
  created_at?: string;
  updated_at?: string;
  company_id?: string | null;
  notification_settings?: Record<string, any> | null;
};