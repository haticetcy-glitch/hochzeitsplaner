create table if not exists inquiries (
  id          uuid        default gen_random_uuid() primary key,
  vendor_id   uuid        references vendor_profiles(id),
  name        text        not null,
  email       text        not null,
  phone       text,
  event_type  text,
  event_date  date,
  message     text        not null,
  created_at  timestamp   default now()
);

alter table inquiries enable row level security;

create policy "Anyone can submit inquiry"
  on inquiries for insert with check (true);

create policy "Vendors can view own inquiries"
  on inquiries for select using (
    auth.uid() = vendor_id
  );
