import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import { getQuizzesByLesson, submitQuiz } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_option: number;
  explanation?: string;
}

interface QuizState {
  currentQuestion: number;
  userAnswers: (number | null)[];
  submitted: boolean;
}

export default function QuizDetail() {
  const { lessonId } = useParams<{ lessonId: string }>(); // Getting lessonId from path="quiz/:lessonId"
  const id = lessonId; // Alias to match the rest of the file variable without changing everything
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    userAnswers: [],
    submitted: false,
  });

  useEffect(() => {
    let mounted = true;

    async function loadQuiz() {
      if (!id) {
        if (mounted) {
          setError('No lesson ID provided in URL.');
          setLoading(false);
        }
        return;
      }

      console.log('Loading quiz for lesson ID:', id);

      try {
        setLoading(true);
        const quizzes = await getQuizzesByLesson(id);
        console.log('Fetched quizzes:', quizzes);

        if (!mounted) return;

        if (!quizzes || quizzes.length === 0) {
          setError('No quiz found for this lesson. You may need to run the AI analysis first.');
          return;
        }

        const quiz = quizzes[0];
        setQuizId(quiz.id);

        const dbQuestions = quiz.quiz_questions || [];
        dbQuestions.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

        const mappedQuestions: Question[] = dbQuestions.map((q: any) => {
          const opts = q.quiz_options || [];
          opts.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

          const correctIndex = opts.findIndex((o: any) => o.is_correct);

          return {
            id: q.id,
            question: q.question_text,
            options: opts.map((o: any) => o.option_text),
            correct_option: correctIndex !== -1 ? correctIndex : 0,
            explanation: q.explanation
          };
        });

        if (mappedQuestions.length === 0) {
          setError('This quiz exists but has no questions.');
          return;
        }

        setQuestions(mappedQuestions);
        setQuizState({
          currentQuestion: 0,
          userAnswers: new Array(mappedQuestions.length).fill(null),
          submitted: false,
        });
        console.log('Loaded mapped questions:', mappedQuestions);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load quiz metadata. Please check database connection.');
        console.error('Quiz load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuiz();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="p-6 bg-card rounded-xl shadow-sm border border-border/50 max-w-md w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Quiz</h2>
          <p className="text-muted-foreground mb-6">{error || 'No questions available.'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];
  const isLastQuestion = quizState.currentQuestion === questions.length - 1;
  const allAnswered = quizState.userAnswers.every((ans) => ans !== null);

  const handleSelectAnswer = (optionIndex: number) => {
    if (quizState.submitted) return;

    const newAnswers = [...quizState.userAnswers];
    newAnswers[quizState.currentQuestion] = optionIndex;
    setQuizState({ ...quizState, userAnswers: newAnswers });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
      });
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestion > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion - 1,
      });
    }
  };

  const handleSubmit = async () => {
    if (allAnswered && !submitting) {
      setSubmitting(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && quizId) {
          const passThreshold = 70;
          const currentScore = quizState.userAnswers.reduce((acc: number, answer: number | null, idx: number) => {
            return acc + (answer === questions[idx].correct_option ? 1 : 0);
          }, 0);
          const currentPercentage = Math.round((currentScore / questions.length) * 100);
          const passed = currentPercentage >= passThreshold;

          await submitQuiz(quizId, session.user.id, currentPercentage, passed);
        }
      } catch (err) {
        console.error('Error submitting quiz:', err);
      } finally {
        setSubmitting(false);
        setQuizState({ ...quizState, submitted: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleReset = () => {
    setQuizState({
      currentQuestion: 0,
      userAnswers: new Array(questions.length).fill(null),
      submitted: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = quizState.userAnswers.reduce((acc: number, answer: number | null, idx: number) => {
    return acc + (answer === questions[idx].correct_option ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  if (quizState.submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary font-medium mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 sm:p-12 border border-border/50 shadow-sm text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="mx-auto mb-6"
            >
              {passed ? (
                <div className="flex justify-center">
                  <CheckCircle className="h-24 w-24 text-green-500" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <XCircle className="h-24 w-24 text-red-500" />
                </div>
              )}
            </motion.div>

            <h2 className="text-4xl font-bold mb-4">
              {passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h2>

            <div className="bg-muted/50 rounded-xl p-8 mb-8">
              <p className="text-6xl font-bold text-primary mb-2">{percentage}%</p>
              <p className="text-lg text-muted-foreground">
                You answered {score} out of {questions.length} questions correctly
              </p>
            </div>

            <div className="mb-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Answer Review</h3>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const isCorrect = quizState.userAnswers[idx] === q.correct_option;
                  const userAnswer = quizState.userAnswers[idx];

                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Question {idx + 1}: {q.question}
                          </p>
                          <p className="text-sm mt-1">
                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              Your answer:{' '}
                              {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700 mt-1">
                              Correct answer: {q.options[q.correct_option]}
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-sm mt-2 text-muted-foreground italic">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Retake Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-2)}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
              >
                Back to Lesson
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </motion.button>
          <div className="text-sm text-muted-foreground font-medium">
            Question {quizState.currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <motion.div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{
              width: `${((quizState.currentQuestion + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          key={quizState.currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>

          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = quizState.userAnswers[quizState.currentQuestion] === idx;

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 bg-card hover:border-primary/50'
                    } ${
                      isSelected &&
                      !quizState.submitted &&
                      'ring-2 ring-primary ring-offset-2'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={quizState.currentQuestion === 0}
              className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Previous
            </motion.button>

            {!isLastQuestion && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={quizState.userAnswers[quizState.currentQuestion] === null}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Next
              </motion.button>
            )}

            {isLastQuestion && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex align-center justify-center"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : "Submit Quiz"}
              </motion.button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Questions answered:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    if (quizState.userAnswers[idx] !== null) {
                      setQuizState({ ...quizState, currentQuestion: idx });
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    quizState.currentQuestion === idx
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : quizState.userAnswers[idx] !== null
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
