import { supabase } from './supabase';

// Courses
export async function getCourses(filters?: { category?: string; difficulty?: string; search?: string }) {
  let query = supabase.from('courses').select('*');
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Enrollments
export async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*, modules(*, lessons(*)))')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function enrollCourse(userId: string, courseId: string) {
  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId });
  if (error) throw error;
}

// Lessons
export async function getLessonsByModule(moduleId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getLessonById(id: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Quizzes
export async function getQuizzesByLesson(lessonId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(*, quiz_options(*))')
    .eq('lesson_id', lessonId);
  if (error) throw error;
  return data;
}

export async function submitQuiz(quizId: string, userId: string, score: number, passed: boolean) {
  const { error } = await supabase
    .from('quiz_submissions')
    .upsert({
      quiz_id: quizId,
      user_id: userId,
      score,
      passed,
    });
  if (error) throw error;
}

export async function getUserQuizSubmissions(userId: string) {
  const { data, error } = await supabase
    .from('quiz_submissions')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

// Subscriptions
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// Notifications
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

// Messages
export async function getUserMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createMessage(userId: string, title: string, content: string) {
  const { error } = await supabase
    .from('messages')
    .insert({ user_id: userId, title, content });
  if (error) throw error;
}

// Profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string }) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

// Dashboard stats
export async function getDashboardStats(userId: string) {
  const [enrollments, submissions, subscription] = await Promise.all([
    getUserEnrollments(userId),
    getUserQuizSubmissions(userId),
    getUserSubscription(userId),
  ]);

  const completedQuizzes = submissions?.filter(s => s.passed).length || 0;
  const averageScore = submissions?.length ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length) : 0;

  return {
    totalCourses: enrollments?.length || 0,
    completedQuizzes,
    averageScore,
    subscription: subscription?.plan_type || 'free',
  };
}
