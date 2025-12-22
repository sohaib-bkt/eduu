-- Seed data for Edubloom platform
-- This file contains test data for development

-- Note: Profiles would normally be created via auth.users, 
-- but for testing we'll insert directly (in production, use auth)

-- Insert test profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'),
('550e8400-e29b-41d4-a716-446655440003', 'prof.teacher@example.com', 'Professor Teacher', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professor')
ON CONFLICT DO NOTHING;

-- Insert test courses
INSERT INTO public.courses (id, title, description, thumbnail_url, instructor_id, difficulty, category, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Mathematics: Calculus I', 'Master the fundamentals of differential calculus with animated explanations and interactive quizzes.', 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'beginner', 'Mathematics', NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Physics: Mechanics', 'Understanding motion, forces, and energy through visual learning and problem solving.', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'intermediate', 'Physics', NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Chemistry: Organic Chemistry', 'Explore the structure and reactions of organic compounds with interactive models.', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'advanced', 'Chemistry', NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Biology: Human Anatomy', 'Learn human body systems through detailed animated diagrams and quizzes.', 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'intermediate', 'Biology', NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'History: World War II', 'Comprehensive overview of WWII with historical context and analysis.', 'https://images.unsplash.com/photo-1456081222736-f29c75eb9006?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'beginner', 'History', NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'Literature: Shakespeare', 'Analyze Shakespeare''s works with expert insights and video lectures.', 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=800&h=400&fit=crop', '550e8400-e29b-41d4-a716-446655440003', 'beginner', 'Literature', NOW())
ON CONFLICT DO NOTHING;

-- Insert test modules
INSERT INTO public.modules (id, course_id, title, order_index, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Introduction to Limits', 1, NOW()),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Derivatives Fundamentals', 2, NOW()),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Kinematics and Motion', 1, NOW()),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Forces and Newton''s Laws', 2, NOW()),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'Organic Chemistry Basics', 1, NOW()),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'Skeletal System', 1, NOW())
ON CONFLICT DO NOTHING;

-- Insert test lessons
INSERT INTO public.lessons (id, module_id, title, video_url, content, duration, order_index, is_free, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Understanding Limits: The Basics', 'https://www.youtube.com/embed/qzPJx7DFQ-4', 'In this lesson, we explore the fundamental concept of limits in calculus. We''ll examine how functions behave as they approach specific values and understand epsilon-delta definitions.', 1200, 1, true, NOW()),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Computing Limits Algebraically', 'https://www.youtube.com/embed/O2oDXPqrqfg', 'Learn various techniques to compute limits, including direct substitution, factoring, and conjugate methods.', 1800, 2, false, NOW()),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'Introduction to Derivatives', 'https://www.youtube.com/embed/9vKqVkMQHKk', 'Understanding what derivatives represent and their geometric interpretation as slopes of tangent lines.', 1500, 1, true, NOW()),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'Power Rule and Basic Rules', 'https://www.youtube.com/embed/KAWVyMY3cNw', 'Master the power rule, product rule, quotient rule, and chain rule for differentiation.', 2000, 2, false, NOW()),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', 'Distance, Speed, and Velocity', 'https://www.youtube.com/embed/KzXjxXdlGzU', 'Explore fundamental concepts of motion including position, displacement, speed, and velocity.', 1400, 1, true, NOW()),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440004', 'Newton''s First Law', 'https://www.youtube.com/embed/LQ0owlQHKkQ', 'Understanding inertia and how objects resist changes in motion.', 1300, 1, true, NOW())
ON CONFLICT DO NOTHING;

-- Insert test quizzes
INSERT INTO public.quizzes (id, lesson_id, title, description, passing_score, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Limits Basics Quiz', 'Test your understanding of limit concepts', 70, NOW()),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Computing Limits Quiz', 'Practice computing limits algebraically', 70, NOW()),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Derivatives Intro Quiz', 'Test your derivative knowledge', 70, NOW()),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440005', 'Kinematics Quiz', 'Test motion concepts', 70, NOW())
ON CONFLICT DO NOTHING;

-- Insert quiz questions
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'What is the limit of f(x) = 2x as x approaches 3?', 'multiple_choice', 1, NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'True or False: All functions have limits at every point?', 'true_false', 2, NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'Which method is best for computing limits with rational functions?', 'multiple_choice', 1, NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'What does the derivative represent geometrically?', 'multiple_choice', 1, NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440004', 'What is velocity in physics?', 'multiple_choice', 1, NOW())
ON CONFLICT DO NOTHING;

-- Insert quiz options
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index, created_at) VALUES
-- Question 1 options
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '4', false, 1, NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '6', true, 2, NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', '3', false, 3, NOW()),
-- Question 3 options
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440003', 'Direct substitution', false, 1, NOW()),
('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440003', 'Factoring and cancellation', true, 2, NOW()),
('bb0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440003', 'L''Hôpital''s Rule', false, 3, NOW()),
-- Question 4 options
('bb0e8400-e29b-41d4-a716-446655440007', 'aa0e8400-e29b-41d4-a716-446655440004', 'The average rate of change', false, 1, NOW()),
('bb0e8400-e29b-41d4-a716-446655440008', 'aa0e8400-e29b-41d4-a716-446655440004', 'The slope of the tangent line', true, 2, NOW()),
('bb0e8400-e29b-41d4-a716-446655440009', 'aa0e8400-e29b-41d4-a716-446655440004', 'The integral of the function', false, 3, NOW()),
-- Question 5 options
('bb0e8400-e29b-41d4-a716-446655440010', 'aa0e8400-e29b-41d4-a716-446655440005', 'The rate of change of position with direction', true, 1, NOW()),
('bb0e8400-e29b-41d4-a716-446655440011', 'aa0e8400-e29b-41d4-a716-446655440005', 'The rate of change of speed', false, 2, NOW()),
('bb0e8400-e29b-41d4-a716-446655440012', 'aa0e8400-e29b-41d4-a716-446655440005', 'The distance traveled', false, 3, NOW())
ON CONFLICT DO NOTHING;

-- Insert test enrollments
INSERT INTO public.enrollments (user_id, course_id, enrolled_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', NOW()),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', NOW())
ON CONFLICT DO NOTHING;

-- Insert test subscriptions
INSERT INTO public.subscriptions (id, user_id, plan_type, status, start_date, end_date, created_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'pro', 'active', NOW(), NOW() + INTERVAL '30 days', NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'starter', 'active', NOW(), NOW() + INTERVAL '7 days', NOW())
ON CONFLICT DO NOTHING;

-- Insert test notifications
INSERT INTO public.notifications (id, user_id, title, message, read, created_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to Edubloom!', 'Your account is ready. Start exploring courses.', false, NOW()),
('dd0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'New Course Available', 'Check out our latest course: Advanced Physics', false, NOW() - INTERVAL '1 day'),
('dd0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Quiz Available', 'Complete the Limits Basics Quiz for Calculus I', false, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;
