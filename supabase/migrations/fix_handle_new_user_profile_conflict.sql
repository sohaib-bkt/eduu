-- Allow auth signup when a seed profile row already exists (same id)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  if not exists (
    select 1 from public.subscriptions where user_id = new.id
  ) then
    insert into public.subscriptions (user_id, plan_type, status, start_date)
    values (new.id, 'free', 'active', timezone('utc'::text, now()));
  end if;

  return new;
end;
$$ language plpgsql security definer;
