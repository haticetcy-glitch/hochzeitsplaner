-- Creates auth user + vendor profile for L'IMAGE Fotografie (Rojda K.)
-- Run this in the Supabase Dashboard → SQL Editor

do $$
declare
  v_user_id uuid := gen_random_uuid();
begin

  -- 1. Create the auth user (email confirmed, temp password: LImage2026!)
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'limagefotografie16@gmail.com',
    crypt('LImage2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(),
    now(),
    '', '', '', ''
  );

  -- 2. Create identity record so email login works
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    v_user_id,
    v_user_id,
    json_build_object(
      'sub', v_user_id::text,
      'email', 'limagefotografie16@gmail.com'
    ),
    'email',
    now(),
    now(),
    now()
  );

  -- 3. Create vendor profile
  insert into vendor_profiles (
    id,
    email,
    phone,
    business_name,
    category,
    city,
    website,
    bio,
    price_from,
    profile_image_url,
    portfolio_urls,
    created_at,
    updated_at
  ) values (
    v_user_id,
    'limagefotografie16@gmail.com',
    '',
    'L''IMAGE Fotografie',
    'Fotografen',
    'Wiesbaden / Frankfurt · Worldwide',
    'https://www.limagefotografie.de/',
    'Hi, ich bin Rojda – Fotografin aus Leidenschaft und Gründerin von L''IMAGE Fotografie. Seit 2016 begleite ich mit viel Liebe zum Detail und einem Blick für echte Emotionen Paare an ihrem großen Tag. Mein Fokus liegt auf der Hochzeitsfotografie – von der emotionalen Vorbereitung bis zur lebendigen Feier. Dabei ist es mir besonders wichtig, authentische Augenblicke einzufangen: das Lachen, die Freudentränen, zärtliche Blicke – all das, was eure Geschichte erzählt.',
    3000,
    '',
    '{}',
    now(),
    now()
  );

  raise notice 'Profil angelegt für user_id: %', v_user_id;
end;
$$;
