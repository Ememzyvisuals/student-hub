import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  FileText, 
  Ruler, 
  Table, 
  Target,
  GraduationCap,
  Timer,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  CheckSquare,
  BarChart3,
  Bookmark,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  TrendingUp
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { db, StudyTask, BookmarkedQuestion } from '@/lib/db';

type ActiveTool = null | 'calculator' | 'formulas' | 'converter' | 'periodic' | 'jamb-calc' | 'gpa-calc' | 'pomodoro' | 'study-planner' | 'daily-goals' | 'analytics' | 'bookmarks' | 'weak-topics';

const tools = [
  { id: 'calculator', name: 'Scientific Calculator', icon: Calculator, color: 'from-blue-500 to-cyan-400' },
  { id: 'formulas', name: 'Formula Sheets', icon: FileText, color: 'from-purple-500 to-pink-400' },
  { id: 'converter', name: 'Unit Converter', icon: Ruler, color: 'from-orange-500 to-yellow-400' },
  { id: 'periodic', name: 'Periodic Table', icon: Table, color: 'from-green-500 to-emerald-400' },
  { id: 'jamb-calc', name: 'JAMB Score Calculator', icon: Target, color: 'from-red-500 to-rose-400' },
  { id: 'gpa-calc', name: 'GPA/CGPA Calculator', icon: GraduationCap, color: 'from-indigo-500 to-violet-400' },
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: Timer, color: 'from-teal-500 to-cyan-400' },
  { id: 'study-planner', name: 'Study Planner', icon: Calendar, color: 'from-pink-500 to-rose-400' },
  { id: 'daily-goals', name: 'Daily Goals', icon: CheckSquare, color: 'from-amber-500 to-orange-400' },
  { id: 'analytics', name: 'Performance Analytics', icon: BarChart3, color: 'from-sky-500 to-blue-400' },
  { id: 'bookmarks', name: 'Bookmarked Questions', icon: Bookmark, color: 'from-violet-500 to-purple-400' },
  { id: 'weak-topics', name: 'Weak Topic Detector', icon: AlertTriangle, color: 'from-red-500 to-orange-400' },
];

// Complete Periodic Table Data
const periodicElements = [
  { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal', group: 1, period: 1, electron: '1s¹' },
  { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble gas', group: 18, period: 1, electron: '1s²' },
  { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali metal', group: 1, period: 2, electron: '[He] 2s¹' },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline earth', group: 2, period: 2, electron: '[He] 2s²' },
  { symbol: 'B', name: 'Boron', number: 5, mass: 10.81, category: 'metalloid', group: 13, period: 2, electron: '[He] 2s² 2p¹' },
  { symbol: 'C', name: 'Carbon', number: 6, mass: 12.01, category: 'nonmetal', group: 14, period: 2, electron: '[He] 2s² 2p²' },
  { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.01, category: 'nonmetal', group: 15, period: 2, electron: '[He] 2s² 2p³' },
  { symbol: 'O', name: 'Oxygen', number: 8, mass: 16.00, category: 'nonmetal', group: 16, period: 2, electron: '[He] 2s² 2p⁴' },
  { symbol: 'F', name: 'Fluorine', number: 9, mass: 19.00, category: 'halogen', group: 17, period: 2, electron: '[He] 2s² 2p⁵' },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.18, category: 'noble gas', group: 18, period: 2, electron: '[He] 2s² 2p⁶' },
  { symbol: 'Na', name: 'Sodium', number: 11, mass: 22.99, category: 'alkali metal', group: 1, period: 3, electron: '[Ne] 3s¹' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, mass: 24.31, category: 'alkaline earth', group: 2, period: 3, electron: '[Ne] 3s²' },
  { symbol: 'Al', name: 'Aluminium', number: 13, mass: 26.98, category: 'post-transition', group: 13, period: 3, electron: '[Ne] 3s² 3p¹' },
  { symbol: 'Si', name: 'Silicon', number: 14, mass: 28.09, category: 'metalloid', group: 14, period: 3, electron: '[Ne] 3s² 3p²' },
  { symbol: 'P', name: 'Phosphorus', number: 15, mass: 30.97, category: 'nonmetal', group: 15, period: 3, electron: '[Ne] 3s² 3p³' },
  { symbol: 'S', name: 'Sulfur', number: 16, mass: 32.07, category: 'nonmetal', group: 16, period: 3, electron: '[Ne] 3s² 3p⁴' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, mass: 35.45, category: 'halogen', group: 17, period: 3, electron: '[Ne] 3s² 3p⁵' },
  { symbol: 'Ar', name: 'Argon', number: 18, mass: 39.95, category: 'noble gas', group: 18, period: 3, electron: '[Ne] 3s² 3p⁶' },
  { symbol: 'K', name: 'Potassium', number: 19, mass: 39.10, category: 'alkali metal', group: 1, period: 4, electron: '[Ar] 4s¹' },
  { symbol: 'Ca', name: 'Calcium', number: 20, mass: 40.08, category: 'alkaline earth', group: 2, period: 4, electron: '[Ar] 4s²' },
  { symbol: 'Fe', name: 'Iron', number: 26, mass: 55.85, category: 'transition metal', group: 8, period: 4, electron: '[Ar] 3d⁶ 4s²' },
  { symbol: 'Cu', name: 'Copper', number: 29, mass: 63.55, category: 'transition metal', group: 11, period: 4, electron: '[Ar] 3d¹⁰ 4s¹' },
  { symbol: 'Zn', name: 'Zinc', number: 30, mass: 65.38, category: 'transition metal', group: 12, period: 4, electron: '[Ar] 3d¹⁰ 4s²' },
  { symbol: 'Au', name: 'Gold', number: 79, mass: 196.97, category: 'transition metal', group: 11, period: 6, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  { symbol: 'Ag', name: 'Silver', number: 47, mass: 107.87, category: 'transition metal', group: 11, period: 5, electron: '[Kr] 4d¹⁰ 5s¹' },
];

const formulas = {
  Mathematics: [
    { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', description: 'Solve ax² + bx + c = 0' },
    { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', description: 'Right triangle relationship' },
    { name: 'Area of Circle', formula: 'A = πr²', description: 'Circle area calculation' },
    { name: 'Circumference', formula: 'C = 2πr', description: 'Circle perimeter' },
    { name: 'Compound Interest', formula: 'A = P(1 + r/n)^(nt)', description: 'Investment growth' },
    { name: 'Simple Interest', formula: 'I = PRT', description: 'Basic interest calculation' },
    { name: 'Distance Formula', formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]', description: 'Distance between two points' },
    { name: 'Slope', formula: 'm = (y₂-y₁)/(x₂-x₁)', description: 'Gradient of a line' },
    { name: 'Sum of AP', formula: 'Sₙ = n/2[2a + (n-1)d]', description: 'Arithmetic progression sum' },
    { name: 'Sum of GP', formula: 'Sₙ = a(rⁿ-1)/(r-1)', description: 'Geometric progression sum' },
  ],
  Physics: [
    { name: "Newton's Second Law", formula: 'F = ma', description: 'Force = mass × acceleration' },
    { name: 'Kinetic Energy', formula: 'KE = ½mv²', description: 'Energy of motion' },
    { name: 'Potential Energy', formula: 'PE = mgh', description: 'Energy due to position' },
    { name: "Ohm's Law", formula: 'V = IR', description: 'Voltage = Current × Resistance' },
    { name: 'Wave Speed', formula: 'v = fλ', description: 'Velocity = frequency × wavelength' },
    { name: 'Power', formula: 'P = W/t = IV', description: 'Rate of energy transfer' },
    { name: 'Momentum', formula: 'p = mv', description: 'Mass in motion' },
    { name: 'Equations of Motion', formula: 'v = u + at, s = ut + ½at²', description: 'Linear motion' },
    { name: 'Gravitational PE', formula: 'PE = -GMm/r', description: 'Universal gravitation energy' },
    { name: 'Pressure', formula: 'P = F/A', description: 'Force per unit area' },
  ],
  Chemistry: [
    { name: 'Moles', formula: 'n = m/M', description: 'Number of moles calculation' },
    { name: 'Ideal Gas Law', formula: 'PV = nRT', description: 'Gas behavior equation' },
    { name: 'Concentration', formula: 'C = n/V', description: 'Molarity calculation' },
    { name: 'pH', formula: 'pH = -log[H⁺]', description: 'Acidity measure' },
    { name: 'Dilution', formula: 'C₁V₁ = C₂V₂', description: 'Solution dilution' },
    { name: 'Rate of Reaction', formula: 'Rate = k[A]ⁿ[B]ᵐ', description: 'Reaction kinetics' },
    { name: 'Percentage Yield', formula: '% = (Actual/Theoretical) × 100', description: 'Reaction efficiency' },
    { name: 'Avogadro', formula: 'N = 6.022 × 10²³', description: 'Particles per mole' },
  ],
  Biology: [
    { name: 'Magnification', formula: 'M = Image size / Actual size', description: 'Microscope calculation' },
    { name: 'Heart Rate', formula: 'HR = 72 beats/min (average)', description: 'Normal resting rate' },
    { name: 'BMI', formula: 'BMI = Weight(kg) / Height(m)²', description: 'Body mass index' },
    { name: 'Photosynthesis', formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', description: 'Plant food production' },
    { name: 'Respiration', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', description: 'Energy release' },
  ]
};

interface ToolsPageProps {
  onOpenMenu: () => void;
}

export function ToolsPage({ onOpenMenu }: ToolsPageProps) {
  const { currentUser, theme } = useStore();
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<typeof periodicElements[0] | null>(null);
  
  // Unit converter state
  const [converterType, setConverterType] = useState('length');
  const [converterValue, setConverterValue] = useState('');
  const [converterFrom, setConverterFrom] = useState('m');
  const [converterTo, setConverterTo] = useState('cm');
  
  // JAMB calculator
  const [jambSubjects, setJambSubjects] = useState([
    { subject: 'English', correct: '', total: '60' },
    { subject: 'Mathematics', correct: '', total: '60' },
    { subject: 'Subject 3', correct: '', total: '60' },
    { subject: 'Subject 4', correct: '', total: '60' }
  ]);
  
  // GPA calculator
  const [gpaCredits, setGpaCredits] = useState([{ course: '', grade: 'A', units: '' }]);
  
  // Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const pomodoroRef = useRef<NodeJS.Timeout | null>(null);
  
  // Study Planner
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState({ title: '', date: new Date().toISOString().split('T')[0] });
  
  // Daily Goals
  const [dailyGoals, setDailyGoals] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newGoal, setNewGoal] = useState('');
  
  // Bookmarks
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  
  // Analytics
  interface AnalyticsData {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    subjectPerformance: Record<string, { correct: number; total: number }>;
    weeklyProgress: { date: string; questions: number }[];
  }
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  
  // Weak Topics
  interface TopicAnalysis {
    topic: string;
    subject: string;
    correct: number;
    total: number;
    percentage: number;
  }
  const [weakTopics, setWeakTopics] = useState<TopicAnalysis[]>([]);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/60' : 'text-gray-600';
  const bgCard = isDark ? '' : 'bg-white';

  // Load data based on active tool
  useEffect(() => {
    if (activeTool === 'study-planner') loadStudyTasks();
    if (activeTool === 'daily-goals') loadDailyGoals();
    if (activeTool === 'bookmarks') loadBookmarks();
    if (activeTool === 'analytics') loadAnalytics();
    if (activeTool === 'weak-topics') loadWeakTopics();
  }, [activeTool, currentUser?.id]);

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            setPomodoroRunning(false);
            setPomodoroSessions(s => s + 1);
            savePomodoroSession();
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (pomodoroRef.current) clearInterval(pomodoroRef.current);
    };
  }, [pomodoroRunning]);

  const loadStudyTasks = async () => {
    if (!currentUser) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    const tasks = await db.studyTasks.where('userId').equals(userId).toArray();
    setStudyTasks(tasks);
  };

  const loadDailyGoals = async () => {
    const stored = localStorage.getItem(`daily-goals-${new Date().toISOString().split('T')[0]}`);
    if (stored) setDailyGoals(JSON.parse(stored));
  };

  const loadBookmarks = async () => {
    if (!currentUser) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    const bookmarks = await db.bookmarkedQuestions.where('userId').equals(userId).toArray();
    setBookmarkedQuestions(bookmarks);
  };

  const loadAnalytics = async () => {
    if (!currentUser) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    const attempts = await db.questionAttempts.where('userId').equals(userId).toArray();
    
    const subjectPerformance: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;
    
    attempts.forEach(a => {
      if (!subjectPerformance[a.subject]) {
        subjectPerformance[a.subject] = { correct: 0, total: 0 };
      }
      subjectPerformance[a.subject].total++;
      if (a.isCorrect) {
        subjectPerformance[a.subject].correct++;
        totalCorrect++;
      }
    });

    // Weekly progress
    const weeklyProgress: { date: string; questions: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = attempts.filter(a => a.timestamp.toISOString().split('T')[0] === dateStr).length;
      weeklyProgress.push({ date: dateStr.slice(5), questions: count });
    }

    setAnalyticsData({
      totalQuestions: attempts.length,
      correctAnswers: totalCorrect,
      accuracy: attempts.length > 0 ? Math.round((totalCorrect / attempts.length) * 100) : 0,
      subjectPerformance,
      weeklyProgress
    });
  };

  const loadWeakTopics = async () => {
    if (!currentUser) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    const attempts = await db.questionAttempts.where('userId').equals(userId).toArray();
    
    const topicPerformance: Record<string, { subject: string; correct: number; total: number }> = {};
    
    attempts.forEach(a => {
      const key = `${a.subject}-${a.topic}`;
      if (!topicPerformance[key]) {
        topicPerformance[key] = { subject: a.subject, correct: 0, total: 0 };
      }
      topicPerformance[key].total++;
      if (a.isCorrect) topicPerformance[key].correct++;
    });

    const topics: TopicAnalysis[] = Object.entries(topicPerformance)
      .map(([key, data]) => ({
        topic: key.split('-')[1],
        subject: data.subject,
        correct: data.correct,
        total: data.total,
        percentage: Math.round((data.correct / data.total) * 100)
      }))
      .filter(t => t.percentage < 60 && t.total >= 3)
      .sort((a, b) => a.percentage - b.percentage);

    setWeakTopics(topics);
  };

  const savePomodoroSession = async () => {
    if (!currentUser) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    await db.pomodoroSessions.add({
      userId: userId,
      duration: 25,
      completedAt: new Date()
    });
  };

  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === 'CE') {
      setCalcDisplay(calcDisplay.slice(0, -1) || '0');
    } else if (val === '=') {
      try {
        const expression = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, Math.PI.toString()).replace(/√(\d+)/g, 'Math.sqrt($1)');
        const result = Function('"use strict"; return (' + expression + ')')();
        setCalcHistory([...calcHistory, `${calcDisplay} = ${result}`]);
        setCalcDisplay(String(result));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === '√') {
      try {
        setCalcDisplay(String(Math.sqrt(parseFloat(calcDisplay))));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'x²') {
      try {
        setCalcDisplay(String(Math.pow(parseFloat(calcDisplay), 2)));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'π') {
      setCalcDisplay(prev => prev === '0' ? String(Math.PI.toFixed(8)) : prev + String(Math.PI.toFixed(8)));
    } else if (val === 'sin' || val === 'cos' || val === 'tan') {
      try {
        const rad = parseFloat(calcDisplay) * (Math.PI / 180);
        const result = val === 'sin' ? Math.sin(rad) : val === 'cos' ? Math.cos(rad) : Math.tan(rad);
        setCalcDisplay(String(result.toFixed(8)));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'log') {
      try {
        setCalcDisplay(String(Math.log10(parseFloat(calcDisplay))));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'ln') {
      try {
        setCalcDisplay(String(Math.log(parseFloat(calcDisplay))));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(prev => prev === '0' && val !== '.' ? val : prev + val);
    }
  };

  const convertUnit = () => {
    const conversions: Record<string, Record<string, number>> = {
      length: { m: 1, cm: 100, mm: 1000, km: 0.001, mi: 0.000621371, ft: 3.28084, in: 39.3701, yd: 1.09361 },
      mass: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, ton: 0.001 },
      volume: { L: 1, mL: 1000, gal: 0.264172, qt: 1.05669, 'cm³': 1000, 'm³': 0.001 },
      temperature: { C: 1 }, // Special handling
      area: { 'm²': 1, 'cm²': 10000, 'km²': 0.000001, ha: 0.0001, acre: 0.000247105 },
      time: { s: 1, min: 1/60, hr: 1/3600, day: 1/86400 }
    };
    
    const value = parseFloat(converterValue) || 0;
    
    if (converterType === 'temperature') {
      if (converterFrom === 'C' && converterTo === 'F') return ((value * 9/5) + 32).toFixed(2);
      if (converterFrom === 'F' && converterTo === 'C') return ((value - 32) * 5/9).toFixed(2);
      if (converterFrom === 'C' && converterTo === 'K') return (value + 273.15).toFixed(2);
      if (converterFrom === 'K' && converterTo === 'C') return (value - 273.15).toFixed(2);
      if (converterFrom === 'F' && converterTo === 'K') return (((value - 32) * 5/9) + 273.15).toFixed(2);
      if (converterFrom === 'K' && converterTo === 'F') return (((value - 273.15) * 9/5) + 32).toFixed(2);
      return value.toFixed(2);
    }
    
    const fromFactor = conversions[converterType]?.[converterFrom] || 1;
    const toFactor = conversions[converterType]?.[converterTo] || 1;
    return ((value / fromFactor) * toFactor).toFixed(6);
  };

  const calculateJambScore = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    jambSubjects.forEach(sub => {
      const correct = parseInt(sub.correct) || 0;
      const total = parseInt(sub.total) || 60;
      totalCorrect += correct;
      totalQuestions += total;
    });
    
    return Math.round((totalCorrect / totalQuestions) * 400);
  };

  const calculateGPA = () => {
    const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    let totalPoints = 0;
    let totalUnits = 0;
    
    gpaCredits.forEach(c => {
      const units = parseInt(c.units) || 0;
      totalPoints += gradePoints[c.grade] * units;
      totalUnits += units;
    });
    
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';
  };

  const formatPomodoroTime = () => {
    const mins = Math.floor(pomodoroTime / 60);
    const secs = pomodoroTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addStudyTask = async () => {
    if (!currentUser || !newTask.title) return;
    const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) || 0 : currentUser.id;
    await db.studyTasks.add({
      userId: userId,
      title: newTask.title,
      date: newTask.date,
      completed: false,
      createdAt: new Date()
    });
    setNewTask({ title: '', date: new Date().toISOString().split('T')[0] });
    loadStudyTasks();
  };

  const toggleTaskComplete = async (taskId: number, completed: boolean) => {
    await db.studyTasks.update(taskId, { completed: !completed });
    loadStudyTasks();
  };

  const deleteTask = async (taskId: number) => {
    await db.studyTasks.delete(taskId);
    loadStudyTasks();
  };

  const addDailyGoal = () => {
    if (!newGoal.trim()) return;
    const newGoals = [...dailyGoals, { id: Date.now(), text: newGoal, completed: false }];
    setDailyGoals(newGoals);
    localStorage.setItem(`daily-goals-${new Date().toISOString().split('T')[0]}`, JSON.stringify(newGoals));
    setNewGoal('');
  };

  const toggleGoalComplete = (goalId: number) => {
    const newGoals = dailyGoals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
    setDailyGoals(newGoals);
    localStorage.setItem(`daily-goals-${new Date().toISOString().split('T')[0]}`, JSON.stringify(newGoals));
  };

  const deleteBookmark = async (bookmarkId: number) => {
    await db.bookmarkedQuestions.delete(bookmarkId);
    loadBookmarks();
  };

  const getConverterUnits = () => {
    switch (converterType) {
      case 'length':
        return [{ value: 'm', label: 'Meters' }, { value: 'cm', label: 'Centimeters' }, { value: 'mm', label: 'Millimeters' }, { value: 'km', label: 'Kilometers' }, { value: 'ft', label: 'Feet' }, { value: 'in', label: 'Inches' }, { value: 'mi', label: 'Miles' }, { value: 'yd', label: 'Yards' }];
      case 'mass':
        return [{ value: 'kg', label: 'Kilograms' }, { value: 'g', label: 'Grams' }, { value: 'mg', label: 'Milligrams' }, { value: 'lb', label: 'Pounds' }, { value: 'oz', label: 'Ounces' }, { value: 'ton', label: 'Metric Tons' }];
      case 'volume':
        return [{ value: 'L', label: 'Liters' }, { value: 'mL', label: 'Milliliters' }, { value: 'gal', label: 'Gallons' }, { value: 'cm³', label: 'Cubic cm' }, { value: 'm³', label: 'Cubic m' }];
      case 'temperature':
        return [{ value: 'C', label: 'Celsius' }, { value: 'F', label: 'Fahrenheit' }, { value: 'K', label: 'Kelvin' }];
      case 'area':
        return [{ value: 'm²', label: 'Square m' }, { value: 'cm²', label: 'Square cm' }, { value: 'km²', label: 'Square km' }, { value: 'ha', label: 'Hectares' }, { value: 'acre', label: 'Acres' }];
      case 'time':
        return [{ value: 's', label: 'Seconds' }, { value: 'min', label: 'Minutes' }, { value: 'hr', label: 'Hours' }, { value: 'day', label: 'Days' }];
      default:
        return [];
    }
  };

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 px-4 py-4 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={onOpenMenu}
            className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 w-5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
              <span className={`block h-0.5 w-4 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
              <span className={`block h-0.5 w-5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
            </div>
          </button>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
            {activeTool ? tools.find(t => t.id === activeTool)?.name || 'Tool' : 'Study Tools'}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div
              key="tools-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {tools.map((tool, idx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard onClick={() => setActiveTool(tool.id as ActiveTool)} className={bgCard}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-sm font-medium ${textColor}`}>{tool.name}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-2 text-primary mb-4"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
                Back to Tools
              </button>

              {/* Scientific Calculator */}
              {activeTool === 'calculator' && (
                <GlassCard hover={false} className={bgCard}>
                  <div className={`rounded-xl p-4 mb-4 text-right ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <p className={`text-3xl font-mono ${textColor} overflow-x-auto`}>{calcDisplay}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {['sin', 'cos', 'tan', 'log', 'ln', '7', '8', '9', '÷', 'C', '4', '5', '6', '×', 'CE', '1', '2', '3', '-', '√', '0', '.', 'π', '+', 'x²', '(', ')', '='].map(btn => (
                      <button
                        key={btn}
                        onClick={() => handleCalcButton(btn)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          btn === '=' ? 'bg-primary text-white col-span-2' :
                          btn === 'C' || btn === 'CE' ? 'bg-error/80 text-white' :
                          ['÷', '×', '-', '+', '√', 'x²', '(', ')', 'sin', 'cos', 'tan', 'log', 'ln', 'π'].includes(btn) ? 'bg-accent/50 text-white' :
                          isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                  {calcHistory.length > 0 && (
                    <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <p className={`text-xs ${textMuted} mb-2`}>History</p>
                      {calcHistory.slice(-3).map((h, i) => (
                        <p key={i} className={`text-xs ${textMuted} font-mono`}>{h}</p>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Formula Sheets */}
              {activeTool === 'formulas' && (
                <div className="space-y-4">
                  {Object.entries(formulas).map(([subject, formList]) => (
                    <GlassCard key={subject} hover={false} className={bgCard}>
                      <h3 className={`text-lg font-bold text-primary mb-3`}>{subject}</h3>
                      <div className="space-y-3">
                        {formList.map((f, idx) => (
                          <div key={idx} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`${textColor} text-sm font-medium`}>{f.name}</span>
                              <span className="font-mono text-primary text-sm">{f.formula}</span>
                            </div>
                            <p className={`text-xs ${textMuted}`}>{f.description}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}

              {/* Unit Converter */}
              {activeTool === 'converter' && (
                <GlassCard hover={false} className={bgCard}>
                  <div className="space-y-4">
                    <Select
                      label="Conversion Type"
                      value={converterType}
                      onChange={e => { setConverterType(e.target.value); setConverterFrom(''); setConverterTo(''); }}
                      options={[
                        { value: 'length', label: 'Length' },
                        { value: 'mass', label: 'Mass/Weight' },
                        { value: 'volume', label: 'Volume' },
                        { value: 'temperature', label: 'Temperature' },
                        { value: 'area', label: 'Area' },
                        { value: 'time', label: 'Time' }
                      ]}
                    />
                    <Input
                      label="Value"
                      type="number"
                      value={converterValue}
                      onChange={e => setConverterValue(e.target.value)}
                      placeholder="Enter value"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        label="From"
                        value={converterFrom}
                        onChange={e => setConverterFrom(e.target.value)}
                        options={[{ value: '', label: 'Select' }, ...getConverterUnits()]}
                      />
                      <Select
                        label="To"
                        value={converterTo}
                        onChange={e => setConverterTo(e.target.value)}
                        options={[{ value: '', label: 'Select' }, ...getConverterUnits()]}
                      />
                    </div>
                    <div className={`text-center py-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${textMuted}`}>Result</p>
                      <p className={`text-3xl font-bold text-primary`}>{convertUnit()} {converterTo}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Periodic Table */}
              {activeTool === 'periodic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {periodicElements.map(el => (
                      <button
                        key={el.symbol}
                        onClick={() => setSelectedElement(el)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          selectedElement?.symbol === el.symbol 
                            ? 'bg-primary text-white ring-2 ring-primary/50' 
                            : el.category === 'noble gas' ? 'bg-purple-500/20'
                            : el.category === 'halogen' ? 'bg-yellow-500/20'
                            : el.category === 'alkali metal' ? 'bg-red-500/20'
                            : el.category === 'alkaline earth' ? 'bg-orange-500/20'
                            : el.category === 'transition metal' ? 'bg-blue-500/20'
                            : el.category === 'metalloid' ? 'bg-green-500/20'
                            : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <p className={`text-xs ${textMuted}`}>{el.number}</p>
                        <p className={`text-lg font-bold ${textColor}`}>{el.symbol}</p>
                      </button>
                    ))}
                  </div>
                  {selectedElement && (
                    <GlassCard hover={false} neonBorder={isDark} className={bgCard}>
                      <h3 className={`text-xl font-bold ${textColor} mb-4`}>{selectedElement.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className={textMuted}>Symbol</p><p className={`${textColor} font-medium`}>{selectedElement.symbol}</p></div>
                        <div><p className={textMuted}>Atomic Number</p><p className={`${textColor} font-medium`}>{selectedElement.number}</p></div>
                        <div><p className={textMuted}>Atomic Mass</p><p className={`${textColor} font-medium`}>{selectedElement.mass}</p></div>
                        <div><p className={textMuted}>Category</p><p className={`${textColor} font-medium capitalize`}>{selectedElement.category}</p></div>
                        <div><p className={textMuted}>Group</p><p className={`${textColor} font-medium`}>{selectedElement.group}</p></div>
                        <div><p className={textMuted}>Period</p><p className={`${textColor} font-medium`}>{selectedElement.period}</p></div>
                        <div className="col-span-2"><p className={textMuted}>Electron Config</p><p className={`${textColor} font-medium font-mono`}>{selectedElement.electron}</p></div>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}

              {/* JAMB Score Calculator */}
              {activeTool === 'jamb-calc' && (
                <GlassCard hover={false} className={bgCard}>
                  <h3 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    JAMB Score Calculator
                  </h3>
                  <div className="space-y-4">
                    {jambSubjects.map((sub, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 items-end">
                        <Input
                          label={idx === 0 ? 'Subject' : undefined}
                          value={sub.subject}
                          onChange={e => {
                            const newSubs = [...jambSubjects];
                            newSubs[idx].subject = e.target.value;
                            setJambSubjects(newSubs);
                          }}
                          placeholder="Subject"
                        />
                        <Input
                          label={idx === 0 ? 'Correct' : undefined}
                          type="number"
                          max={60}
                          value={sub.correct}
                          onChange={e => {
                            const newSubs = [...jambSubjects];
                            newSubs[idx].correct = e.target.value;
                            setJambSubjects(newSubs);
                          }}
                          placeholder="/60"
                        />
                        <Input
                          label={idx === 0 ? 'Total' : undefined}
                          type="number"
                          value={sub.total}
                          onChange={e => {
                            const newSubs = [...jambSubjects];
                            newSubs[idx].total = e.target.value;
                            setJambSubjects(newSubs);
                          }}
                          placeholder="60"
                        />
                      </div>
                    ))}
                    <div className={`text-center py-8 rounded-xl bg-gradient-to-br ${isDark ? 'from-primary/20 to-accent/20' : 'from-primary/10 to-accent/10'}`}>
                      <p className={`text-sm ${textMuted} mb-2`}>Estimated JAMB Score</p>
                      <p className={`text-6xl font-black ${textColor}`}>{calculateJambScore()}</p>
                      <p className={`${textMuted} mt-2`}>out of 400</p>
                      <p className={`text-sm mt-4 ${calculateJambScore() >= 280 ? 'text-success' : calculateJambScore() >= 200 ? 'text-warning' : 'text-error'}`}>
                        {calculateJambScore() >= 300 ? 'Excellent! Top universities await!' :
                         calculateJambScore() >= 250 ? 'Very Good! Strong chance of admission' :
                         calculateJambScore() >= 200 ? 'Good. Consider improving weaker subjects' :
                         'Keep practicing to improve your score'}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* GPA Calculator */}
              {activeTool === 'gpa-calc' && (
                <GlassCard hover={false} className={bgCard}>
                  <h3 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    GPA/CGPA Calculator
                  </h3>
                  <div className="space-y-4">
                    {gpaCredits.map((credit, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-2 items-end">
                        <Input
                          label={idx === 0 ? 'Course' : undefined}
                          value={credit.course}
                          onChange={e => {
                            const newCredits = [...gpaCredits];
                            newCredits[idx].course = e.target.value;
                            setGpaCredits(newCredits);
                          }}
                          placeholder="Course"
                          className="col-span-1"
                        />
                        <Select
                          label={idx === 0 ? 'Grade' : undefined}
                          value={credit.grade}
                          onChange={e => {
                            const newCredits = [...gpaCredits];
                            newCredits[idx].grade = e.target.value;
                            setGpaCredits(newCredits);
                          }}
                          options={[
                            { value: 'A', label: 'A (5.0)' },
                            { value: 'B', label: 'B (4.0)' },
                            { value: 'C', label: 'C (3.0)' },
                            { value: 'D', label: 'D (2.0)' },
                            { value: 'E', label: 'E (1.0)' },
                            { value: 'F', label: 'F (0.0)' }
                          ]}
                        />
                        <Input
                          label={idx === 0 ? 'Units' : undefined}
                          type="number"
                          value={credit.units}
                          onChange={e => {
                            const newCredits = [...gpaCredits];
                            newCredits[idx].units = e.target.value;
                            setGpaCredits(newCredits);
                          }}
                          placeholder="Units"
                        />
                        {idx > 0 && (
                          <button
                            onClick={() => setGpaCredits(gpaCredits.filter((_, i) => i !== idx))}
                            className="p-3 text-error"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      onClick={() => setGpaCredits([...gpaCredits, { course: '', grade: 'A', units: '' }])}
                      fullWidth
                      icon={<Plus size={18} />}
                    >
                      Add Course
                    </Button>
                    <div className={`text-center py-8 rounded-xl bg-gradient-to-br ${isDark ? 'from-primary/20 to-accent/20' : 'from-primary/10 to-accent/10'}`}>
                      <p className={`text-sm ${textMuted} mb-2`}>Your GPA</p>
                      <p className={`text-6xl font-black ${textColor}`}>{calculateGPA()}</p>
                      <p className={`${textMuted} mt-2`}>out of 5.00</p>
                      <p className={`text-sm mt-4 ${parseFloat(calculateGPA()) >= 4.5 ? 'text-success' : parseFloat(calculateGPA()) >= 3.5 ? 'text-warning' : 'text-error'}`}>
                        {parseFloat(calculateGPA()) >= 4.5 ? 'First Class!' :
                         parseFloat(calculateGPA()) >= 3.5 ? 'Second Class Upper' :
                         parseFloat(calculateGPA()) >= 2.5 ? 'Second Class Lower' :
                         parseFloat(calculateGPA()) >= 1.5 ? 'Third Class' : 'Keep working hard!'}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Pomodoro Timer */}
              {activeTool === 'pomodoro' && (
                <GlassCard hover={false} className={`text-center ${bgCard}`}>
                  <div className="py-8">
                    <div className={`w-48 h-48 mx-auto rounded-full border-8 ${pomodoroRunning ? 'border-primary' : isDark ? 'border-white/20' : 'border-gray-200'} flex items-center justify-center mb-8 transition-colors`}>
                      <p className={`text-5xl font-mono font-bold ${textColor}`}>
                        {formatPomodoroTime()}
                      </p>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                      <Button
                        onClick={() => setPomodoroRunning(!pomodoroRunning)}
                        icon={pomodoroRunning ? <Pause size={20} /> : <Play size={20} />}
                      >
                        {pomodoroRunning ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => { setPomodoroTime(25 * 60); setPomodoroRunning(false); }}
                        icon={<RotateCcw size={20} />}
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="flex justify-center gap-2 mb-6">
                      {[5, 15, 25, 45, 60].map(mins => (
                        <button
                          key={mins}
                          onClick={() => { setPomodoroTime(mins * 60); setPomodoroRunning(false); }}
                          className={`px-4 py-2 rounded-xl text-sm ${
                            Math.floor(pomodoroTime / 60) === mins ? 'bg-primary text-white' : isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <p className={textMuted}>Sessions completed today</p>
                      <p className={`text-3xl font-bold ${textColor}`}>{pomodoroSessions}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Study Planner */}
              {activeTool === 'study-planner' && (
                <div className="space-y-4">
                  <GlassCard hover={false} className={bgCard}>
                    <h3 className={`text-lg font-bold ${textColor} mb-4`}>Add Study Task</h3>
                    <div className="space-y-3">
                      <Input
                        label="Task"
                        value={newTask.title}
                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="What do you need to study?"
                      />
                      <Input
                        label="Date"
                        type="date"
                        value={newTask.date}
                        onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                      />
                      <Button onClick={addStudyTask} fullWidth icon={<Plus size={18} />}>
                        Add Task
                      </Button>
                    </div>
                  </GlassCard>
                  
                  <GlassCard hover={false} className={bgCard}>
                    <h3 className={`text-lg font-bold ${textColor} mb-4`}>Your Tasks</h3>
                    {studyTasks.length === 0 ? (
                      <p className={textMuted}>No tasks yet. Add one above!</p>
                    ) : (
                      <div className="space-y-2">
                        {studyTasks.sort((a, b) => a.date.localeCompare(b.date)).map(task => (
                          <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <button onClick={() => task.id && toggleTaskComplete(task.id, task.completed)}>
                              {task.completed ? (
                                <CheckSquare size={20} className="text-success" />
                              ) : (
                                <div className={`w-5 h-5 rounded border-2 ${isDark ? 'border-white/30' : 'border-gray-300'}`} />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className={`${textColor} ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                              <p className={`text-xs ${textMuted}`}>{task.date}</p>
                            </div>
                            <button onClick={() => task.id && deleteTask(task.id)} className="text-error">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              )}

              {/* Daily Goals */}
              {activeTool === 'daily-goals' && (
                <GlassCard hover={false} className={bgCard}>
                  <h3 className={`text-lg font-bold ${textColor} mb-4`}>Today's Goals</h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newGoal}
                      onChange={e => setNewGoal(e.target.value)}
                      placeholder="Add a goal..."
                      className="flex-1"
                    />
                    <Button onClick={addDailyGoal} icon={<Plus size={18} />}>Add</Button>
                  </div>
                  {dailyGoals.length === 0 ? (
                    <p className={textMuted}>No goals for today. Add one above!</p>
                  ) : (
                    <div className="space-y-2">
                      {dailyGoals.map(goal => (
                        <div key={goal.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <button onClick={() => toggleGoalComplete(goal.id)}>
                            {goal.completed ? (
                              <Check size={20} className="text-success" />
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 ${isDark ? 'border-white/30' : 'border-gray-300'}`} />
                            )}
                          </button>
                          <p className={`flex-1 ${textColor} ${goal.completed ? 'line-through opacity-50' : ''}`}>{goal.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <p className={textMuted}>Progress</p>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div 
                          className="h-full bg-success rounded-full transition-all"
                          style={{ width: `${dailyGoals.length > 0 ? (dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className={textColor}>{dailyGoals.filter(g => g.completed).length}/{dailyGoals.length}</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Performance Analytics */}
              {activeTool === 'analytics' && analyticsData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <GlassCard hover={false} className={`text-center py-4 ${bgCard}`}>
                      <p className={`text-2xl font-bold ${textColor}`}>{analyticsData.totalQuestions}</p>
                      <p className={`text-xs ${textMuted}`}>Total Questions</p>
                    </GlassCard>
                    <GlassCard hover={false} className={`text-center py-4 ${bgCard}`}>
                      <p className={`text-2xl font-bold text-success`}>{analyticsData.accuracy}%</p>
                      <p className={`text-xs ${textMuted}`}>Accuracy</p>
                    </GlassCard>
                  </div>
                  
                  <GlassCard hover={false} className={bgCard}>
                    <h3 className={`font-bold ${textColor} mb-4`}>Subject Performance</h3>
                    {Object.entries(analyticsData.subjectPerformance).map(([subject, data]) => (
                      <div key={subject} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={textColor}>{subject}</span>
                          <span className={data.correct / data.total >= 0.6 ? 'text-success' : 'text-error'}>
                            {Math.round((data.correct / data.total) * 100)}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-full rounded-full ${data.correct / data.total >= 0.6 ? 'bg-success' : 'bg-error'}`}
                            style={{ width: `${(data.correct / data.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </GlassCard>

                  <GlassCard hover={false} className={bgCard}>
                    <h3 className={`font-bold ${textColor} mb-4`}>Weekly Progress</h3>
                    <div className="flex items-end gap-2 h-32">
                      {analyticsData.weeklyProgress.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary rounded-t"
                            style={{ height: `${Math.max(4, (day.questions / Math.max(...analyticsData.weeklyProgress.map(d => d.questions || 1))) * 100)}%` }}
                          />
                          <p className={`text-xs ${textMuted} mt-1`}>{day.date}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* Bookmarked Questions */}
              {activeTool === 'bookmarks' && (
                <GlassCard hover={false} className={bgCard}>
                  <h3 className={`text-lg font-bold ${textColor} mb-4`}>Bookmarked Questions</h3>
                  {bookmarkedQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <Bookmark className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
                      <p className={textMuted}>No bookmarked questions yet.</p>
                      <p className={`text-sm ${textMuted}`}>Bookmark difficult questions while practicing!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookmarkedQuestions.map(q => (
                        <div key={q.id} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{q.subject}</span>
                            <button onClick={() => q.id && deleteBookmark(q.id)} className="text-error">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className={textColor}>{q.questionText}</p>
                          <p className={`text-xs ${textMuted} mt-2`}>{q.topic}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Weak Topic Detector */}
              {activeTool === 'weak-topics' && (
                <GlassCard hover={false} className={bgCard}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <h3 className={`text-lg font-bold ${textColor}`}>Weak Topics</h3>
                  </div>
                  {weakTopics.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className={`w-12 h-12 mx-auto mb-4 text-success`} />
                      <p className={textColor}>Great job! No weak topics detected.</p>
                      <p className={`text-sm ${textMuted}`}>Keep practicing to maintain your performance!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weakTopics.map((topic, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border-l-4 border-l-error ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className={`font-medium ${textColor}`}>{topic.topic}</p>
                              <p className={`text-xs ${textMuted}`}>{topic.subject}</p>
                            </div>
                            <span className="text-error font-medium">{topic.percentage}%</span>
                          </div>
                          <p className={`text-sm ${textMuted}`}>
                            {topic.correct}/{topic.total} correct - Focus on this topic!
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
