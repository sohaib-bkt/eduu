import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, BookOpen, AlertCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import AdminSupport from '../components/AdminSupport';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail_url: string;
  created_at: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
}

const defaultForm: CourseFormData = {
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  thumbnail_url: '',
};

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'support'>('courses');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      setUser(sessionData.session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionData.session.user.id)
        .single();

      if (profileData?.role !== 'admin') {
        setError('Access denied: Admin role required');
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      fetchCourses();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category || '',
      difficulty: (course.difficulty as CourseFormData['difficulty']) || 'beginner',
      thumbnail_url: course.thumbnail_url || '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const resetCourseForm = () => {
    setFormData(defaultForm);
    setEditingCourseId(null);
    setShowForm(false);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        thumbnail_url: formData.thumbnail_url,
      };

      if (editingCourseId) {
        const { error: updateError } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', editingCourseId);

        if (updateError) throw updateError;
        setSuccess('Course updated successfully!');
      } else {
        const { error: insertError } = await supabase.from('courses').insert([
          {
            ...payload,
            instructor_id: user.id,
          },
        ]);

        if (insertError) throw insertError;
        setSuccess('Course created successfully!');
      }

      resetCourseForm();
      fetchCourses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? All modules and lessons will be removed.')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase.from('courses').delete().eq('id', courseId);
      if (deleteError) throw deleteError;

      if (editingCourseId === courseId) {
        resetCourseForm();
      }

      setSuccess('Course deleted successfully!');
      fetchCourses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-xl p-8 max-w-md text-center border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error || 'Admin role required to access this page.'}</p>
          <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Go Home
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage courses, videos, audio lessons, and PDFs</p>
            </div>
            <button
              onClick={() => (showForm ? resetCourseForm() : setShowForm(true))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              {showForm ? 'Cancel' : 'Add Course'}
            </button>
          </div>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{success}</p>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 border-b border-border/20">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'courses'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'support'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Support Messages
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'courses' && (
          <>
        {/* Course Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-white rounded-xl p-8 border border-border/30 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourseId ? 'Edit Course' : 'Create New Course'}
            </h2>
            <form onSubmit={handleSaveCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Advanced Calculus"
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Mathematics"
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your course..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
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
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetCourseForm}
                  className="px-6 py-2 border border-border/50 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingCourseId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📝 Next Steps:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Add modules to your course</li>
                <li>✓ Create lessons with videos, audio, and PDFs</li>
                <li>✓ Set pricing and publish</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Courses List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-xl border border-border/30 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/20">
              <h2 className="text-xl font-bold">Your Courses ({courses.length})</h2>
            </div>

            {courses.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No courses yet. Create your first course!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    className="p-6 flex items-start gap-4 transition-colors"
                  >
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary/50" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded">
                          {course.category || 'Uncategorized'}
                        </span>
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded capitalize">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCourse(course)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                        title="Edit course details"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Manage modules and lessons"
                      >
                        <BookOpen className="h-5 w-5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
          </>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AdminSupport adminId={user?.id} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
