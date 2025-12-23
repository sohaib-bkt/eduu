import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Trash2, BookOpen, Video, Mic } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useParams } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  audio_url: string;
  pdf_url: string;
  duration: number;
  is_free: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      setCourse(courseData);

      const { data: modulesData } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          order_index,
          lessons (id, title, video_url, audio_url, pdf_url, duration, is_free)
        `)
        .eq('course_id', courseId)
        .order('order_index');

      setModules(modulesData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      const { data } = await supabase
        .from('modules')
        .insert([
          {
            course_id: courseId,
            title: newModuleTitle,
            order_index: modules.length,
          },
        ])
        .select();

      if (data) {
        setModules([
          ...modules,
          {
            id: data[0].id,
            title: data[0].title,
            order_index: data[0].order_index,
            lessons: [],
          },
        ]);
        setNewModuleTitle('');
        setShowModuleForm(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <Link to="/admin" className="text-primary hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">Add modules and lessons with videos, audio, and PDF documents</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Add Module Form */}
        {showModuleForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-xl p-6 border border-border/30 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4">Add New Module</h2>
            <form onSubmit={handleAddModule} className="flex gap-3">
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g., Fundamentals"
                className="flex-1 px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Add Module
              </button>
              <button
                type="button"
                onClick={() => setShowModuleForm(false)}
                className="px-6 py-2 border border-border/50 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-12 text-center border border-border/30"
            >
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">No modules yet. Create your first module!</p>
              <button
                onClick={() => setShowModuleForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Add First Module
              </button>
            </motion.div>
          ) : (
            modules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-border/30 overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/5 px-6 py-4 border-b border-border/20">
                  <h3 className="text-lg font-bold">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.lessons.length} lessons</p>
                </div>

                <div className="p-6 space-y-4">
                  {module.lessons.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No lessons in this module</p>
                  ) : (
                    module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 bg-gray-50 rounded-lg border border-border/20 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{lesson.title}</h4>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {lesson.video_url && (
                              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                <Video className="h-3 w-3" /> Video
                              </span>
                            )}
                            {lesson.audio_url && (
                              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                <Mic className="h-3 w-3" /> Audio
                              </span>
                            )}
                            {lesson.pdf_url && (
                              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                📄 PDF
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}

                  <Link
                    to={`/admin/modules/${module.id}/add-lesson`}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {modules.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModuleForm(true)}
            className="mt-8 w-full py-3 border-2 border-dashed border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Add Another Module
          </motion.button>
        )}
      </div>
    </div>
  );
}
