export type TimeRange = "daily" | "weekly" | "monthly";

export interface TopUser {
  user_id: string;
  full_name: string | null;
  avatar: string | null;
  role: string | null;
  action_count: number;
}