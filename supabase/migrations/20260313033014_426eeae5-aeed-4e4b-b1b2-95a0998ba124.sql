
-- Profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  company_name text,
  company_document text,
  company_phone text,
  company_email text,
  company_website text,
  company_address text,
  logo_url text,
  primary_color text default '#2563EB',
  secondary_color text default '#0F1724',
  niche text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- User usage table
create table public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  proposals_count integer default 0,
  period_start date default date_trunc('month', current_date),
  updated_at timestamp with time zone default now()
);

alter table public.user_usage enable row level security;

create policy "Users can view own usage" on public.user_usage for select using (auth.uid() = user_id);
create policy "Users can update own usage" on public.user_usage for update using (auth.uid() = user_id);

-- Proposals table
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  client_name text,
  client_email text,
  client_phone text,
  client_company text,
  niche text,
  service_description text,
  deliverables text,
  total_value numeric,
  payment_terms text,
  deadline_days integer,
  validity_days integer default 15,
  content jsonb,
  pdf_url text,
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.proposals enable row level security;

create policy "Users can view own proposals" on public.proposals for select using (auth.uid() = user_id);
create policy "Users can insert own proposals" on public.proposals for insert with check (auth.uid() = user_id);
create policy "Users can update own proposals" on public.proposals for update using (auth.uid() = user_id);
create policy "Users can delete own proposals" on public.proposals for delete using (auth.uid() = user_id);

-- Proposal sections table
create table public.proposal_sections (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references public.proposals(id) on delete cascade not null,
  section_key text,
  section_title text,
  content text,
  order_index integer,
  updated_at timestamp with time zone default now()
);

alter table public.proposal_sections enable row level security;

create policy "Users can view own proposal sections" on public.proposal_sections for select
  using (exists (select 1 from public.proposals where proposals.id = proposal_sections.proposal_id and proposals.user_id = auth.uid()));
create policy "Users can insert own proposal sections" on public.proposal_sections for insert
  with check (exists (select 1 from public.proposals where proposals.id = proposal_sections.proposal_id and proposals.user_id = auth.uid()));
create policy "Users can update own proposal sections" on public.proposal_sections for update
  using (exists (select 1 from public.proposals where proposals.id = proposal_sections.proposal_id and proposals.user_id = auth.uid()));
create policy "Users can delete own proposal sections" on public.proposal_sections for delete
  using (exists (select 1 from public.proposals where proposals.id = proposal_sections.proposal_id and proposals.user_id = auth.uid()));

-- Trigger to auto-create profile and usage on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  
  insert into public.user_usage (user_id)
  values (new.id);
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for logos
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Storage policies for logos
create policy "Users can upload logos" on storage.objects for insert
  with check (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update logos" on storage.objects for update
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Anyone can view logos" on storage.objects for select
  using (bucket_id = 'logos');

-- Storage bucket for PDFs
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);

create policy "Users can upload pdfs" on storage.objects for insert
  with check (bucket_id = 'pdfs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Anyone can view pdfs" on storage.objects for select
  using (bucket_id = 'pdfs');
