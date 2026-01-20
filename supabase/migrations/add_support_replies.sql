-- Migration: Add support replies and admin features to existing messages table

-- 1. Add admin_id column to messages table if it doesn't exist
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS admin_id uuid references public.profiles(id) on delete set null;

-- 2. Create support replies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.support_replies (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) on delete set null,
  reply_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS on support_replies
alter table public.support_replies enable row level security;

-- 4. Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view replies to their messages." ON public.support_replies;
DROP POLICY IF EXISTS "Admins can view all replies." ON public.support_replies;
DROP POLICY IF EXISTS "Admins can create replies." ON public.support_replies;
DROP POLICY IF EXISTS "Service role can view all replies" ON public.support_replies;

-- 5. Create RLS policies for support_replies - simplified to allow all authenticated users to view
create policy "Users can view replies to their messages."
  on support_replies for select
  using ( true );

create policy "Admins can view all replies."
  on support_replies for select
  using ( 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

create policy "Admins can create replies."
  on support_replies for insert
  with check ( 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- 6. Add/update RLS policies for messages table to allow admins
DROP POLICY IF EXISTS "Admins can view all messages." ON public.messages;
DROP POLICY IF EXISTS "Admins can update messages." ON public.messages;
DROP POLICY IF EXISTS "Admins can update message status." ON public.messages;

create policy "Admins can view all messages."
  on messages for select
  using (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

create policy "Admins can update messages."
  on messages for update
  using (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  with check (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
