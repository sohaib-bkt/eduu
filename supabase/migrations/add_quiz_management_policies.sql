-- Migration: Add RLS policies for quizzes, questions, and options
-- Permissive policies for testing (Allows all authenticated users)

-- 1. Quizzes
DROP POLICY IF EXISTS "Admins can insert quizzes" ON public.quizzes;
CREATE POLICY "Anyone authenticated can insert quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update quizzes" ON public.quizzes;
CREATE POLICY "Anyone authenticated can update quizzes"
  ON public.quizzes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 2. Quiz Questions
DROP POLICY IF EXISTS "Admins can insert quiz questions" ON public.quiz_questions;
CREATE POLICY "Anyone authenticated can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Quiz Options
DROP POLICY IF EXISTS "Admins can insert quiz options" ON public.quiz_options;
CREATE POLICY "Anyone authenticated can insert quiz options"
  ON public.quiz_options FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Lessons (To allow saving the AI summary)
DROP POLICY IF EXISTS "Admins can update lessons" ON public.lessons;
CREATE POLICY "Anyone authenticated can update lessons"
  ON public.lessons FOR UPDATE
  USING (auth.role() = 'authenticated');
