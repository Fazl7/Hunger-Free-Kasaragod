-- ════════════════════════════════════════════════════════════════════════
--  Gallery photos · migration (2026-11-26)
--  Run this file once in Supabase → SQL Editor → New query → Run.
--  Idempotent (safe to run again). Also included in schema.sql.
--  Photos are stored in the existing public "media" bucket (folder gallery/).
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.gallery_photos (
  id           uuid primary key default gen_random_uuid(),
  photo_url    text not null,   -- main image, max 1600px (WebP/JPEG)
  thumb_url    text not null,   -- 800px wide for the grid
  width        int  not null check (width > 0),
  height       int  not null check (height > 0),
  caption_en   text check (caption_en is null or length(caption_en) <= 300),
  caption_ml   text check (caption_ml is null or length(caption_ml) <= 300),
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists gallery_photos_public_idx on public.gallery_photos (is_published, sort_order, created_at desc);

alter table public.gallery_photos enable row level security;

-- The public sees PUBLISHED photos only; the admin sees and edits all.
drop policy if exists "public read published" on public.gallery_photos;
create policy "public read published" on public.gallery_photos for select to anon, authenticated
  using (is_published or public.is_admin());
drop policy if exists "admin write" on public.gallery_photos;
create policy "admin write" on public.gallery_photos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Drag-to-reorder (runs with the caller's rights, so RLS still decides).
create or replace function public.reorder_photos(ids uuid[])
returns void
language sql
security invoker
set search_path = public
as $$
  update gallery_photos p set sort_order = x.ord
  from unnest(ids) with ordinality as x(id, ord)
  where p.id = x.id;
$$;
revoke execute on function public.reorder_photos(uuid[]) from anon;
grant execute on function public.reorder_photos(uuid[]) to authenticated;
