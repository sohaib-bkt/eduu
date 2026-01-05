import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_option: number; // index of correct option
  explanation?: string;
}

interface QuizState {
  currentQuestion: number;
  userAnswers: (number | null)[]; // user's answer index for each question
  submitted: boolean;
}

// Demo quiz questions for the lesson
const DEMO_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct_option: 2,
    explanation: 'Paris is the capital and largest city of France.',
  },
  {
    id: '2',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correct_option: 1,
    explanation: 'Mercury is the smallest planet and closest to the Sun in our solar system.',
  },
  {
    id: '3',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct_option: 2,
    explanation: 'Au is the chemical symbol for Gold, from its Latin name "Aurum".',
  },
  {
    id: '4',
    question: 'Which of these is a programming language?',
    options: ['HTML', 'Python', 'CSS', 'XML'],
    correct_option: 1,
    explanation: 'Python is a high-level programming language used for web development, data analysis, AI, and more.',
  },
  {
    id: '5',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correct_option: 3,
    explanation: 'The Pacific Ocean is the largest and deepest of the five oceanic divisions.',
  },
];

export default function QuizDetail() {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    userAnswers: new Array(DEMO_QUESTIONS.length).fill(null),
    submitted: false,
  });

  const currentQuestion = DEMO_QUESTIONS[quizState.currentQuestion];
  const isLastQuestion = quizState.currentQuestion === DEMO_QUESTIONS.length - 1;
  const allAnswered = quizState.userAnswers.every((ans) => ans !== null);

  const handleSelectAnswer = (optionIndex: number) => {
    if (quizState.submitted) return; // Prevent changes after submission

    const newAnswers = [...quizState.userAnswers];
    newAnswers[quizState.currentQuestion] = optionIndex;
    setQuizState({ ...quizState, userAnswers: newAnswers });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
      });
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion - 1,
      });
    }
  };

  const handleSubmit = () => {
    if (allAnswered) {
      setQuizState({ ...quizState, submitted: true });
    }
  };

  const handleReset = () => {
    setQuizState({
      currentQuestion: 0,
      userAnswers: new Array(DEMO_QUESTIONS.length).fill(null),
      submitted: false,
    });
  };

  // Calculate score
  const score = quizState.userAnswers.reduce((acc: number, answer: number | null, idx: number) => {
    return acc + (answer === DEMO_QUESTIONS[idx].correct_option ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / DEMO_QUESTIONS.length) * 100);
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
            className="bg-card rounded-2xl p-12 border border-border/50 shadow-sm text-center"
          >
            {/* Result Icon */}
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

            {/* Result Text */}
            <h2 className="text-4xl font-bold mb-4">
              {passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h2>

            <div className="bg-muted/50 rounded-xl p-8 mb-8">
              <p className="text-6xl font-bold text-primary mb-2">{percentage}%</p>
              <p className="text-lg text-muted-foreground">
                You answered {score} out of {DEMO_QUESTIONS.length} questions correctly
              </p>
            </div>

            {/* Answer Review */}
            <div className="mb-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Answer Review</h3>
              <div className="space-y-4">
                {DEMO_QUESTIONS.map((q, idx) => {
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

            {/* Action Buttons */}
            <div className="flex gap-4">
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
        {/* Header */}
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
            Question {quizState.currentQuestion + 1} of {DEMO_QUESTIONS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{
              width: `${((quizState.currentQuestion + 1) / DEMO_QUESTIONS.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          key={quizState.currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm"
        >
          {/* Question */}
          <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>

          {/* Options */}
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
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
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

          {/* Navigation Buttons */}
          <div className="flex gap-4">
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
                disabled={!allAnswered}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
              >
                Submit Quiz
              </motion.button>
            )}
          </div>

          {/* Question Indicator */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Questions answered:</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_QUESTIONS.map((_, idx) => (
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
