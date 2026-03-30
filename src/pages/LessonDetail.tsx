import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getLessonById, updateLessonSummary, createQuizFromAI, getQuizzesByLesson } from '../lib/api';
import { analyzeLessonMedia } from '../lib/gemini';
import { ArrowLeft, BookOpen, Clock, HelpCircle, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
  video_url?: string | null;
  audio_url?: string | null;
  pdf_url?: string | null;
  module_id?: string;
  content?: string | null;
}

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<{ video?: string; audio?: string; pdf?: string }>({});
  const [user, setUser] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle');
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getLessonById(id);
        setLesson(data);

        // Check if lesson already has a quiz
        const quizzes = await getQuizzesByLesson(id);
        setHasQuiz(quizzes && quizzes.length > 0);

        const tryParseBucketAndPath = (u: string) => {
          try {
            const parsedUrl = new URL(u);
            const m = parsedUrl.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
            if (m) return { bucket: m[1], path: decodeURIComponent(m[2]) };
          } catch (e) {
            // not a full URL
          }
          const parts = u.split('/');
          if (parts.length > 1 && ['videos', 'audios', 'pdfs'].includes(parts[0])) {
            return { bucket: parts[0], path: parts.slice(1).join('/') };
          }
          return { bucket: null as null, path: u };
        };

        const resolved: { video?: string; audio?: string; pdf?: string } = {};

        if (data?.video_url) {
          const parsed = tryParseBucketAndPath(data.video_url as string);
          if (parsed.bucket) {
            const { data: pub } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path);
            resolved.video = pub?.publicUrl || undefined;
          } else {
            resolved.video = data.video_url as string;
          }
        }

        if (data?.audio_url) {
          const parsed = tryParseBucketAndPath(data.audio_url as string);
          if (parsed.bucket) {
            const { data: pub } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path);
            resolved.audio = pub?.publicUrl || undefined;
          } else {
            resolved.audio = data.audio_url as string;
          }
        }

        if (data?.pdf_url) {
          const parsed = tryParseBucketAndPath(data.pdf_url as string);
          if (parsed.bucket) {
            const { data: pub } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path);
            resolved.pdf = pub?.publicUrl || undefined;
          } else {
            resolved.pdf = data.pdf_url as string;
          }
        }

        setMedia(resolved);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAIAnalysis = async () => {
    if (!lesson || !id) return;

    setAnalyzing(true);
    setAnalysisStatus('analyzing');

    try {
      const mediaUrl = media.video || media.audio || media.pdf;
      const mediaType = media.video ? 'video' : media.audio ? 'audio' : 'pdf';

      if (!mediaUrl) {
        throw new Error("No media available to analyze");
      }

      const result = await analyzeLessonMedia(mediaUrl, mediaType);

      // Update lesson summary in DB
      await updateLessonSummary(id, result.summary);

      // Update local state
      setLesson({ ...lesson, content: result.summary });

      // Create quiz if it doesn't exist
      if (!hasQuiz && result.quiz) {
        await createQuizFromAI(id, result.quiz);
        setHasQuiz(true);
      }

      setAnalysisStatus('done');
      setTimeout(() => setAnalysisStatus('idle'), 3000);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAnalysisStatus('error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!lesson) return <div className="min-h-screen flex items-center justify-center">Lesson not found</div>;

  const minutes = Math.round((lesson.duration || 0) / 60);

  const canView = user || lesson.is_free;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-primary font-medium mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Lesson</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{minutes} min</span>
                </div>
              </div>
            </div>

            {canView && (
              <button
                onClick={handleAIAnalysis}
                disabled={analyzing}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${analysisStatus === 'done'
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : analysisStatus === 'error'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                  }`}
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : analysisStatus === 'done' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {analyzing ? 'Analyzing...' : analysisStatus === 'done' ? 'Analyzed' : 'Analyze with AI'}
              </button>
            )}
          </div>

          {!canView && (
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 mb-6">
              Please sign in or enroll to access this lesson.
            </div>
          )}

          {canView && (
            <div className="space-y-8">
              {media.video && (
                <VideoPlayer src={media.video} title={lesson.title} />
              )}

              {media.audio && (
                <div className="p-6 bg-muted/20 rounded-xl border border-border/50">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Audio Lesson
                  </h3>
                  <audio controls src={media.audio} className="w-full" />
                </div>
              )}

              {media.pdf && (
                <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                  <iframe src={media.pdf} title="PDF" className="w-full h-[700px]" />
                </div>
              )}

              {!media.video && !media.audio && !media.pdf && (
                <div className="p-6 bg-muted/10 rounded-lg text-center text-muted-foreground">
                  No media available for this lesson.
                </div>
              )}

              {/* Summary Section */}
              <AnimatePresence>
                {lesson.content && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xl font-bold text-primary">
                      <Sparkles className="h-5 w-5" />
                      AI Summary
                    </div>
                    <div className="prose dark:prose-invert max-w-none p-6 bg-primary/5 rounded-2xl border border-primary/10">
                      {lesson.content.split('\n').map((para, i) => (
                        <p key={i} className="mb-4 text-foreground/80 leading-relaxed last:mb-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quiz Section */}
              {(hasQuiz || analysisStatus === 'done') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-border/30"
                >
                  <button
                    onClick={() => navigate(`/quiz/${id}`)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Take Quiz
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
