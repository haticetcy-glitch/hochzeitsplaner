-- Allow public (unauthenticated) read access to vendor profiles.
-- Required for the public marketplace directory (/anbieter/[id]) and search (/suche).
-- The existing "Vendors can view own profile" policy remains for authenticated vendors.
create policy "Public can view all vendor profiles"
  on vendor_profiles for select
  using (true);
