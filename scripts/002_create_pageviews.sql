-- Pageview analytics ---------------------------------------------------------
-- First-party tracking. No third-party scripts, no IP storage. We salt+hash
-- IP+UA into a daily session_id so we can compute uniques without retaining
-- PII. Admin-only RLS. Service-role inserts via the /api/track/pageview API.

create table if not exists public.pageviews (
  id uuid primary key default gen_random_uuid(),
  -- identity (privacy-preserving)
  visitor_id text,                  -- daily-rotating hash of IP+UA
  session_id text,                  -- per-session cookie

  -- request
  path text not null,
  referrer text,
  ref_host text,                    -- normalized host of referrer ('google', 'facebook', etc.)
  source text,                      -- 'organic' | 'paid' | 'social' | 'referral' | 'email' | 'direct'

  -- utm
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  -- environment
  country text,                     -- ISO-2, e.g. 'US'
  device text,                      -- 'mobile' | 'tablet' | 'desktop'
  browser text,
  os text,

  is_bot boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pageviews_created_idx on public.pageviews (created_at desc);
create index if not exists pageviews_path_idx on public.pageviews (path);
create index if not exists pageviews_source_idx on public.pageviews (source);
create index if not exists pageviews_ref_host_idx on public.pageviews (ref_host);
create index if not exists pageviews_visitor_idx on public.pageviews (visitor_id);

alter table public.pageviews enable row level security;

drop policy if exists "admin_select_pageviews" on public.pageviews;
create policy "admin_select_pageviews" on public.pageviews
  for select to authenticated using (public.is_super_admin());
