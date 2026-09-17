export const SUPABASE_SETUP_SQL = `-- ==========================================
-- ShelfMap: Supabase Veritabanı & Depolama Kurulum Scripti
-- Bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp "Run" butonuna basın.
-- ==========================================

-- 1. containers (Konteyner / Lokasyon) Tablosu
create table if not exists public.containers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid(),
  name text not null,
  description text,
  parent_id uuid references public.containers(id) on delete cascade,
  image_url text,
  qr_code text unique,
  created_at timestamptz default now()
);

-- 2. items (Eşyalar / Parçalar) Tablosu
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid(),
  name text not null,
  category text default 'Genel',
  quantity integer default 1,
  container_id uuid references public.containers(id) on delete set null,
  image_url text,
  notes text,
  created_at timestamptz default now()
);

-- İndeksler (Hızlı arama ve hiyerarşi performansı için)
create index if not exists idx_containers_parent on public.containers(parent_id);
create index if not exists idx_containers_qr on public.containers(qr_code);
create index if not exists idx_items_container on public.items(container_id);
create index if not exists idx_items_name on public.items using gin (to_tsvector('simple', name));

-- 3. Row Level Security (RLS) Ayarları
alter table public.containers enable row level security;
alter table public.items enable row level security;

-- Anonim / Giriş Yapmış Kullanıcı İzinleri (Atölye/Kişisel kullanım için tam yetki)
drop policy if exists "containers_access" on public.containers;
create policy "containers_access" on public.containers
  for all using (true) with check (true);

drop policy if exists "items_access" on public.items;
create policy "items_access" on public.items
  for all using (true) with check (true);

-- 4. Storage (workshop-images) Bucket ve Politikaları
insert into storage.buckets (id, name, public)
values ('workshop-images', 'workshop-images', true)
on conflict (id) do nothing;

drop policy if exists "workshop_images_select" on storage.objects;
create policy "workshop_images_select" on storage.objects
  for select using (bucket_id = 'workshop-images');

drop policy if exists "workshop_images_insert" on storage.objects;
create policy "workshop_images_insert" on storage.objects
  for insert with check (bucket_id = 'workshop-images');

drop policy if exists "workshop_images_update" on storage.objects;
create policy "workshop_images_update" on storage.objects
  for update using (bucket_id = 'workshop-images');

drop policy if exists "workshop_images_delete" on storage.objects;
create policy "workshop_images_delete" on storage.objects
  for delete using (bucket_id = 'workshop-images');
`
