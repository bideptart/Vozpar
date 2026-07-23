-- 9278.ai super-admin schema
-- Customers, Stripe payments, and phone numbers (DIDs).

create extension if not exists "pgcrypto";

-- =====================================================================
-- customers: every paying or signed-up user.  Identified by email.
-- =====================================================================
create table if not exists public.customers (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  full_name           text,
  company             text,
  industry            text,
  use_case            text,
  stripe_customer_id  text unique,
  -- last plan they purchased
  plan_id             text,
  agents              integer,
  rate_per_min_cents  integer,
  signup_source       text,         -- 'pricing' | 'get-started' | 'manual'
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists customers_email_idx           on public.customers (email);
create index if not exists customers_stripe_customer_idx on public.customers (stripe_customer_id);
create index if not exists customers_plan_idx            on public.customers (plan_id);
create index if not exists customers_created_at_idx      on public.customers (created_at desc);

-- =====================================================================
-- payments: one row per Stripe successful or refunded charge.
-- =====================================================================
create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  customer_id              uuid references public.customers(id) on delete set null,
  stripe_session_id        text unique,
  stripe_payment_intent_id text,
  stripe_invoice_id        text,
  type                     text not null,        -- 'plan_credit' | 'phone_subscription'
  plan_id                  text,
  amount_cents             integer not null,
  amount_refunded_cents    integer not null default 0,
  currency                 text not null default 'usd',
  status                   text not null,        -- 'succeeded' | 'refunded' | 'failed' | 'pending'
  description              text,
  created_at               timestamptz not null default now()
);

create index if not exists payments_customer_idx     on public.payments (customer_id);
create index if not exists payments_status_idx       on public.payments (status);
create index if not exists payments_created_at_idx   on public.payments (created_at desc);
create index if not exists payments_type_idx         on public.payments (type);

-- =====================================================================
-- phone_numbers: every DID assigned to a customer.
-- =====================================================================
create table if not exists public.phone_numbers (
  id                       uuid primary key default gen_random_uuid(),
  customer_id              uuid references public.customers(id) on delete cascade,
  region_id                text not null,        -- 'us' | 'ca' | 'uk' | 'eu'
  region_label             text not null,
  monthly_cents            integer not null,
  did                      text,                 -- e.g. '+1 415 555 0143' (filled when provisioned)
  stripe_subscription_id   text unique,
  status                   text not null default 'pending', -- 'active' | 'pending' | 'canceled' | 'past_due'
  created_at               timestamptz not null default now(),
  current_period_end       timestamptz
);

create index if not exists phone_numbers_customer_idx       on public.phone_numbers (customer_id);
create index if not exists phone_numbers_status_idx         on public.phone_numbers (status);
create index if not exists phone_numbers_subscription_idx   on public.phone_numbers (stripe_subscription_id);

-- =====================================================================
-- updated_at trigger for customers
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.touch_updated_at();

-- =====================================================================
-- Lock down all tables. Admin reads happen via the service role only.
-- =====================================================================
alter table public.customers     enable row level security;
alter table public.payments      enable row level security;
alter table public.phone_numbers enable row level security;

-- No anon/auth policies on purpose — only the service role (which bypasses RLS)
-- can read or write these tables. The super-admin server pages use the service
-- role client. End users never read this data directly.
