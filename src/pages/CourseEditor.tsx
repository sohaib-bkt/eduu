import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Trash2, BookOpen, Video, Mic, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
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
  category: string;
  difficulty: string;
  thumbnail_url: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
}

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    thumbnail_url: '',
  });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setError('');
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);
      setCourseForm({
        title: courseData.title || '',
        description: courseData.description || '',
        category: courseData.category || '',
        difficulty: courseData.difficulty || 'beginner',
        thumbnail_url: courseData.thumbnail_url || '',
      });

      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          order_index,
          lessons (id, title, video_url, audio_url, pdf_url, duration, is_free)
        `)
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      const normalized = (modulesData || []).map((m) => ({
        ...m,
        lessons: Array.isArray(m.lessons) ? m.lessons : [],
      }));
      setModules(normalized);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !courseForm.title.trim()) {
      setError('Course title is required');
      return;
    }

    try {
      setError('');
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          title: courseForm.title,
          description: courseForm.description,
          category: courseForm.category,
          difficulty: courseForm.difficulty,
          thumbnail_url: courseForm.thumbnail_url,
        })
        .eq('id', courseId);

      if (updateError) throw updateError;

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              title: courseForm.title,
              description: courseForm.description,
              category: courseForm.category,
              difficulty: courseForm.difficulty,
              thumbnail_url: courseForm.thumbnail_url,
            }
          : prev
      );
      setSuccess('Course updated successfully!');
      setShowCourseForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      setError('');
      const { data, error: insertError } = await supabase
        .from('modules')
        .insert([
          {
            course_id: courseId,
            title: newModuleTitle,
            order_index: modules.length,
          },
        ])
        .select();

      if (insertError) throw insertError;

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
        setSuccess('Module added successfully!');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateModule = async (moduleId: string) => {
    if (!editingModuleTitle.trim()) return;

    try {
      setError('');
      const { error: updateError } = await supabase
        .from('modules')
        .update({ title: editingModuleTitle })
        .eq('id', moduleId);

      if (updateError) throw updateError;

      setModules(
        modules.map((m) => (m.id === moduleId ? { ...m, title: editingModuleTitle } : m))
      );
      setEditingModuleId(null);
      setEditingModuleTitle('');
      setSuccess('Module updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase.from('modules').delete().eq('id', moduleId);
      if (deleteError) throw deleteError;

      setModules(modules.filter((m) => m.id !== moduleId));
      setSuccess('Module deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
    if (!confirm('Delete this lesson?')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (deleteError) throw deleteError;

      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      setSuccess('Lesson deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-lg text-gray-600">Loading course...</div>
      </motion.div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <Link to="/admin" className="text-primary hover:underline">
            Back to Admin Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start justify-between gap-4"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600">
                Add modules and lessons with videos, audio, and PDF documents
              </p>
            </motion.div>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-lg font-medium hover:bg-gray-50 transition-colors shrink-0"
            >
              <Edit2 className="h-4 w-4" />
              Edit Course Info
            </button>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </motion.div>
        )}

        {showCourseForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-xl p-6 border border-border/30 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        difficulty: e.target.value as CourseFormData['difficulty'],
                      })
                    }
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={courseForm.thumbnail_url}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="px-6 py-2 border border-border/50 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}

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
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/5 px-6 py-4 border-b border-border/20 flex items-center justify-between gap-4">
                  {editingModuleId === module.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingModuleTitle}
                        onChange={(e) => setEditingModuleTitle(e.target.value)}
                        className="flex-1 px-3 py-1 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => handleUpdateModule(module.id)}
                        className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingModuleId(null);
                          setEditingModuleTitle('');
                        }}
                        className="px-3 py-1 border border-border/50 text-sm rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-bold">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.lessons.length} lessons</p>
                    </motion.div>
                  )}
                  {editingModuleId !== module.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingModuleId(module.id);
                          setEditingModuleTitle(module.title);
                        }}
                        className="p-2 hover:bg-gray-100 text-gray-600 hover:text-primary rounded transition-colors"
                        title="Edit module"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                        title="Delete module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
                  {module.lessons.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No lessons in this module</p>
                  ) : (
                    module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 bg-gray-50 rounded-lg border border-border/20 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{lesson.title}</h4>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 flex gap-2 flex-wrap"
                          >
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
                                PDF
                              </span>
                            )}
                          </motion.div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Link
                            to={`/admin/lessons/${lesson.id}/edit`}
                            className="p-2 hover:bg-gray-100 text-gray-600 hover:text-primary rounded transition-colors"
                            title="Edit lesson"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(lesson.id, module.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                            title="Delete lesson"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
                </motion.div>
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
