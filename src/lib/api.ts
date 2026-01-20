import { supabase } from './supabase';

// Profiles
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

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

export async function getInstructorCourses(instructorId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });
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

// Calculate course progress based on quizzes completed
export async function getCourseProgress(userId: string, courseId: string) {
  try {
    // Get course with all modules and lessons
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*))')
      .eq('id', courseId)
      .single();
    
    if (courseError) throw courseError;

    if (!course?.modules || course.modules.length === 0) {
      return 0;
    }

    // Count total lessons
    let totalLessons = 0;
    course.modules.forEach((module: any) => {
      if (module.lessons) {
        totalLessons += module.lessons.length;
      }
    });

    if (totalLessons === 0) {
      return 0;
    }

    // Get user's quiz submissions for lessons in this course
    const { data: submissions, error: submissionError } = await supabase
      .from('quiz_submissions')
      .select('*, quizzes(lesson_id)')
      .eq('user_id', userId);

    if (submissionError) throw submissionError;

    // Get all lesson IDs in this course
    const lessonIds = new Set<string>();
    course.modules.forEach((module: any) => {
      if (module.lessons) {
        module.lessons.forEach((lesson: any) => {
          lessonIds.add(lesson.id);
        });
      }
    });

    // Count completed lessons (lessons with passed quizzes)
    const completedLessonIds = new Set<string>();
    submissions?.forEach((sub: any) => {
      if (sub.passed && sub.quizzes?.lesson_id && lessonIds.has(sub.quizzes.lesson_id)) {
        completedLessonIds.add(sub.quizzes.lesson_id);
      }
    });

    const progress = Math.round((completedLessonIds.size / totalLessons) * 100);
    return Math.min(100, progress);
  } catch (error) {
    console.error('Error calculating course progress:', error);
    return 0;
  }
}

// Get progress for all courses
export async function getAllCourseProgress(userId: string, enrollments: any[]) {
  try {
    const progressMap: Record<string, number> = {};
    
    for (const enrollment of enrollments) {
      const progress = await getCourseProgress(userId, enrollment.course_id);
      progressMap[enrollment.course_id] = progress;
    }
    
    return progressMap;
  } catch (error) {
    console.error('Error fetching all course progress:', error);
    return {};
  }
}

// Support Messages & Notifications
export async function createSupportMessage(userId: string, title: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        user_id: userId,
        title,
        content,
        status: 'open',
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getSupportMessages(filters?: { status?: string; adminId?: string }) {
  try {
    let query = supabase
      .from('messages')
      .select('*, profiles:user_id(full_name, email, avatar_url)');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data: messages, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Get all replies for these messages
    const messageIds = messages?.map(m => m.id) || [];
    if (messageIds.length === 0) return messages;

    const { data: replies, error: repliesError } = await supabase
      .from('support_replies')
      .select('*')
      .in('message_id', messageIds);

    if (repliesError) throw repliesError;

    // Combine messages with their replies
    const messagesWithReplies = messages?.map(msg => ({
      ...msg,
      support_replies: replies?.filter(r => r.message_id === msg.id) || []
    })) || [];

    return messagesWithReplies;
  } catch (error) {
    console.error('Error fetching support messages:', error);
    throw error;
  }
}

export async function getUserSupportMessages(userId: string) {
  try {
    // First get the messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;

    // Then get all replies for these messages
    const messageIds = messages?.map(m => m.id) || [];
    if (messageIds.length === 0) return messages;

    const { data: replies, error: repliesError } = await supabase
      .from('support_replies')
      .select('*')
      .in('message_id', messageIds);

    if (repliesError) throw repliesError;

    // Combine messages with their replies
    const messagesWithReplies = messages?.map(msg => ({
      ...msg,
      support_replies: replies?.filter(r => r.message_id === msg.id) || []
    })) || [];

    return messagesWithReplies;
  } catch (error) {
    console.error('Error fetching user support messages:', error);
    throw error;
  }
}

export async function getSupportMessageById(messageId: string) {
  try {
    // Get the message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError) throw messageError;

    // Get replies for this message
    const { data: replies, error: repliesError } = await supabase
      .from('support_replies')
      .select('*')
      .eq('message_id', messageId);

    if (repliesError) throw repliesError;

    // Combine
    return {
      ...message,
      support_replies: replies || []
    };
  } catch (error) {
    console.error('Error fetching support message:', error);
    throw error;
  }
}

export async function createSupportReply(messageId: string, adminId: string, replyText: string) {
  // Create the reply
  const { data: replyData, error: replyError } = await supabase
    .from('support_replies')
    .insert([
      {
        message_id: messageId,
        admin_id: adminId,
        reply_text: replyText,
      },
    ])
    .select();

  if (replyError) throw replyError;

  // Get the message to find the user
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .select('user_id')
    .eq('id', messageId)
    .single();

  if (messageError) throw messageError;

  // Create a notification for the user
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: messageData.user_id,
        title: 'Admin Response to Your Support Request',
        message: replyText,
        read: false,
      },
    ]);

  if (notificationError) throw notificationError;

  // Update message status to in_progress
  await supabase
    .from('messages')
    .update({ status: 'in_progress', admin_id: adminId })
    .eq('id', messageId);

  return replyData?.[0];
}

export async function updateMessageStatus(messageId: string, status: 'open' | 'in_progress' | 'resolved') {
  const { data, error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', messageId)
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
