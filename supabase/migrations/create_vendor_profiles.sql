-- Vendor profiles linked to Supabase Auth users
create table if not exists vendor_profiles (
  id              uuid        references auth.users(id) on delete cascade primary key,
  email           text        not null,
  phone           text        not null default '',
  business_name   text        not null default '',
  category        text        not null default '',
  city            text        not null default '',
  website         text        default '',
  bio             text        default '',
  profile_image_url text      default '',
  portfolio_urls  text[]      default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Row Level Security
alter table vendor_profiles enable row level security;

create policy "Vendors can view own profile"
  on vendor_profiles for select
  using (auth.uid() = id);

create policy "Vendors can insert own profile"
  on vendor_profiles for insert
  with check (auth.uid() = id);

create policy "Vendors can update own profile"
  on vendor_profiles for update
  using (auth.uid() = id);

-- Auto-update updated_at on every write
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vendor_profiles_updated_at
  before update on vendor_profiles
  for each row execute function handle_updated_at();

-- Storage buckets (run these in the Supabase dashboard SQL editor or via API):
-- insert into storage.buckets (id, name, public) values ('vendor-avatars', 'vendor-avatars', true);
-- insert into storage.buckets (id, name, public) values ('vendor-portfolio', 'vendor-portfolio', true);
--
-- Storage RLS policies:
-- create policy "Vendors can upload own avatar"
--   on storage.objects for insert
--   with check (bucket_id = 'vendor-avatars' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Vendors can upload portfolio images"
--   on storage.objects for insert
--   with check (bucket_id = 'vendor-portfolio' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Public can view vendor assets"
--   on storage.objects for select
--   using (bucket_id in ('vendor-avatars', 'vendor-portfolio'));
