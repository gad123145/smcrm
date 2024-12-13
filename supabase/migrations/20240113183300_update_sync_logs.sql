-- Add details and error_details columns to sync_logs
alter table public.sync_logs
add column if not exists details jsonb,
add column if not exists error_details text;
