-- Create sync_logs table
create table if not exists public.sync_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    last_sync timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'success'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
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

-- Create index for faster lookups
create index if not exists sync_logs_user_id_idx on public.sync_logs(user_id);
