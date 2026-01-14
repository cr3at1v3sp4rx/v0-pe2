-- Fix and improve RLS policies for proper data isolation

-- Drop existing policies
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "proposals_select_own" on public.proposals;
drop policy if exists "proposals_insert_own" on public.proposals;
drop policy if exists "proposals_update_own" on public.proposals;
drop policy if exists "proposals_delete_own" on public.proposals;
drop policy if exists "sections_select_own" on public.sections;
drop policy if exists "sections_insert_own" on public.sections;
drop policy if exists "sections_update_own" on public.sections;
drop policy if exists "sections_delete_own" on public.sections;
drop policy if exists "templates_select_own" on public.templates;
drop policy if exists "templates_insert_own" on public.templates;
drop policy if exists "templates_update_own" on public.templates;
drop policy if exists "templates_delete_own" on public.templates;
drop policy if exists "analytics_select_own" on public.analytics;
drop policy if exists "analytics_insert_any" on public.analytics;

-- Recreate policies with better names and conditions

-- Profiles: Users can only access their own profile
create policy "profiles_read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_create" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- Proposals: Users can only access their own proposals
create policy "proposals_read" on public.proposals
  for select using (auth.uid() = user_id);

create policy "proposals_create" on public.proposals
  for insert with check (auth.uid() = user_id);

create policy "proposals_update" on public.proposals
  for update using (auth.uid() = user_id);

create policy "proposals_delete" on public.proposals
  for delete using (auth.uid() = user_id);

-- Sections: Users can access sections of their own proposals
create policy "sections_read" on public.sections
  for select using (
    exists (
      select 1 from public.proposals 
      where proposals.id = sections.proposal_id 
      and proposals.user_id = auth.uid()
    )
  );

create policy "sections_create" on public.sections
  for insert with check (
    exists (
      select 1 from public.proposals 
      where proposals.id = sections.proposal_id 
      and proposals.user_id = auth.uid()
    )
  );

create policy "sections_update" on public.sections
  for update using (
    exists (
      select 1 from public.proposals 
      where proposals.id = sections.proposal_id 
      and proposals.user_id = auth.uid()
    )
  );

create policy "sections_delete" on public.sections
  for delete using (
    exists (
      select 1 from public.proposals 
      where proposals.id = sections.proposal_id 
      and proposals.user_id = auth.uid()
    )
  );

-- Templates: Users can only access their own templates
create policy "templates_read" on public.templates
  for select using (auth.uid() = user_id);

create policy "templates_create" on public.templates
  for insert with check (auth.uid() = user_id);

create policy "templates_update" on public.templates
  for update using (auth.uid() = user_id);

create policy "templates_delete" on public.templates
  for delete using (auth.uid() = user_id);

-- Analytics: Users can see analytics for their own proposals
create policy "analytics_read" on public.analytics
  for select using (
    exists (
      select 1 from public.proposals 
      where proposals.id = analytics.proposal_id 
      and proposals.user_id = auth.uid()
    )
  );

-- Anyone can write analytics (for client viewing)
create policy "analytics_create" on public.analytics
  for insert with check (true);
