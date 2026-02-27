import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Flag,
  BarChart3,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Brain,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Menu,
  Calculator,
  Wifi
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { getSubjects, getAllQuestionsWithUploaded, Question } from '@/data/questionBank';
import { isFirebaseConfigured, subscribeToUploadedQuestions } from '@/lib/firebase';

type ExamView = 'setup' | 'exam' | 'result';

// JAMB Scoring System: Each subject has 60 questions worth 100 marks
// Total: 400 marks (4 subjects × 100 marks each)
// Actual formula: (Correct Answers / Total Questions) × 400

interface SubjectAnalysis {
  subject: string;
  correct: number;
  total: number;
  percentage: number;
  jambScore: number;
  grade: string;
  status: 'excellent' | 'good' | 'average' | 'poor' | 'fail';
  weakTopics: string[];
  recommendations: string[];
}

interface ExamAnalysis {
  overallScore: number;
  jambScore: number;
  percentile: number;
  grade: string;
  status: string;
  timeEfficiency: number;
  subjects: SubjectAnalysis[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  predictedRange: { min: number; max: number };
  universityChances: { tier: string; chance: string }[];
}

interface MockExamPageProps {
  onOpenMenu?: () => void;
}

export function MockExamPage({ onOpenMenu }: MockExamPageProps) {
  const { currentUser, updateUserStats, theme, incrementMockExams, mockExamsTaken } = useStore();
  const level = currentUser?.academicLevel || 'JAMB';
  
  // Track if this is the first mock exam to trigger rating popup
  const isFirstMockExam = mockExamsTaken === 0;

  const [view, setView] = useState<ExamView>('setup');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [questionCount, setQuestionCount] = useState(40);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const subjects = getSubjects(level);
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/60' : 'text-gray-600';
  const bgCard = isDark ? '' : 'bg-white';
  const useFirebase = isFirebaseConfigured();
  
  // Real-time uploaded questions count
  const [uploadedQuestionsCount, setUploadedQuestionsCount] = useState(0);
  
  useEffect(() => {
    if (!useFirebase) return;
    
    // Subscribe to real-time uploaded questions count
    const unsubscribe = subscribeToUploadedQuestions((questions) => {
      const filtered = questions.filter(
        (q: any) => q.level === level && q.isActive !== false
      );
      setUploadedQuestionsCount(filtered.length);
    });
    
    return () => unsubscribe();
  }, [level, useFirebase]);

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

  // Timer effect
  useEffect(() => {
    if (view !== 'exam' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const startExam = async () => {
    if (selectedSubjects.length === 0) return;
    
    // Use async function that includes uploaded questions
    const qs = await getAllQuestionsWithUploaded(level, selectedSubjects, questionCount);
    setQuestions(qs);
    setTimeLeft(duration * 60);
    setAnswers({});
    setMarkedForReview(new Set());
    setCurrentIndex(0);
    setView('exam');
    
    // Increment mock exam counter (triggers rating popup after first exam)
    if (isFirstMockExam) {
      incrementMockExams();
    }
  };

  const handleSelectAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleMark = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) newSet.delete(currentIndex);
      else newSet.add(currentIndex);
      return newSet;
    });
  };

  const calculateJAMBScore = (correct: number, total: number): number => {
    // Real JAMB scoring: Each correct answer = (400 / total questions) marks
    // For standard JAMB: 180 questions = 400 marks, so each = 2.22 marks
    // We simulate this proportionally
    return Math.round((correct / total) * 400);
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 75) return 'A';
    if (percentage >= 65) return 'B';
    if (percentage >= 55) return 'C';
    if (percentage >= 45) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };

  const getStatus = (percentage: number): 'excellent' | 'good' | 'average' | 'poor' | 'fail' => {
    if (percentage >= 75) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 50) return 'average';
    if (percentage >= 40) return 'poor';
    return 'fail';
  };

  const getPercentile = (jambScore: number): number => {
    // Estimated percentile based on JAMB score distribution
    if (jambScore >= 350) return 99;
    if (jambScore >= 320) return 95;
    if (jambScore >= 300) return 90;
    if (jambScore >= 280) return 80;
    if (jambScore >= 260) return 70;
    if (jambScore >= 240) return 60;
    if (jambScore >= 220) return 50;
    if (jambScore >= 200) return 40;
    if (jambScore >= 180) return 30;
    return 20;
  };

  const generateAnalysis = (): ExamAnalysis => {
    const subjectBreakdown: Record<string, { correct: number; total: number; topics: Record<string, { correct: number; total: number }> }> = {};

    questions.forEach((q, idx) => {
      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { correct: 0, total: 0, topics: {} };
      }
      subjectBreakdown[q.subject].total++;
      
      if (!subjectBreakdown[q.subject].topics[q.topic]) {
        subjectBreakdown[q.subject].topics[q.topic] = { correct: 0, total: 0 };
      }
      subjectBreakdown[q.subject].topics[q.topic].total++;

      if (answers[idx] === q.correctAnswer) {
        subjectBreakdown[q.subject].correct++;
        subjectBreakdown[q.subject].topics[q.topic].correct++;
      }
    });

    const totalCorrect = Object.values(subjectBreakdown).reduce((sum, s) => sum + s.correct, 0);
    const totalQuestions = questions.length;
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);
    const jambScore = calculateJAMBScore(totalCorrect, totalQuestions);
    const percentile = getPercentile(jambScore);
    const timeSpent = duration * 60 - timeLeft;
    const timeEfficiency = Math.round((timeSpent / (duration * 60)) * 100);

    const subjectAnalyses: SubjectAnalysis[] = Object.entries(subjectBreakdown).map(([subject, data]) => {
      const percentage = Math.round((data.correct / data.total) * 100);
      const weakTopics = Object.entries(data.topics)
        .filter(([_, t]) => (t.correct / t.total) < 0.5)
        .map(([topic]) => topic);
      
      const subjectJambScore = Math.round((data.correct / data.total) * 100); // Score per subject out of 100

      return {
        subject,
        correct: data.correct,
        total: data.total,
        percentage,
        jambScore: subjectJambScore,
        grade: getGrade(percentage),
        status: getStatus(percentage),
        weakTopics,
        recommendations: weakTopics.length > 0 
          ? [`Focus more on ${weakTopics.join(', ')} in ${subject}`, `Practice ${subject} questions daily`]
          : [`Maintain your excellent performance in ${subject}`]
      };
    });

    const strengths = subjectAnalyses
      .filter(s => s.percentage >= 70)
      .map(s => `Strong in ${s.subject} (${s.percentage}%)`);

    const weaknesses = subjectAnalyses
      .filter(s => s.percentage < 50)
      .map(s => `Needs improvement in ${s.subject} (${s.percentage}%)`);

    const allWeakTopics = subjectAnalyses.flatMap(s => s.weakTopics);
    
    const recommendations: string[] = [];
    if (jambScore < 200) {
      recommendations.push('Dedicate at least 4 hours daily to intensive study');
      recommendations.push('Focus on understanding concepts rather than memorization');
    } else if (jambScore < 280) {
      recommendations.push('Practice more past questions daily');
      recommendations.push('Work on time management during exams');
    } else {
      recommendations.push('Maintain your study routine');
      recommendations.push('Challenge yourself with harder questions');
    }
    
    if (allWeakTopics.length > 0) {
      recommendations.push(`Pay special attention to: ${allWeakTopics.slice(0, 3).join(', ')}`);
    }

    const universityChances = [
      { tier: 'Top Universities (UNILAG, UI, OAU)', chance: jambScore >= 280 ? 'High' : jambScore >= 250 ? 'Medium' : 'Low' },
      { tier: 'Federal Universities', chance: jambScore >= 250 ? 'High' : jambScore >= 200 ? 'Medium' : 'Low' },
      { tier: 'State Universities', chance: jambScore >= 200 ? 'High' : jambScore >= 180 ? 'Medium' : 'Low' },
      { tier: 'Private Universities', chance: jambScore >= 180 ? 'High' : jambScore >= 150 ? 'Medium' : 'Low' },
    ];

    return {
      overallScore: overallPercentage,
      jambScore,
      percentile,
      grade: getGrade(overallPercentage),
      status: jambScore >= 300 ? 'Excellent Performance!' : jambScore >= 250 ? 'Very Good Performance!' : jambScore >= 200 ? 'Good Performance' : 'Needs Improvement',
      timeEfficiency,
      subjects: subjectAnalyses,
      strengths,
      weaknesses,
      recommendations,
      predictedRange: { min: Math.max(0, jambScore - 25), max: Math.min(400, jambScore + 25) },
      universityChances
    };
  };

  const handleSubmit = useCallback(async () => {
    const analysis = generateAnalysis();

    // Save to IndexedDB
    if (currentUser) {
      await db.mockExamResults.add({
        userId: typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id,
        subjects: selectedSubjects,
        totalQuestions: questions.length,
        correctAnswers: Math.round((analysis.overallScore / 100) * questions.length),
        score: analysis.overallScore,
        jambScore: analysis.jambScore,
        duration: duration * 60,
        timeSpent: duration * 60 - timeLeft,
        subjectBreakdown: analysis.subjects.reduce((acc, s) => ({
          ...acc,
          [s.subject]: { correct: s.correct, total: s.total }
        }), {}),
        timestamp: new Date(),
        answers
      });

      updateUserStats(questions.length, Math.round((analysis.overallScore / 100) * questions.length));
    }

    setView('result');
  }, [questions, answers, currentUser, selectedSubjects, duration, timeLeft, updateUserStats]);

  const currentQuestion = questions[currentIndex];
  const analysis = view === 'result' ? generateAnalysis() : null;

  return (
    <div className={`min-h-screen ${isDark ? 'ambient-bg' : 'bg-gray-50'}`}>
      {/* Header with Menu + Title + Timer (left) + Calculator */}
      <div className={`sticky top-0 z-30 px-4 py-3 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Left side: Menu + Timer (during exam) or Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMenu} 
              className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            
            {view === 'exam' ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                timeLeft < 300 ? 'bg-error text-white animate-pulse' : isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
              }`}>
                <Clock size={18} strokeWidth={2} />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Mock Exam
              </h1>
            )}
          </div>
          
          {/* Right side: Calculator (during exam) */}
          {view === 'exam' && (
            <button 
              onClick={() => setShowCalculator(!showCalculator)} 
              className={`p-2.5 rounded-xl transition-colors ${showCalculator ? 'bg-primary/20 text-primary' : isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Calculator size={22} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {/* Setup */}
          {view === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* JAMB Info Card */}
              <GlassCard hover={false} className={`${bgCard} border-l-4 border-l-primary`}>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className={`font-bold ${textColor} mb-1`}>Real JAMB Scoring System</h3>
                    <p className={`text-sm ${textMuted}`}>
                      This mock exam uses the official JAMB scoring method. Your final score will be calculated out of 400 marks, just like the real exam.
                    </p>
                    {uploadedQuestionsCount > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Wifi size={14} className="text-green-500" />
                        <span className="text-xs text-green-500 font-medium">
                          +{uploadedQuestionsCount} questions synced from cloud
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover={false} className={bgCard}>
                <h2 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Select Subjects
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedSubjects.includes(subject)
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : isDark ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                {selectedSubjects.length > 0 && (
                  <p className={`text-sm ${textMuted} mt-3`}>
                    Selected: {selectedSubjects.join(', ')}
                  </p>
                )}
              </GlassCard>

              <GlassCard hover={false} className={bgCard}>
                <h2 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Exam Settings
                </h2>
                <div className="space-y-4">
                  <Select
                    label="Number of Questions"
                    value={questionCount.toString()}
                    onChange={e => setQuestionCount(parseInt(e.target.value))}
                    options={[
                      { value: '20', label: '20 Questions (Quick Test)' },
                      { value: '40', label: '40 Questions (Standard)' },
                      { value: '60', label: '60 Questions (Full Subject)' },
                      { value: '80', label: '80 Questions (Extended)' },
                      { value: '180', label: '180 Questions (Full JAMB Simulation)' }
                    ]}
                  />
                  <Select
                    label="Duration"
                    value={duration.toString()}
                    onChange={e => setDuration(parseInt(e.target.value))}
                    options={[
                      { value: '30', label: '30 Minutes' },
                      { value: '60', label: '1 Hour' },
                      { value: '90', label: '1.5 Hours' },
                      { value: '120', label: '2 Hours (JAMB Standard)' },
                      { value: '150', label: '2.5 Hours' }
                    ]}
                  />
                </div>
              </GlassCard>

              <Button 
                onClick={startExam} 
                fullWidth 
                disabled={selectedSubjects.length === 0}
                icon={<Play size={20} />}
              >
                Start JAMB Mock Exam
              </Button>
            </motion.div>
          )}

          {/* Exam */}
          {view === 'exam' && currentQuestion && (
            <motion.div
              key="exam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Progress */}
              <div className="flex items-center justify-between text-sm">
                <span className={textMuted}>Question {currentIndex + 1}/{questions.length}</span>
                <button 
                  onClick={() => setShowQuestionNav(!showQuestionNav)}
                  className="text-primary font-medium flex items-center gap-1"
                >
                  Jump to Question
                  {showQuestionNav ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Question Navigation */}
              <AnimatePresence>
                {showQuestionNav && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`flex flex-wrap gap-2 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      {questions.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setCurrentIndex(idx); setShowQuestionNav(false); }}
                          className={`w-8 h-8 rounded-lg text-xs font-medium ${
                            idx === currentIndex ? 'bg-primary text-white' :
                            answers[idx] ? 'bg-success/20 text-success' :
                            markedForReview.has(idx) ? 'bg-warning/20 text-warning' :
                            isDark ? 'bg-white/10 text-white/60' : 'bg-white text-gray-600'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Question */}
              <GlassCard className={`py-6 ${bgCard}`} hover={false}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {currentQuestion.subject}
                  </span>
                  <button
                    onClick={toggleMark}
                    className={`p-1.5 rounded-lg ${
                      markedForReview.has(currentIndex) ? 'bg-warning/20 text-warning' : textMuted
                    }`}
                  >
                    <Flag size={18} />
                  </button>
                </div>
                <p className={`text-lg ${textColor} leading-relaxed`}>{currentQuestion.text}</p>
              </GlassCard>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isSelected = answers[currentIndex] === letter;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(letter)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-primary/20 border-2 border-primary'
                          : isDark ? 'bg-white/5 border border-white/10 hover:border-white/20' : 'bg-white border border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                          isSelected ? 'bg-primary text-white' : isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {letter}
                        </span>
                        <span className={textColor}>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button onClick={handlePrev} variant="secondary" disabled={currentIndex === 0} className="flex-1">
                  Previous
                </Button>
                {currentIndex === questions.length - 1 ? (
                  <Button onClick={handleSubmit} variant="primary" className="flex-1">
                    Submit Exam
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex-1" icon={<ArrowRight size={18} />}>
                    Next
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {view === 'result' && analysis && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Main Score Card */}
              <GlassCard className={`text-center py-8 ${bgCard}`} hover={false} neonBorder={isDark}>
                <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  analysis.jambScore >= 280 ? 'bg-success/20' : analysis.jambScore >= 200 ? 'bg-warning/20' : 'bg-error/20'
                }`}>
                  <div>
                    <span className={`text-4xl font-black ${textColor}`}>{analysis.jambScore}</span>
                    <span className={`text-lg ${textMuted}`}>/400</span>
                  </div>
                </div>
                <h2 className={`text-xl font-bold ${textColor} mb-2`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {analysis.status}
                </h2>
                <p className={`${textMuted} mb-4`}>
                  You scored in the top {100 - analysis.percentile}% of students
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${textColor}`}>{analysis.grade}</p>
                    <p className={`text-xs ${textMuted}`}>Grade</p>
                  </div>
                  <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${textColor}`}>{analysis.overallScore}%</p>
                    <p className={`text-xs ${textMuted}`}>Accuracy</p>
                  </div>
                  <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${textColor}`}>{analysis.timeEfficiency}%</p>
                    <p className={`text-xs ${textMuted}`}>Time Used</p>
                  </div>
                </div>
              </GlassCard>

              {/* Predicted Score Range */}
              <GlassCard hover={false} className={bgCard} neonBorder={isDark}>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h3 className={`font-bold ${textColor}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    JAMB Score Prediction
                  </h3>
                </div>
                <div className={`text-center py-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${textMuted} mb-2`}>Your predicted JAMB score range:</p>
                  <p className={`text-3xl font-black ${textColor}`}>
                    {analysis.predictedRange.min} - {analysis.predictedRange.max}
                  </p>
                </div>
              </GlassCard>

              {/* Subject Performance */}
              <GlassCard hover={false} className={bgCard}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className={`font-bold ${textColor}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Subject Performance
                  </h3>
                </div>
                <div className="space-y-4">
                  {analysis.subjects.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={textColor}>{subject.subject}</span>
                        <span className={subject.percentage >= 60 ? 'text-success' : subject.percentage >= 40 ? 'text-warning' : 'text-error'}>
                          {subject.correct}/{subject.total} ({subject.percentage}%) - Grade {subject.grade}
                        </span>
                      </div>
                      <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.percentage}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className={`h-full rounded-full ${
                            subject.percentage >= 70 ? 'bg-success' : subject.percentage >= 50 ? 'bg-warning' : 'bg-error'
                          }`}
                        />
                      </div>
                      {subject.weakTopics.length > 0 && (
                        <p className={`text-xs ${textMuted} mt-1`}>
                          Weak areas: {subject.weakTopics.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Toggle Detailed Analysis */}
              <button
                onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                className={`w-full p-4 rounded-xl flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <FileText size={20} className="text-primary" />
                <span className={`font-medium ${textColor}`}>
                  {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
                </span>
                {showDetailedAnalysis ? <ChevronUp size={20} className={textMuted} /> : <ChevronDown size={20} className={textMuted} />}
              </button>

              <AnimatePresence>
                {showDetailedAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                      <GlassCard hover={false} className={`${bgCard} border-l-4 border-l-success`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-success" />
                          <h3 className={`font-bold ${textColor}`}>Your Strengths</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, idx) => (
                            <li key={idx} className={`flex items-center gap-2 text-sm ${textMuted}`}>
                              <CheckCircle size={16} className="text-success" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses.length > 0 && (
                      <GlassCard hover={false} className={`${bgCard} border-l-4 border-l-error`}>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-error" />
                          <h3 className={`font-bold ${textColor}`}>Areas for Improvement</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((weakness, idx) => (
                            <li key={idx} className={`flex items-center gap-2 text-sm ${textMuted}`}>
                              <XCircle size={16} className="text-error" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    )}

                    {/* Recommendations */}
                    <GlassCard hover={false} className={`${bgCard} border-l-4 border-l-primary`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h3 className={`font-bold ${textColor}`}>Recommendations</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-sm ${textMuted}`}>
                            <Brain size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>

                    {/* University Chances */}
                    <GlassCard hover={false} className={bgCard}>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-accent" />
                        <h3 className={`font-bold ${textColor}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                          University Admission Chances
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {analysis.universityChances.map((uni, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <span className={`text-sm ${textColor}`}>{uni.tier}</span>
                            <span className={`text-sm font-medium ${
                              uni.chance === 'High' ? 'text-success' : uni.chance === 'Medium' ? 'text-warning' : 'text-error'
                            }`}>
                              {uni.chance}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button onClick={() => setView('setup')} fullWidth>
                Take Another Exam
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
