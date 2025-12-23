import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Zap, Bell, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getDashboardStats, getUserNotifications, getUserEnrollments } from '../lib/api';
import { Link } from 'react-router-dom';

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
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const userId = sessionData.session.user.id;
          setUser(sessionData.session.user);

          const [statsData, notificationsData, enrollmentsData] = await Promise.all([
            getDashboardStats(userId),
            getUserNotifications(userId),
            getUserEnrollments(userId),
          ]);

          setStats(statsData);
          setNotifications(notificationsData.slice(0, 5));
          setEnrollments(enrollmentsData);
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
            <div className="flex items-center gap-3">
              <Link to="/profile" className="px-4 py-2 bg-white rounded-full shadow-sm border border-border/50 text-sm font-medium hover:shadow-md">View Profile</Link>
              <Link to="/courses" className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full text-sm font-semibold shadow">Browse Courses</Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[{
            icon: <BookOpen className="h-6 w-6 text-white" />,
            label: 'Enrolled',
            value: stats?.totalCourses || 0,
            accent: 'from-blue-500 to-cyan-400'
          }, {
            icon: <Trophy className="h-6 w-6 text-white" />,
            label: 'Quizzes Passed',
            value: stats?.completedQuizzes || 0,
            accent: 'from-yellow-400 to-amber-400'
          }, {
            icon: <Target className="h-6 w-6 text-white" />,
            label: 'Avg Score',
            value: `${stats?.averageScore || 0}%`,
            accent: 'from-green-400 to-emerald-400'
          }, {
            icon: <Zap className="h-6 w-6 text-white" />,
            label: 'Plan',
            value: stats?.subscription ? stats.subscription.toUpperCase() : 'FREE',
            accent: 'from-purple-500 to-pink-500'
          }].map((s, idx) => (
            <motion.div key={idx} whileHover={{ translateY: -6 }} className="bg-white rounded-xl p-5 border border-border/30 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-md`}>
                  {s.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
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
                  {enrollments.slice(0, 4).map((enrollment) => (
                    <motion.div key={enrollment.course_id} whileHover={{ scale: 1.03 }} className="bg-white rounded-lg overflow-hidden border border-border/30 hover:shadow-md transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-transparent flex items-end p-3">
                        {enrollment.courses.thumbnail_url ? (
                          <img src={enrollment.courses.thumbnail_url} alt={enrollment.courses.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <BookOpen className="h-10 w-10 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2">{enrollment.courses.title}</h3>
                        <p className="text-xs text-gray-500 mt-2">{enrollment.courses.category}</p>
                        <div className="mt-3">
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, Math.floor(Math.random() * 70) + 10)}%` }} />
                          </div>
                          <div className="text-xs text-gray-500 mt-2">Progress: <span className="font-medium text-gray-700">{`${Math.floor(Math.random() * 70) + 10}%`}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary text-white transition-all hover:opacity-95">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium">Get Help</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
