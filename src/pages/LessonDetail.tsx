import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getLessonById, getQuizzesByLesson } from '../lib/api';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
  video_url?: string | null;
  audio_url?: string | null;
  pdf_url?: string | null;
  module_id?: string;
}

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<{ video?: string; audio?: string; pdf?: string }>({});
  const [user, setUser] = useState<any>(null);

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
            resolved.video = pub?.publicUrl || null;
          } else {
            resolved.video = data.video_url as string;
          }
        }

        if (data?.audio_url) {
          const parsed = tryParseBucketAndPath(data.audio_url as string);
          if (parsed.bucket) {
            const { data: pub } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path);
            resolved.audio = pub?.publicUrl || null;
          } else {
            resolved.audio = data.audio_url as string;
          }
        }

        if (data?.pdf_url) {
          const parsed = tryParseBucketAndPath(data.pdf_url as string);
          if (parsed.bucket) {
            const { data: pub } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path);
            resolved.pdf = pub?.publicUrl || null;
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
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Lesson</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{minutes} min</span>
            </div>
          </div>

          {!canView && (
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 mb-6">
              Please sign in or enroll to access this lesson.
            </div>
          )}

          {canView && (
            <div className="space-y-6">
              {media.video && (
                <video controls src={media.video} className="w-full rounded-lg max-h-[640px] object-contain" />
              )}

              {media.audio && (
                <audio controls src={media.audio} className="w-full" />
              )}

              {media.pdf && (
                <div className="border rounded-lg overflow-hidden">
                  <iframe src={media.pdf} title="PDF" className="w-full h-[700px]" />
                </div>
              )}

              {!media.video && !media.audio && !media.pdf && (
                <div className="p-6 bg-muted/10 rounded-lg">No media available for this lesson.</div>
              )}

              {/* TODO: quizzes, resources, notes */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
