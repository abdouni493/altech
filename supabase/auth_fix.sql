-- =============================================================================
-- FIX: "I created an admin account but can't log in"
-- =============================================================================
-- Cause: new Supabase projects require e-mail confirmation, so a freshly
-- created account cannot sign in until the confirmation link is clicked.
--
-- Run this whole file once in:  Supabase Dashboard ▸ SQL Editor ▸ Run.
-- It (1) confirms every account that is already stuck, and (2) auto-confirms
-- every future sign-up so "create account → log in" works instantly.
--
-- (Equivalent one-click alternative: Dashboard ▸ Authentication ▸ Sign In /
--  Providers ▸ Email ▸ turn "Confirm email" OFF.)
-- =============================================================================

-- 1) Confirm any accounts created so far that are still unconfirmed.
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- 2) Auto-confirm every NEW sign-up.
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_auto_confirm_user on auth.users;
create trigger trg_auto_confirm_user
  before insert on auth.users
  for each row execute function public.auto_confirm_user();

-- Done. Create an account on the login page, then log in immediately.
