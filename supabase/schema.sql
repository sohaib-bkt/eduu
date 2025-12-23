-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
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

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
  audio_url text,
  pdf_url text,
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

-- Create quizzes table
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  description text,
  passing_score integer default 70,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quizzes enable row level security;

create policy "Quizzes are viewable by everyone."
  on quizzes for select
  using ( true );

-- Create quiz questions table
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type text check (question_type in ('multiple_choice', 'short_answer', 'true_false')),
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quiz_questions enable row level security;

create policy "Quiz questions are viewable by everyone."
  on quiz_questions for select
  using ( true );

-- Create quiz options table (for multiple choice)
create table public.quiz_options (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quiz_options enable row level security;

create policy "Quiz options are viewable by everyone."
  on quiz_options for select
  using ( true );

-- Create quiz submissions table
create table public.quiz_submissions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer,
  passed boolean,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(quiz_id, user_id)
);

alter table public.quiz_submissions enable row level security;

create policy "Users can view their own quiz submissions."
  on quiz_submissions for select
  using ( auth.uid() = user_id );

create policy "Users can submit their own quizzes."
  on quiz_submissions for insert
  with check ( auth.uid() = user_id );

-- Create subscriptions/payments table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_type text check (plan_type in ('free', 'starter', 'pro', 'premium')) default 'free',
  status text check (status in ('active', 'canceled', 'expired')) default 'active',
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription."
  on subscriptions for select
  using ( auth.uid() = user_id );

-- Create messages/support table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text not null,
  status text check (status in ('open', 'in_progress', 'resolved')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view their own messages."
  on messages for select
  using ( auth.uid() = user_id );

create policy "Users can create messages."
  on messages for insert
  with check ( auth.uid() = user_id );

-- Create notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications."
  on notifications for select
  using ( auth.uid() = user_id );
