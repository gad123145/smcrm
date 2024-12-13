create or replace function create_sync_logs_if_not_exists()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the table exists
  if not exists (
    select from pg_tables
    where schemaname = 'public'
    and tablename = 'sync_logs'
  ) then
    -- Create the table
    create table public.sync_logs (
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

    -- Add policies
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
    create trigger handle_sync_logs_updated_at
      before update on public.sync_logs
      for each row
      execute function public.handle_updated_at();
  end if;
end;
$$;
