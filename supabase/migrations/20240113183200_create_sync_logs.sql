-- Create sync_logs table
create table if not exists public.sync_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    last_sync timestamp with time zone default now(),
    status text not null default 'success',
    details jsonb,
    error_details text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.sync_logs enable row level security;

create policy "Users can view their own sync logs"
    on public.sync_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own sync logs"
    on public.sync_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own sync logs"
    on public.sync_logs for update
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_sync_logs_updated_at
    before update on public.sync_logs
    for each row
    execute function public.handle_updated_at();
