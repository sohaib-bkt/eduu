import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useParams } from 'react-router-dom';

interface LessonFormData {
  title: string;
  video_url: string;
  audio_url: string;
  pdf_url: string;
  duration: number;
  is_free: boolean;
}

const defaultForm: LessonFormData = {
  title: '',
  video_url: '',
  audio_url: '',
  pdf_url: '',
  duration: 0,
  is_free: false,
};

export default function AddLessonPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [formData, setFormData] = useState<LessonFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    file: File,
    bucket: 'videos' | 'audios' | 'pdfs',
    fieldName: 'video_url' | 'audio_url' | 'pdf_url'
  ) => {
    if (!file) return;

    setError('');
    setUploadProgress({ ...uploadProgress, [fieldName]: 0 });

    const fileExt = file.name.split('.').pop();
    const fileName = `${moduleId}/${Date.now()}.${fileExt}`;

    try {
      // Note: In production, use resumable uploads or chunking for large files
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

      setFormData({
        ...formData,
        [fieldName]: publicUrlData.publicUrl,
      });

      setSuccess(`${bucket === 'videos' ? 'Video' : bucket === 'audios' ? 'Audio' : 'PDF'} uploaded successfully!`);
      setUploadProgress({ ...uploadProgress, [fieldName]: 100 });
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Lesson title is required');
      return;
    }

    if (!formData.video_url && !formData.audio_url && !formData.pdf_url) {
      setError('Please upload at least one resource (video, audio, or PDF)');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('lessons')
        .insert([
          {
            module_id: moduleId,
            title: formData.title,
            video_url: formData.video_url || null,
            audio_url: formData.audio_url || null,
            pdf_url: formData.pdf_url || null,
            duration: formData.duration || 0,
            is_free: formData.is_free,
            order_index: 0,
          },
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess('Lesson created successfully!');
      setFormData(defaultForm);
      setTimeout(() => {
        window.history.back();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Add videos, audio lessons, and PDF documents</p>
        </motion.div>

        {/* Alerts */}
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

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-border/30 shadow-sm"
        >
          <form onSubmit={handleAddLesson} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold mb-6">Lesson Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Calculus"
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 3600"
                    className="w-full px-4 py-2 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="h-4 w-4 text-primary rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Make this lesson free for preview</span>
                </label>
              </div>
            </div>

            {/* File Uploads */}
            <div>
              <h2 className="text-xl font-bold mb-6">Upload Resources</h2>
              <div className="space-y-6">
                {/* Video Upload */}
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Video Lesson</h3>
                      <p className="text-sm text-gray-600">MP4, WebM (up to 500MB)</p>
                    </div>
                  </div>

                  {formData.video_url ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium">✓ Video uploaded successfully</p>
                      <p className="text-xs text-green-600 mt-1 break-all">{formData.video_url}</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video_url: '' })}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full py-3 border border-border/50 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      Click to upload or drag & drop
                    </button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'videos', 'video_url');
                    }}
                  />
                </div>

                {/* Audio Upload */}
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Audio Lesson</h3>
                      <p className="text-sm text-gray-600">MP3, WAV, M4A (up to 100MB)</p>
                    </div>
                  </div>

                  {formData.audio_url ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium">✓ Audio uploaded successfully</p>
                      <p className="text-xs text-green-600 mt-1 break-all">{formData.audio_url}</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, audio_url: '' })}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="w-full py-3 border border-border/50 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      Click to upload or drag & drop
                    </button>
                  )}
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'audios', 'audio_url');
                    }}
                  />
                </div>

                {/* PDF Upload */}
                <div className="border-2 border-dashed border-amber-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">PDF Document</h3>
                      <p className="text-sm text-gray-600">PDF only (up to 50MB)</p>
                    </div>
                  </div>

                  {formData.pdf_url ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium">✓ PDF uploaded successfully</p>
                      <p className="text-xs text-green-600 mt-1 break-all">{formData.pdf_url}</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, pdf_url: '' })}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="w-full py-3 border border-border/50 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      Click to upload or drag & drop
                    </button>
                  )}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'pdfs', 'pdf_url');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t border-border/20">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-border/50 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
