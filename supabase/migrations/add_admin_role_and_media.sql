-- Migration: Add admin role and multimedia support
-- Safe to run on existing databases with data

-- 1. Add role column to profiles table (if it doesn't exist)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role in ('user', 'admin'));

-- 2. Add audio_url and pdf_url columns to lessons table (if they don't exist)
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS audio_url text;

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS pdf_url text;

-- 3. Create index for faster role-based queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. Update RLS policies to support admin-only operations
-- Allow admins to create/update/delete courses
CREATE POLICY "Admins can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update own courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete own courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to manage modules
CREATE POLICY "Admins can manage modules"
  ON modules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update modules"
  ON modules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete modules"
  ON modules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to manage lessons
CREATE POLICY "Admins can manage lessons"
  ON lessons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. Create storage buckets for course media (if they don't exist)
-- Note: These need to be created via Supabase UI or API, not SQL
-- But you can add this SQL to set up RLS policies:

-- RLS for videos bucket
CREATE POLICY "Videos are readable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS for audios bucket
CREATE POLICY "Audios are readable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audios');

CREATE POLICY "Admins can upload audios"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audios'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS for pdfs bucket
CREATE POLICY "PDFs are readable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');

CREATE POLICY "Admins can upload pdfs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdfs'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
