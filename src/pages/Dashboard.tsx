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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey and master university courses with interactive content.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              icon: <BookOpen className="h-8 w-8 text-blue-500" />,
              label: 'Enrolled Courses',
              value: stats?.totalCourses || 0,
              color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
            },
            {
              icon: <Trophy className="h-8 w-8 text-yellow-500" />,
              label: 'Quizzes Passed',
              value: stats?.completedQuizzes || 0,
              color: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
            },
            {
              icon: <Target className="h-8 w-8 text-green-500" />,
              label: 'Average Score',
              value: `${stats?.averageScore || 0}%`,
              color: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
            },
            {
              icon: <Zap className="h-8 w-8 text-purple-500" />,
              label: 'Plan',
              value: stats?.subscription.toUpperCase() || 'FREE',
              color: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ translateY: -5 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-border/50 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-background/50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
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
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-8">
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
                    <motion.div
                      key={enrollment.course_id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-secondary/50 rounded-lg overflow-hidden border border-border/30 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                        {enrollment.courses.thumbnail_url ? (
                          <img
                            src={enrollment.courses.thumbnail_url}
                            alt={enrollment.courses.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-8 w-8 text-primary/50" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2">{enrollment.courses.title}</h3>
                        <p className="text-xs text-muted-foreground mt-2">{enrollment.courses.category}</p>
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
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Notifications</h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg text-sm transition-colors ${
                        notif.read
                          ? 'bg-secondary/30 text-muted-foreground'
                          : 'bg-primary/10 text-foreground border-l-2 border-primary'
                      }`}
                    >
                      <p className="font-medium line-clamp-2">{notif.title}</p>
                      <p className="text-xs mt-1 line-clamp-1">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Browse Courses</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left">
                  <MessageSquare className="h-5 w-5 text-primary" />
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
