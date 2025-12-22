import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, BookOpen, Clock, Award, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCourseById } from '../lib/api';

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
  video_url: string;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  difficulty: string;
  category: string;
  modules: Module[];
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((lsum, l) => lsum + (l.duration || 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Courses
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Hero Section */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden relative">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white opacity-80" />
                </div>
              </div>

              {/* Course Info */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/30">
                  <div>
                    <p className="text-3xl font-bold">{totalLessons}</p>
                    <p className="text-muted-foreground text-sm">Lessons</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{Math.round(totalDuration / 60)}</p>
                    <p className="text-muted-foreground text-sm">Hours</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{course.modules.length}</p>
                    <p className="text-muted-foreground text-sm">Modules</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Course Curriculum
              </h2>

              <div className="space-y-4">
                {course.modules.map((module) => (
                  <motion.div
                    key={module.id}
                    className="border border-border/30 rounded-xl overflow-hidden"
                    layout
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className="w-full p-6 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Module {module.order_index}: {module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className={`transform transition-transform ${expandedModule === module.id ? 'rotate-180' : ''}`}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </button>

                    {/* Lessons List */}
                    {expandedModule === module.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/30 divide-y divide-border/30"
                      >
                        {module.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="p-6 bg-background/50 hover:bg-background transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="inline-block h-8 w-8 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-semibold">{lesson.title}</h4>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{Math.round((lesson.duration || 0) / 60)} min</span>
                                  </div>
                                  {lesson.is_free && (
                                    <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                                  )}
                                </div>
                              </div>
                              {user ? (
                                <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium">
                                  Watch
                                </button>
                              ) : (
                                <button
                                  onClick={() => navigate('/login')}
                                  className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                                >
                                  Sign In
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Enroll Card */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-8 sticky top-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Get Started</h3>
                <p className="text-muted-foreground text-sm">Unlock all lessons and quizzes with enrollment</p>
              </div>

              <button className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl">
                {user ? 'Enroll Now' : 'Sign In & Enroll'}
              </button>

              {/* Course Highlights */}
              <div className="border-t border-border/30 pt-6 space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  What You'll Get
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to all {totalLessons} video lessons</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Interactive quizzes and assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Downloadable study materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>24/7 student support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* Free Preview */}
              <div className="border-t border-border/30 pt-6">
                <p className="text-xs text-muted-foreground mb-3">Or start with free lessons</p>
                <button className="w-full px-6 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium">
                  Preview Free Lessons
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
