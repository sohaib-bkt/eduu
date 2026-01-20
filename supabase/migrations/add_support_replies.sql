-- Create support replies table
create table public.support_replies (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) on delete set null,
  reply_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.support_replies enable row level security;

create policy "Users can view replies to their messages."
  on support_replies for select
  using ( 
    exists (
      select 1 from public.messages 
      where messages.id = support_replies.message_id 
      and messages.user_id = auth.uid()
    )
  );

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

-- Add admin_id column to messages for tracking which admin responded
alter table public.messages add column admin_id uuid references public.profiles(id) on delete set null;

-- Update messages table policy to allow admins to update status
create policy "Admins can update message status."
  on messages for update
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

create policy "Admins can view all messages."
  on messages for select
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );
