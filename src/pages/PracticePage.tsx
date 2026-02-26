import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  Calculator,
  Flag,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { getSubjects, getTopics, getQuestionsWithUploaded, Question } from '@/data/questionBank';
import { toNumericId } from '@/lib/utils';

type PracticeView = 'select-subject' | 'select-topic' | 'practice' | 'result';

interface PracticePageProps {
  onOpenMenu: () => void;
}

export function PracticePage({ onOpenMenu }: PracticePageProps) {
  const { currentUser, updateUserStats, theme } = useStore();
  const level = currentUser?.academicLevel || 'JAMB';
  const isDark = theme === 'dark';

  const [view, setView] = useState<PracticeView>('select-subject');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const subjects = getSubjects(level);
  const topics = selectedSubject ? getTopics(level, selectedSubject) : [];

  const handleBack = () => {
    if (view === 'select-topic') setView('select-subject');
    else if (view === 'practice') setView('select-topic');
    else if (view === 'result') setView('select-subject');
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setView('select-topic');
  };

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    // Use async function that includes uploaded questions
    const qs = await getQuestionsWithUploaded(level, selectedSubject, topic, undefined, 20);
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview(new Set());
    setView('practice');
  };

  const handleSelectAnswer = async (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { selected: answer, correct: isCorrect }
    }));

    // Save to IndexedDB
    if (currentUser) {
      await db.questionAttempts.add({
        userId: toNumericId(currentUser.id),
        questionId: questions[currentIndex].id,
        subject: selectedSubject,
        topic: selectedTopic,
        difficulty: questions[currentIndex].difficulty,
        isCorrect,
        timeSpent: 0,
        timestamp: new Date()
      });
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Update user stats
      const correctCount = Object.values(answers).filter(a => a.correct).length;
      updateUserStats(Object.keys(answers).length, correctCount);
      setView('result');
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setSelectedAnswer(answers[index]?.selected || null);
    setShowExplanation(!!answers[index]);
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcValue('0');
    } else if (val === 'CE') {
      setCalcValue('0');
      setCalcHistory([]);
    } else if (val === '⌫') {
      setCalcValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        const expression = calcValue
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/√/g, 'Math.sqrt')
          .replace(/π/g, 'Math.PI')
          .replace(/\^/g, '**');
        const result = Function('"use strict"; return (' + expression + ')')();
        const resultStr = String(Number(result.toFixed(10)));
        setCalcHistory(prev => [...prev.slice(-4), `${calcValue} = ${resultStr}`]);
        setCalcValue(resultStr);
      } catch {
        setCalcValue('Error');
      }
    } else if (val === '±') {
      setCalcValue(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    } else if (val === '%') {
      try {
        const result = parseFloat(calcValue) / 100;
        setCalcValue(String(result));
      } catch {
        setCalcValue('Error');
      }
    } else {
      setCalcValue(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };

  const currentQuestion = questions[currentIndex];
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const accuracy = Object.keys(answers).length > 0 
    ? Math.round((correctCount / Object.keys(answers).length) * 100) 
    : 0;

  const getTitle = () => {
    if (view === 'select-subject') return 'Practice';
    if (view === 'select-topic') return selectedSubject;
    if (view === 'practice') return selectedTopic;
    return 'Results';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Page Header */}
      <PageHeader 
        title="Practice" 
        onOpenMenu={onOpenMenu}
        rightContent={
          <button 
            onClick={() => setShowCalculator(!showCalculator)} 
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${showCalculator ? 'bg-primary/20 text-primary' : isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Calculator size={18} strokeWidth={1.5} />
          </button>
        }
      />
      
      {/* Sub-header for navigation */}
      {view !== 'select-subject' && (
        <div className={`px-4 py-2 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              {getTitle()}
            </span>
            <button 
              onClick={handleBack} 
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <RotateCcw size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-6 max-w-2xl mx-auto pb-24">
        <AnimatePresence mode="wait">
          {/* Subject Selection */}
          {view === 'select-subject' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <p className={`${isDark ? 'text-white/60' : 'text-gray-500'} mb-4`}>Choose a subject to practice</p>
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard onClick={() => handleSelectSubject(subject)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                          <BookOpen size={22} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{subject}</span>
                      </div>
                      <ChevronRight size={20} className={isDark ? 'text-white/40' : 'text-gray-400'} strokeWidth={1.5} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Topic Selection */}
          {view === 'select-topic' && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <p className={`${isDark ? 'text-white/60' : 'text-gray-500'} mb-4`}>Choose a topic</p>
              {topics.map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard onClick={() => handleSelectTopic(topic)}>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{topic}</span>
                      <ChevronRight size={20} className={isDark ? 'text-white/40' : 'text-gray-400'} strokeWidth={1.5} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Practice Mode */}
          {view === 'practice' && currentQuestion && (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className={`text-sm font-medium ${accuracy >= 70 ? 'text-green-500' : accuracy >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {accuracy}% Accuracy
                </span>
              </div>
              <div className={`h-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>

              {/* Question Number Grid */}
              <div className="flex flex-wrap gap-2 py-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      idx === currentIndex 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : answers[idx]?.correct 
                          ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                          : answers[idx] 
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : markedForReview.has(idx)
                              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                              : isDark 
                                ? 'bg-white/5 text-white/60 border border-white/10'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Question Card */}
              <GlassCard className="py-6" hover={false}>
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMarkForReview}
                    className={`p-2 rounded-lg transition-colors ${markedForReview.has(currentIndex) ? 'bg-yellow-500/20 text-yellow-500' : isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Flag size={18} strokeWidth={1.5} />
                  </motion.button>
                </div>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentQuestion.text}
                </p>
              </GlassCard>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isSelected = selectedAnswer === letter;
                  const isCorrect = letter === currentQuestion.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <motion.button
                      key={idx}
                      whileTap={!selectedAnswer ? { scale: 0.98 } : undefined}
                      onClick={() => handleSelectAnswer(letter)}
                      disabled={!!selectedAnswer}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        showResult && isCorrect
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : showResult && isSelected && !isCorrect
                            ? 'bg-red-500/20 border-2 border-red-500'
                            : isSelected
                              ? 'bg-primary/20 border-2 border-primary'
                              : isDark
                                ? 'bg-white/5 border border-white/10 hover:border-white/20'
                                : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                          showResult && isCorrect
                            ? 'bg-green-500 text-white'
                            : showResult && isSelected && !isCorrect
                              ? 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-primary text-white'
                                : isDark
                                  ? 'bg-white/10 text-white/60'
                                  : 'bg-gray-100 text-gray-600'
                        }`}>
                          {letter}
                        </span>
                        <span className={`flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{option}</span>
                        {showResult && isCorrect && <CheckCircle size={22} className="text-green-500" strokeWidth={1.5} />}
                        {showResult && isSelected && !isCorrect && <XCircle size={22} className="text-red-500" strokeWidth={1.5} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <GlassCard className="border-l-4 border-l-primary" hover={false}>
                      <p className="text-sm font-semibold text-primary mb-2">Explanation</p>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                        {currentQuestion.explanation}
                      </p>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {showExplanation && (
                <Button onClick={handleNext} fullWidth icon={<ArrowRight size={20} strokeWidth={1.5} />}>
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </Button>
              )}
            </motion.div>
          )}

          {/* Results */}
          {view === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <GlassCard className="py-8" hover={false} neonBorder>
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  accuracy >= 70 ? 'bg-green-500/20' : accuracy >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  {accuracy >= 70 
                    ? <CheckCircle size={40} className="text-green-500" strokeWidth={1.5} />
                    : <XCircle size={40} className={accuracy >= 50 ? 'text-yellow-500' : 'text-red-500'} strokeWidth={1.5} />
                  }
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {accuracy >= 70 ? 'Excellent!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
                </h2>
                <p className="text-4xl font-black text-primary mb-2">
                  {correctCount}/{questions.length}
                </p>
                <p className={isDark ? 'text-white/60' : 'text-gray-500'}>
                  {accuracy}% Accuracy
                </p>
              </GlassCard>

              <div className="grid grid-cols-2 gap-3">
                <GlassCard className="text-center py-4" hover={false}>
                  <p className="text-2xl font-bold text-green-500">{correctCount}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Correct</p>
                </GlassCard>
                <GlassCard className="text-center py-4" hover={false}>
                  <p className="text-2xl font-bold text-red-500">{questions.length - correctCount}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Wrong</p>
                </GlassCard>
              </div>

              <Button onClick={() => setView('select-subject')} fullWidth icon={<RotateCcw size={20} strokeWidth={1.5} />}>
                Practice Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scientific Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-sm ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-4 border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}
            >
              {/* Calculator History */}
              {calcHistory.length > 0 && (
                <div className={`mb-2 text-right text-xs ${isDark ? 'text-white/40' : 'text-gray-400'} max-h-12 overflow-y-auto`}>
                  {calcHistory.map((h, i) => (
                    <div key={i}>{h}</div>
                  ))}
                </div>
              )}
              
              {/* Display */}
              <div className={`${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-xl p-4 mb-3 text-right`}>
                <p className={`text-3xl font-mono truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{calcValue}</p>
              </div>
              
              {/* Scientific Functions Row */}
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {['√', '^', 'π', '(', ')'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              
              {/* Main Calculator Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {['CE', 'C', '⌫', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '±', '0', '.', '='].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-3.5 rounded-xl text-lg font-semibold transition-all active:scale-95 ${
                      btn === '=' ? 'bg-primary text-white' :
                      btn === 'C' || btn === 'CE' ? 'bg-red-500/80 text-white' :
                      btn === '⌫' ? 'bg-orange-500/80 text-white' :
                      ['+', '-', '×', '÷'].includes(btn) ? 'bg-accent/80 text-white' :
                      isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              
              {/* Extra Functions */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {['%', 'sin', 'cos', 'tan'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '%') handleCalcButton('%');
                      else setCalcValue(prev => `Math.${btn}(${prev})`);
                    }}
                    className={`p-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
