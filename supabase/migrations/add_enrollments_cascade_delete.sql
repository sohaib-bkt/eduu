-- Migration: Add ON DELETE CASCADE to enrollments.course_id
-- This allows deleting a course and automatically removes all enrollments that reference it.

-- Drop existing foreign key constraint
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;

-- Recreate constraint with ON DELETE CASCADE
ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_course_id_fkey
  FOREIGN KEY (course_id)
  REFERENCES public.courses(id)
  ON DELETE CASCADE;

-- Optional: add safe admin policies for enrollments if not already present
-- (you can remove if already configured in another migration)

-- Drop policies first if they exist (to avoid "policy already exists" errors)
DROP POLICY IF EXISTS "Admins can manage enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can insert enrollments" ON public.enrollments;

-- Create policies
CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);