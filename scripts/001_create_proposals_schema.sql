-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  company_name text,
  created_at timestamp with time zone default now()
);

-- Create proposals table
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  client_name text,
  description text,
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create sections table
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  type text not null,
  title text not null,
  content jsonb,
  order_index integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create templates table
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  sections jsonb,
  design_settings jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create shares table
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  share_token text unique not null,
  password_hash text,
  expires_at timestamp with time zone,
  last_viewed_at timestamp with time zone,
  view_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Create analytics table
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  section_id uuid references public.sections(id) on delete cascade,
  event_type text,
  viewer_id text,
  timestamp timestamp with time zone default now(),
  metadata jsonb
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.proposals enable row level security;
alter table public.sections enable row level security;
alter table public.templates enable row level security;
alter table public.shares enable row level security;
alter table public.analytics enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- RLS Policies for proposals
create policy "proposals_select_own" on public.proposals for select using (auth.uid() = user_id);
create policy "proposals_insert_own" on public.proposals for insert with check (auth.uid() = user_id);
create policy "proposals_update_own" on public.proposals for update using (auth.uid() = user_id);
create policy "proposals_delete_own" on public.proposals for delete using (auth.uid() = user_id);

-- RLS Policies for sections
create policy "sections_select_own" on public.sections for select using (
  exists (select 1 from public.proposals where proposals.id = sections.proposal_id and proposals.user_id = auth.uid())
);
create policy "sections_insert_own" on public.sections for insert with check (
  exists (select 1 from public.proposals where proposals.id = sections.proposal_id and proposals.user_id = auth.uid())
);
create policy "sections_update_own" on public.sections for update using (
  exists (select 1 from public.proposals where proposals.id = sections.proposal_id and proposals.user_id = auth.uid())
);
create policy "sections_delete_own" on public.sections for delete using (
  exists (select 1 from public.proposals where proposals.id = sections.proposal_id and proposals.user_id = auth.uid())
);

-- RLS Policies for templates
create policy "templates_select_own" on public.templates for select using (auth.uid() = user_id);
create policy "templates_insert_own" on public.templates for insert with check (auth.uid() = user_id);
create policy "templates_update_own" on public.templates for update using (auth.uid() = user_id);
create policy "templates_delete_own" on public.templates for delete using (auth.uid() = user_id);

-- RLS Policies for analytics (users can see analytics for their own proposals)
create policy "analytics_select_own" on public.analytics for select using (
  exists (select 1 from public.proposals where proposals.id = analytics.proposal_id and proposals.user_id = auth.uid())
);
create policy "analytics_insert_any" on public.analytics for insert with check (true);

-- Create profiles automatically on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
