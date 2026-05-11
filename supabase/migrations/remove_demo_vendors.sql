-- Remove demo/seed vendors that were never real listings
delete from vendors where slug in ('schloss-heidelberg-terrasse', 'gut-erlenbach');
