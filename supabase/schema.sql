-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  instructor_id uuid references public.profiles(id),
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.courses enable row level security;

create policy "Courses are viewable by everyone."
  on courses for select
  using ( true );

-- Create modules table
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

create policy "Modules are viewable by everyone."
  on modules for select
  using ( true );

-- Create lessons table
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  video_url text,
  content text,
  duration integer, -- in seconds
  order_index integer not null,
  is_free boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone."
  on lessons for select
  using ( true );

-- Create enrollments table
create table public.enrollments (
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view their own enrollments."
  on enrollments for select
  using ( auth.uid() = user_id );

create policy "Users can enroll themselves."
  on enrollments for insert
  with check ( auth.uid() = user_id );
