-- Allow inquiries from the old /[category]/[slug] route where vendor_id
-- comes from the old "vendors" table (not vendor_profiles).
-- Without this, the FK constraint rejects those inserts entirely.
alter table inquiries alter column vendor_id drop not null;
