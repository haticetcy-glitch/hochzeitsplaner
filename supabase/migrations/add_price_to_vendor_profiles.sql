-- Add price_from column to vendor_profiles
alter table vendor_profiles
  add column if not exists price_from integer default null;
