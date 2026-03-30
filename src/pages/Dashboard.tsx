import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Zap, Bell, MessageSquare, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createSubscription, getDashboardStats, getUserNotifications, getUserEnrollments, getAllCourseProgress } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import ContactAdminForm from '../components/ContactAdminForm';

interface DashboardStats {
  totalCourses: number;
  completedQuizzes: number;
  averageScore: number;
  subscription: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface CourseEnrollment {
  course_id: string;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string;
    category: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [contactFormOpen, setContactFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const userId = sessionData.session.user.id;
          setUser(sessionData.session.user);

          const params = new URLSearchParams(window.location.search);
          const checkoutSuccess = params.get('checkout') === 'success';
          const plan = params.get('plan') || localStorage.getItem('eduu_pending_plan');

          if (checkoutSuccess || plan) {
            const subscriptionPlan = plan as string;
            if (subscriptionPlan) {
              try {
                await createSubscription(userId, subscriptionPlan);
                localStorage.removeItem('eduu_pending_plan');
                window.history.replaceState({}, document.title, window.location.pathname);
              } catch (error) {
                console.error('Error creating subscription after checkout:', error);
              }
            }
          }

          const [statsData, notificationsData, enrollmentsData] = await Promise.all([
            getDashboardStats(userId),
            getUserNotifications(userId),
            getUserEnrollments(userId),
          ]);

          setStats(statsData);
          setNotifications(notificationsData.slice(0, 5));
          setEnrollments(enrollmentsData);

          // Fetch real progress for all courses
          if (enrollmentsData && enrollmentsData.length > 0) {
            const progress = await getAllCourseProgress(userId, enrollmentsData);
            setProgressMap(progress);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Welcome back, {user?.email?.split('@')[0]} 👋</h1>
              <p className="text-sm text-gray-600">Continue your learning journey — here are your latest stats and courses.</p>
            </div>
            <div className="flex items-center gap-3">              <Link to="/subscription" className="px-4 py-2 bg-secondary text-foreground rounded-full text-sm font-medium hover:bg-secondary/80">Manage Subscription</Link>              <Link to="/profile" className="px-4 py-2 bg-white rounded-full shadow-sm border border-border/50 text-sm font-medium hover:shadow-md">View Profile</Link>
              <Link to="/courses" className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full text-sm font-semibold shadow">Browse Courses</Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[{
            icon: <BookOpen className="h-6 w-6 text-white" />,
            label: 'Enrolled Courses',
            value: stats?.totalCourses || 0,
            accent: 'from-blue-500 to-cyan-400',
            bgLight: 'bg-blue-50'
          }, {
            icon: <Trophy className="h-6 w-6 text-white" />,
            label: 'Quizzes Passed',
            value: stats?.completedQuizzes || 0,
            accent: 'from-yellow-400 to-amber-400',
            bgLight: 'bg-yellow-50'
          }, {
            icon: <Target className="h-6 w-6 text-white" />,
            label: 'Average Score',
            value: `${stats?.averageScore || 0}%`,
            accent: 'from-green-400 to-emerald-400',
            bgLight: 'bg-green-50'
          }, {
            icon: <Zap className="h-6 w-6 text-white" />,
            label: 'Subscription',
            value: stats?.subscription ? stats.subscription.toUpperCase() : 'FREE',
            accent: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-50'
          }].map((s, idx) => (
            <motion.div
              key={idx}
              whileHover={{ translateY: -8, boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`${s.bgLight} rounded-2xl p-6 border border-border/30 shadow-sm hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-md`}>
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currently Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-border/30 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Courses</h2>
                <Link
                  to="/courses"
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  View all →
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                  <Link
                    to="/courses"
                    className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrollments.slice(0, 4).map((enrollment) => {
                    const progress = progressMap[enrollment.course_id] || 0;
                    return (
                      <motion.div
                        key={enrollment.course_id}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => navigate(`/course/${enrollment.course_id}`)}
                        className="bg-white rounded-lg overflow-hidden border border-border/30 hover:shadow-md transition-all cursor-pointer group relative"
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-transparent flex items-end p-3 relative">
                          {enrollment.courses.thumbnail_url ? (
                            <img src={enrollment.courses.thumbnail_url} alt={enrollment.courses.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <BookOpen className="h-10 w-10 text-primary/40" />
                            </div>
                          )}
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <ArrowRight className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm line-clamp-2">{enrollment.courses.title}</h3>
                          <p className="text-xs text-gray-500 mt-2">{enrollment.courses.category}</p>
                          <div className="mt-3">
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-2">Progress: <span className="font-medium text-gray-700">{progress}%</span></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-border/30 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Notifications</h3>
                <span className="ml-auto text-sm text-gray-500">{notifications.length} recent</span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg text-sm transition-all border ${notif.read ? 'bg-slate-50 border-border/20' : 'bg-white border-primary/10 shadow-sm'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium line-clamp-2">{notif.title}</p>
                          <p className="text-xs mt-1 text-gray-500 line-clamp-1">{notif.message}</p>
                        </div>
                        {!notif.read && <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs bg-primary text-white rounded">New</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-border/30 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/courses" className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-all border border-border/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Browse Courses</span>
                </Link>
                <button onClick={() => setContactFormOpen(true)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary text-white transition-all hover:opacity-95">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium">Get Help</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Admin Form Modal */}
      <ContactAdminForm 
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        userId={user?.id}
      />
    </div>
  );
}
