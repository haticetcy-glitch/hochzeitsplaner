-- =============================================
-- HOCHZEITSPLANER.DE — Supabase Schema
-- Run in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- CATEGORIES
-- =============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,         -- 'fotografen', 'locations', 'floristik'
  name text not null,                -- 'Fotografen', 'Locations'
  icon text,                         -- emoji or icon name
  description text,
  sort_order int default 0
);

insert into categories (slug, name, icon, sort_order) values
  ('locations',    'Locations',      '📍', 1),
  ('fotografen',   'Fotografen',     '📷', 2),
  ('floristik',    'Floristik',      '🌸', 3),
  ('catering',     'Catering',       '🍽️', 4),
  ('musik',        'DJ & Musik',     '🎵', 5),
  ('hair-makeup',  'Hair & Make-up', '💄', 6),
  ('dekoration',   'Dekoration',     '✨', 7),
  ('torte',        'Hochzeitstorte', '🎂', 8);

-- =============================================
-- VENDORS (Anbieter)
-- =============================================
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Identity
  slug text unique not null,
  name text not null,
  tagline text,
  description text,

  -- Category
  category_id uuid references categories(id),

  -- Location
  city text not null,
  state text,                        -- 'Baden-Württemberg'
  zip text,
  lat numeric(9,6),
  lng numeric(9,6),
  service_radius_km int default 50,  -- how far they travel

  -- Contact
  email text,
  phone text,
  website text,
  instagram text,

  -- Media
  cover_image_url text,
  gallery_urls text[] default '{}',

  -- Pricing
  price_from int,                    -- starting price in EUR
  price_to int,
  price_unit text default 'pauschal', -- 'pauschal', 'pro Stunde', 'pro Person'

  -- Meta
  is_featured boolean default false,
  is_verified boolean default false,
  is_active boolean default true,
  plan text default 'free',          -- 'free', 'premium', 'featured'

  -- Stats
  views_count int default 0,
  inquiry_count int default 0,

  -- Tags (searchable)
  tags text[] default '{}'
);

-- Indexes for common queries
create index vendors_city_idx on vendors(city);
create index vendors_category_idx on vendors(category_id);
create index vendors_featured_idx on vendors(is_featured) where is_featured = true;
create index vendors_active_idx on vendors(is_active) where is_active = true;

-- Full-text search
alter table vendors add column search_vector tsvector
  generated always as (
    to_tsvector('german', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(description,'') || ' ' || coalesce(city,''))
  ) stored;
create index vendors_search_idx on vendors using gin(search_vector);

-- =============================================
-- REVIEWS
-- =============================================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  vendor_id uuid references vendors(id) on delete cascade,
  reviewer_name text not null,
  rating int check (rating between 1 and 5),
  text text,
  wedding_date date,
  is_approved boolean default false
);

create index reviews_vendor_idx on reviews(vendor_id);

-- Auto-computed rating view
create view vendor_ratings as
  select
    vendor_id,
    round(avg(rating)::numeric, 1) as avg_rating,
    count(*) as review_count
  from reviews
  where is_approved = true
  group by vendor_id;

-- =============================================
-- INQUIRIES (Anfragen von Paaren)
-- =============================================
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  vendor_id uuid references vendors(id) on delete cascade,

  -- Couple info
  partner1_name text not null,
  partner2_name text,
  email text not null,
  phone text,

  -- Wedding details
  wedding_date date,
  guest_count int,
  location_city text,
  budget_range text,
  message text,

  -- Status
  status text default 'new',        -- 'new', 'read', 'replied', 'booked', 'closed'
  vendor_notes text
);

create index inquiries_vendor_idx on inquiries(vendor_id);
create index inquiries_status_idx on inquiries(status);

-- =============================================
-- BLOG POSTS (SEO-Content)
-- =============================================
create table posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  tags text[] default '{}',
  city text,                         -- for city-specific articles
  is_published boolean default false,
  published_at timestamptz,
  views_count int default 0
);

create index posts_slug_idx on posts(slug);
create index posts_published_idx on posts(is_published) where is_published = true;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table vendors enable row level security;
alter table reviews enable row level security;
alter table inquiries enable row level security;

-- Public can read active vendors
create policy "Public read active vendors"
  on vendors for select
  using (is_active = true);

-- Public can read approved reviews
create policy "Public read approved reviews"
  on reviews for select
  using (is_approved = true);

-- Anyone can submit inquiry
create policy "Anyone can submit inquiry"
  on inquiries for insert
  with check (true);

-- =============================================
-- SEED DATA (Demo)
-- =============================================
insert into vendors (slug, name, tagline, description, city, state, price_from, price_to, price_unit, is_featured, is_verified, plan, tags, category_id)
select
  'miel-studio',
  'Miel Studio',
  'Authentische Hochzeitsfotografie im Rhein-Neckar-Raum',
  'Ich glaube, dass die schönsten Momente die echten sind — ungestellt, voller Gefühl. Mit einem Auge für Licht, Komposition und Emotionen halte ich euren besonderen Tag fest.',
  'Mannheim', 'Baden-Württemberg', 1200, 2800, 'pauschal',
  true, true, 'featured',
  ARRAY['Editorial', 'Film-Look', 'Reportage', 'On-Location'],
  id from categories where slug = 'fotografen';

insert into vendors (slug, name, tagline, description, city, state, price_from, price_to, price_unit, is_featured, plan, tags, category_id)
select
  'schloss-heidelberg-terrasse',
  'Schloss Heidelberg Terrasse',
  'Heiraten mit Blick über die Altstadt',
  'Die romantischste Kulisse Deutschlands für eure Traumhochzeit. Mit Blick über die Heidelberger Altstadt und den Neckar bieten wir unvergessliche Momente für bis zu 200 Gäste.',
  'Heidelberg', 'Baden-Württemberg', 2500, 8000, 'pauschal',
  true, 'premium',
  ARRAY['Outdoor', 'Historisch', 'Panorama', 'Sommer'],
  id from categories where slug = 'locations';

insert into vendors (slug, name, tagline, description, city, state, price_from, price_to, price_unit, plan, tags, category_id)
select
  'gut-erlenbach',
  'Gut Erlenbach',
  'Natürliche Scheunen-Hochzeiten in der Natur',
  'Euer Ja-Wort inmitten von Weinbergen und Streuobstwiesen. Authentisch, nachhaltig, unvergesslich.',
  'Weinheim', 'Baden-Württemberg', 1800, 5500, 'pauschal',
  'premium',
  ARRAY['Scheune', 'Natur', 'Boho', 'Nachhaltig'],
  id from categories where slug = 'locations';
