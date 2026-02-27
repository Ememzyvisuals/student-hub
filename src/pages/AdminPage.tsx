import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Trash2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  Star,
  Target,
  BookOpen,
  UserCheck,
  Zap,
  RefreshCw,
  Filter,
  Upload,
  Plus,
  FileJson,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ChevronDown,
  FileText
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { db, User, ForumPost, UploadedQuestion } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import {
  isFirebaseConfigured,
  subscribeToUsers,
  subscribeToPosts,
  subscribeToFeedback,
  subscribeToUploadedQuestions,
  uploadQuestion as firebaseUploadQuestion
} from '@/lib/firebase';

const ADMIN_EMAIL = 'ememzyvisuals@gmail.com';
const ADMIN_PASSWORD = 'April232023';
const SECURITY_ANSWER = 'guava';

interface AdminPageProps {
  onBack?: () => void;
  onOpenMenu: () => void;
}

interface UserAnalytics extends User {
  accuracy: number;
}

interface Feedback {
  id?: number;
  userId: number;
  rating: number;
  review: string;
  timestamp: Date;
  userName?: string;
}

const COLORS = ['#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];

const LEVELS = ['JSS', 'SSS', 'JAMB', 'University'] as const;
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

const SUBJECTS_BY_LEVEL = {
  JSS: ['Mathematics', 'English', 'Basic Science', 'Social Studies', 'Civic Education'],
  SSS: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature'],
  JAMB: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature', 'Commerce', 'Accounting', 'Geography'],
  University: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Computer Science', 'Economics', 'Law']
};

export function AdminPage({ onOpenMenu }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'security'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [uploadedQuestions, setUploadedQuestions] = useState<UploadedQuestion[]>([]);
  const [, setAllMockExams] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'feedback' | 'analytics' | 'questions'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Question Upload States
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk' | 'json'>('single');
  const [singleQuestion, setSingleQuestion] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    subject: '',
    topic: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    level: 'JAMB' as 'JSS' | 'SSS' | 'JAMB' | 'University'
  });
  const [jsonInput, setJsonInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [questionFilter, setQuestionFilter] = useState({ level: '', subject: '', search: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalMockExams: 0,
    totalFlashcards: 0,
    totalFeedback: 0,
    averageRating: 0,
    activeToday: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    avgAccuracy: 0,
    totalStudyMinutes: 0,
    totalUploadedQuestions: 0
  });

  const [levelDistribution, setLevelDistribution] = useState<any[]>([]);
  const [dailyActivity, setDailyActivity] = useState<any[]>([]);
  const [performanceByLevel, setPerformanceByLevel] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<UserAnalytics[]>([]);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Load all users with analytics
      const allUsers = await db.users.toArray();
      const usersWithAnalytics: UserAnalytics[] = allUsers.map(user => ({
        ...user,
        accuracy: user.totalQuestionsAnswered > 0 
          ? Math.round((user.totalCorrect / user.totalQuestionsAnswered) * 100) 
          : 0
      }));
      setUsers(usersWithAnalytics);
      
      // Load posts
      const allPosts = await db.forumPosts.orderBy('timestamp').reverse().toArray();
      setPosts(allPosts);
      
      // Load comments
      const allComments = await db.forumComments.toArray();
      
      // Load mock exams
      const allMockExams = await db.mockExamResults.toArray();
      setAllMockExams(allMockExams);
      
      // Load flashcards
      const allFlashcards = await db.flashcards.toArray();
      
      // Load uploaded questions
      const allUploadedQuestions = await db.uploadedQuestions.toArray();
      setUploadedQuestions(allUploadedQuestions);
      
      // Load feedback
      let allFeedback: Feedback[] = [];
      try {
        allFeedback = await (db as any).feedback?.toArray() || [];
        allFeedback = allFeedback.map(f => {
          const user = allUsers.find(u => u.id === f.userId);
          return { ...f, userName: user?.fullName || 'Unknown User' };
        });
      } catch (e) {
        console.log('Feedback table not available');
      }
      setFeedback(allFeedback);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalQuestions = allUsers.reduce((sum, u) => sum + u.totalQuestionsAnswered, 0);
      const totalCorrect = allUsers.reduce((sum, u) => sum + u.totalCorrect, 0);
      const totalLikes = allPosts.reduce((sum, p) => sum + p.likes, 0);
      const avgRating = allFeedback.length > 0 
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length 
        : 0;

      const activeToday = allUsers.filter(u => {
        const lastActive = new Date(u.createdAt);
        return lastActive >= today;
      }).length;

      const newUsersToday = allUsers.filter(u => {
        const created = new Date(u.createdAt);
        return created >= today;
      }).length;

      const newUsersThisWeek = allUsers.filter(u => {
        const created = new Date(u.createdAt);
        return created >= weekAgo;
      }).length;

      setStats({
        totalUsers: allUsers.length,
        totalQuestions,
        totalCorrect,
        totalPosts: allPosts.length,
        totalComments: allComments.length,
        totalLikes,
        totalMockExams: allMockExams.length,
        totalFlashcards: allFlashcards.length,
        totalFeedback: allFeedback.length,
        averageRating: Math.round(avgRating * 10) / 10,
        activeToday,
        newUsersToday,
        newUsersThisWeek,
        avgAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        totalStudyMinutes: Math.round(allMockExams.reduce((sum, e) => sum + (e.duration || 0), 0)),
        totalUploadedQuestions: allUploadedQuestions.filter(q => q.isActive).length
      });

      // Level distribution
      const levels = ['JSS', 'SSS', 'JAMB', 'University'];
      const levelDist = levels.map(level => ({
        name: level,
        value: allUsers.filter(u => u.academicLevel === level).length,
        color: COLORS[levels.indexOf(level)]
      })).filter(l => l.value > 0);
      setLevelDistribution(levelDist);

      // Performance by level
      const perfByLevel = levels.map(level => {
        const levelUsers = allUsers.filter(u => u.academicLevel === level);
        const totalQ = levelUsers.reduce((sum, u) => sum + u.totalQuestionsAnswered, 0);
        const totalC = levelUsers.reduce((sum, u) => sum + u.totalCorrect, 0);
        return {
          level,
          users: levelUsers.length,
          questions: totalQ,
          accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0
        };
      }).filter(l => l.users > 0);
      setPerformanceByLevel(perfByLevel);

      // Daily activity
      const dailyAct = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayExams = allMockExams.filter(e => {
          const examDate = new Date(e.timestamp);
          return examDate.toDateString() === date.toDateString();
        });
        dailyAct.push({
          day: dateStr,
          exams: dayExams.length,
          questions: dayExams.reduce((sum, e) => sum + (e.totalQuestions || 0), 0)
        });
      }
      setDailyActivity(dailyAct);

      // Top users
      const topUsersList = usersWithAnalytics
        .filter(u => u.totalQuestionsAnswered >= 10)
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 5);
      setTopUsers(topUsersList);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Real-time listeners for Firebase data
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const unsubscribers: (() => void)[] = [];
    
    if (isFirebaseConfigured()) {
      // Subscribe to real-time Firebase data
      console.log('🔥 Admin: Using Firebase real-time listeners');
      
      // Users real-time
      unsubscribers.push(subscribeToUsers((firebaseUsers) => {
        const usersWithAnalytics: UserAnalytics[] = firebaseUsers.map(user => ({
          id: parseInt(user.id) || 0,
          email: user.email,
          fullName: user.name,
          password: '',
          academicLevel: (user.level as 'JSS' | 'SSS' | 'JAMB' | 'University') || 'JAMB',
          createdAt: new Date(user.createdAt),
          streak: user.streak || 0,
          lastActiveDate: user.lastActiveDate || new Date().toDateString(),
          totalQuestionsAnswered: user.questionsAnswered || 0,
          totalCorrect: user.correctAnswers || 0,
          accuracy: user.questionsAnswered > 0 
            ? Math.round((user.correctAnswers / user.questionsAnswered) * 100) 
            : 0
        }));
        setUsers(usersWithAnalytics);
        console.log(`✅ Real-time: ${usersWithAnalytics.length} users loaded`);
      }));
      
      // Posts real-time
      unsubscribers.push(subscribeToPosts((firebasePosts) => {
        const convertedPosts = firebasePosts.map(p => ({
          id: parseInt(p.id) || 0,
          userId: parseInt(p.authorId || p.userId || '0') || 0,
          userName: p.authorName || p.userName || 'Anonymous',
          userLevel: p.authorLevel || p.userLevel || 'Student',
          content: p.content,
          likes: p.likes || 0,
          timestamp: new Date(p.createdAt)
        }));
        setPosts(convertedPosts);
        console.log(`✅ Real-time: ${convertedPosts.length} posts loaded`);
      }));
      
      // Feedback real-time
      unsubscribers.push(subscribeToFeedback((firebaseFeedback) => {
        const convertedFeedback = firebaseFeedback.map(f => ({
          id: f.id,
          userId: f.userId,
          rating: f.rating,
          review: f.review,
          timestamp: new Date(f.createdAt),
          userName: f.userName || 'Unknown User'
        }));
        setFeedback(convertedFeedback);
        console.log(`✅ Real-time: ${convertedFeedback.length} feedback loaded`);
      }));
      
      // Uploaded questions real-time
      unsubscribers.push(subscribeToUploadedQuestions((firebaseQuestions) => {
        const convertedQuestions = firebaseQuestions.map(q => ({
          id: parseInt(q.id) || 0,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          level: q.level,
          uploadedBy: q.uploadedBy || 'admin',
          uploadedAt: new Date(q.uploadedAt),
          isActive: q.isActive !== false
        }));
        setUploadedQuestions(convertedQuestions);
        console.log(`✅ Real-time: ${convertedQuestions.length} uploaded questions loaded`);
      }));
      
    } else {
      // Fallback to IndexedDB with polling
      console.log('📦 Admin: Using IndexedDB (offline mode)');
      loadData();
      const interval = setInterval(loadData, 30000);
      unsubscribers.push(() => clearInterval(interval));
    }
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isAuthenticated, loadData]);

  const handleLogin = () => {
    setError('');
    if (credentials.email.toLowerCase() !== ADMIN_EMAIL || credentials.password !== ADMIN_PASSWORD) {
      setError('Invalid credentials');
      return;
    }
    setLoginStep('security');
  };

  const handleSecurityCheck = () => {
    if (securityAnswer.toLowerCase().trim() !== SECURITY_ANSWER) {
      setError('Incorrect answer');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleDeletePost = async (postId: number) => {
    await db.forumPosts.delete(postId);
    await db.forumComments.where('postId').equals(postId).delete();
    loadData();
  };

  const handleDeleteFeedback = async (feedbackId: number) => {
    try {
      await (db as any).feedback?.delete(feedbackId);
      loadData();
    } catch (e) {
      console.error('Error deleting feedback:', e);
    }
  };

  // Question Management Functions
  const validateQuestion = (q: any): { valid: boolean; error?: string } => {
    if (!q.text || q.text.trim().length < 10) return { valid: false, error: 'Question text must be at least 10 characters' };
    if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) return { valid: false, error: 'Must have exactly 4 options' };
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) return { valid: false, error: 'Correct answer must be A, B, C, or D' };
    if (!q.subject || q.subject.trim().length === 0) return { valid: false, error: 'Subject is required' };
    if (!q.topic || q.topic.trim().length === 0) return { valid: false, error: 'Topic is required' };
    if (!LEVELS.includes(q.level)) return { valid: false, error: 'Invalid level' };
    if (!DIFFICULTIES.includes(q.difficulty)) return { valid: false, error: 'Invalid difficulty' };
    return { valid: true };
  };

  const handleAddSingleQuestion = async () => {
    const question: Omit<UploadedQuestion, 'id'> = {
      text: singleQuestion.text.trim(),
      options: [singleQuestion.optionA, singleQuestion.optionB, singleQuestion.optionC, singleQuestion.optionD],
      correctAnswer: singleQuestion.correctAnswer,
      explanation: singleQuestion.explanation.trim(),
      subject: singleQuestion.subject.trim(),
      topic: singleQuestion.topic.trim(),
      difficulty: singleQuestion.difficulty,
      level: singleQuestion.level,
      uploadedBy: 'admin',
      uploadedAt: new Date(),
      isActive: true
    };

    const validation = validateQuestion(question);
    if (!validation.valid) {
      setUploadStatus({ success: 0, failed: 1, errors: [validation.error || 'Invalid question'] });
      return;
    }

    try {
      // Save to Firebase if configured, otherwise IndexedDB
      if (isFirebaseConfigured()) {
        await firebaseUploadQuestion(question);
        console.log('✅ Question uploaded to Firebase');
      } else {
        await db.uploadedQuestions.add(question);
        console.log('📦 Question saved to IndexedDB (offline mode)');
      }
      
      setUploadStatus({ success: 1, failed: 0, errors: [] });
      setSingleQuestion({
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        subject: '',
        topic: '',
        difficulty: 'Medium',
        level: 'JAMB'
      });
      
      // Only need to manually reload for IndexedDB (Firebase has real-time listeners)
      if (!isFirebaseConfigured()) {
        loadData();
      }
    } catch (e) {
      console.error('Error uploading question:', e);
      setUploadStatus({ success: 0, failed: 1, errors: ['Failed to save question'] });
    }
  };

  const handleJsonUpload = async () => {
    setUploadStatus(null);
    let questions: any[];
    
    try {
      questions = JSON.parse(jsonInput);
      if (!Array.isArray(questions)) {
        questions = [questions];
      }
    } catch (e) {
      setUploadStatus({ success: 0, failed: 1, errors: ['Invalid JSON format'] });
      return;
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const question: Omit<UploadedQuestion, 'id'> = {
        text: q.text || '',
        options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
        correctAnswer: q.correctAnswer || 'A',
        explanation: q.explanation || '',
        subject: q.subject || '',
        topic: q.topic || '',
        difficulty: q.difficulty || 'Medium',
        level: q.level || 'JAMB',
        uploadedBy: 'admin',
        uploadedAt: new Date(),
        isActive: true
      };

      const validation = validateQuestion(question);
      if (!validation.valid) {
        failed++;
        errors.push(`Q${i + 1}: ${validation.error}`);
        continue;
      }

      try {
        // Save to Firebase if configured, otherwise IndexedDB
        if (isFirebaseConfigured()) {
          await firebaseUploadQuestion(question);
        } else {
          await db.uploadedQuestions.add(question);
        }
        success++;
      } catch (e) {
        failed++;
        errors.push(`Q${i + 1}: Database error`);
      }
    }

    setUploadStatus({ success, failed, errors: errors.slice(0, 5) });
    if (success > 0) {
      setJsonInput('');
      console.log(`✅ Bulk upload: ${success} questions saved to ${isFirebaseConfigured() ? 'Firebase' : 'IndexedDB'}`);
      
      // Only need to manually reload for IndexedDB
      if (!isFirebaseConfigured()) {
        loadData();
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleQuestionStatus = async (questionId: number, isActive: boolean) => {
    await db.uploadedQuestions.update(questionId, { isActive: !isActive });
    loadData();
  };

  const handleDeleteQuestion = async (questionId: number) => {
    await db.uploadedQuestions.delete(questionId);
    loadData();
  };

  const downloadSampleJson = () => {
    const sample = [
      {
        text: "What is the capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
        correctAnswer: "B",
        explanation: "Abuja became the capital of Nigeria in 1991, replacing Lagos.",
        subject: "Geography",
        topic: "Nigerian Geography",
        difficulty: "Easy",
        level: "JAMB"
      },
      {
        text: "Solve: 2x + 5 = 15",
        options: ["x = 3", "x = 5", "x = 7", "x = 10"],
        correctAnswer: "B",
        explanation: "2x + 5 = 15, 2x = 10, x = 5",
        subject: "Mathematics",
        topic: "Algebra",
        difficulty: "Easy",
        level: "JAMB"
      }
    ];

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredQuestions = uploadedQuestions.filter(q => {
    if (questionFilter.level && q.level !== questionFilter.level) return false;
    if (questionFilter.subject && q.subject !== questionFilter.subject) return false;
    if (questionFilter.search && !q.text.toLowerCase().includes(questionFilter.search.toLowerCase())) return false;
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen ambient-bg flex flex-col">
        <PageHeader title="Admin Access" onOpenMenu={onOpenMenu} />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <GlassCard className="w-full max-w-sm" hover={false}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-error to-orange-500 flex items-center justify-center mb-4">
                <Shield size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Admin Login
              </h2>
            </div>

            {loginStep === 'credentials' ? (
              <div className="space-y-4">
                <Input
                  label="Admin Email"
                  type="email"
                  value={credentials.email}
                  onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="Enter admin email"
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-white/40"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && <p className="text-error text-sm text-center">{error}</p>}
                <Button onClick={handleLogin} fullWidth icon={<Lock size={18} />}>
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="What is your favorite food?"
                  type="text"
                  value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)}
                  placeholder="Security answer"
                />
                {error && <p className="text-error text-sm text-center">{error}</p>}
                <Button onClick={handleSecurityCheck} fullWidth>
                  Verify
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 ambient-bg">
      <PageHeader title="Admin Dashboard" onOpenMenu={onOpenMenu} />

      <div className="px-4 py-4 space-y-4">
        {/* Refresh Button & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Activity size={16} className="text-success animate-pulse" />
            <span>Live Dashboard</span>
          </div>
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-all"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : `Last: ${lastRefresh.toLocaleTimeString()}`}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'questions', label: 'Questions', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'posts', label: 'Forum', icon: MessageSquare },
            { id: 'feedback', label: 'Feedback', icon: Star },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 text-white/60'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users size={20} className="text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-white/60">Total Users</p>
                  <p className="text-xs text-success mt-1">+{stats.newUsersToday} today</p>
                </GlassCard>

                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UserCheck size={20} className="text-success" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
                  <p className="text-xs text-white/60">Active Today</p>
                  <p className="text-xs text-white/40 mt-1">{stats.newUsersThisWeek} this week</p>
                </GlassCard>

                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target size={20} className="text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalQuestions.toLocaleString()}</p>
                  <p className="text-xs text-white/60">Questions Answered</p>
                  <p className="text-xs text-success mt-1">{stats.avgAccuracy}% accuracy</p>
                </GlassCard>

                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Upload size={20} className="text-cyan-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalUploadedQuestions}</p>
                  <p className="text-xs text-white/60">Uploaded Questions</p>
                  <p className="text-xs text-white/40 mt-1">Active in exams</p>
                </GlassCard>

                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen size={20} className="text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalMockExams}</p>
                  <p className="text-xs text-white/60">Mock Exams Taken</p>
                  <p className="text-xs text-white/40 mt-1">{stats.totalStudyMinutes} mins</p>
                </GlassCard>

                <GlassCard className="text-center py-4" hover={false}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star size={20} className="text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.averageRating || '-'}</p>
                  <p className="text-xs text-white/60">Avg Rating</p>
                  <p className="text-xs text-white/40 mt-1">{stats.totalFeedback} reviews</p>
                </GlassCard>
              </div>

              {/* User Distribution Pie Chart */}
              {levelDistribution.length > 0 && (
                <GlassCard hover={false}>
                  <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Users by Academic Level
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={levelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {levelDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              )}

              {/* Top Performers */}
              {topUsers.length > 0 && (
                <GlassCard hover={false}>
                  <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    {topUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-white/20 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{user.fullName}</p>
                          <p className="text-xs text-white/60">{user.totalQuestionsAnswered} questions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">{user.accuracy}%</p>
                          <p className="text-xs text-white/40">{user.academicLevel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Upload Mode Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'single', label: 'Single Question', icon: Plus },
                  { id: 'json', label: 'Bulk Upload (JSON)', icon: FileJson },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setUploadMode(mode.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      uploadMode === mode.id 
                        ? 'bg-accent text-white' 
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    <mode.icon size={16} />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Upload Status */}
              {uploadStatus && (
                <GlassCard hover={false} className={uploadStatus.failed > 0 && uploadStatus.success === 0 ? 'border-error' : 'border-success'}>
                  <div className="flex items-start gap-3">
                    {uploadStatus.success > 0 && uploadStatus.failed === 0 ? (
                      <CheckCircle className="text-success mt-0.5" size={20} />
                    ) : uploadStatus.failed > 0 && uploadStatus.success === 0 ? (
                      <XCircle className="text-error mt-0.5" size={20} />
                    ) : (
                      <AlertCircle className="text-yellow-400 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {uploadStatus.success > 0 && `${uploadStatus.success} question(s) uploaded successfully!`}
                        {uploadStatus.failed > 0 && uploadStatus.success > 0 && ' '}
                        {uploadStatus.failed > 0 && `${uploadStatus.failed} failed.`}
                      </p>
                      {uploadStatus.errors.length > 0 && (
                        <ul className="text-sm text-error mt-2 space-y-1">
                          {uploadStatus.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button onClick={() => setUploadStatus(null)} className="text-white/40">
                      <XCircle size={16} />
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Single Question Form */}
              {uploadMode === 'single' && (
                <GlassCard hover={false}>
                  <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Add Single Question
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-sm mb-1 block">Level</label>
                        <select
                          value={singleQuestion.level}
                          onChange={e => setSingleQuestion({ ...singleQuestion, level: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          {LEVELS.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-1 block">Difficulty</label>
                        <select
                          value={singleQuestion.difficulty}
                          onChange={e => setSingleQuestion({ ...singleQuestion, difficulty: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          {DIFFICULTIES.map(d => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-sm mb-1 block">Subject</label>
                        <select
                          value={singleQuestion.subject}
                          onChange={e => setSingleQuestion({ ...singleQuestion, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="" className="bg-gray-900">Select Subject</option>
                          {SUBJECTS_BY_LEVEL[singleQuestion.level].map(s => (
                            <option key={s} value={s} className="bg-gray-900">{s}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Topic"
                        value={singleQuestion.topic}
                        onChange={e => setSingleQuestion({ ...singleQuestion, topic: e.target.value })}
                        placeholder="e.g., Algebra"
                      />
                    </div>

                    <div>
                      <label className="text-white/60 text-sm mb-1 block">Question Text</label>
                      <textarea
                        value={singleQuestion.text}
                        onChange={e => setSingleQuestion({ ...singleQuestion, text: e.target.value })}
                        placeholder="Enter the question..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Option A"
                        value={singleQuestion.optionA}
                        onChange={e => setSingleQuestion({ ...singleQuestion, optionA: e.target.value })}
                        placeholder="Option A"
                      />
                      <Input
                        label="Option B"
                        value={singleQuestion.optionB}
                        onChange={e => setSingleQuestion({ ...singleQuestion, optionB: e.target.value })}
                        placeholder="Option B"
                      />
                      <Input
                        label="Option C"
                        value={singleQuestion.optionC}
                        onChange={e => setSingleQuestion({ ...singleQuestion, optionC: e.target.value })}
                        placeholder="Option C"
                      />
                      <Input
                        label="Option D"
                        value={singleQuestion.optionD}
                        onChange={e => setSingleQuestion({ ...singleQuestion, optionD: e.target.value })}
                        placeholder="Option D"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-sm mb-1 block">Correct Answer</label>
                        <select
                          value={singleQuestion.correctAnswer}
                          onChange={e => setSingleQuestion({ ...singleQuestion, correctAnswer: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="A" className="bg-gray-900">A</option>
                          <option value="B" className="bg-gray-900">B</option>
                          <option value="C" className="bg-gray-900">C</option>
                          <option value="D" className="bg-gray-900">D</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/60 text-sm mb-1 block">Explanation (Optional)</label>
                      <textarea
                        value={singleQuestion.explanation}
                        onChange={e => setSingleQuestion({ ...singleQuestion, explanation: e.target.value })}
                        placeholder="Explain why this is the correct answer..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <Button onClick={handleAddSingleQuestion} fullWidth icon={<Plus size={18} />}>
                      Add Question
                    </Button>
                  </div>
                </GlassCard>
              )}

              {/* JSON Upload */}
              {uploadMode === 'json' && (
                <GlassCard hover={false}>
                  <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Bulk Upload (JSON)
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant="secondary" 
                      onClick={downloadSampleJson}
                      icon={<Download size={16} />}
                    >
                      Download Sample
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="secondary" 
                      onClick={() => fileInputRef.current?.click()}
                      icon={<Upload size={16} />}
                    >
                      Upload File
                    </Button>
                  </div>

                  <div className="mb-4">
                    <label className="text-white/60 text-sm mb-2 block">JSON Format:</label>
                    <pre className="text-xs text-white/40 bg-black/30 p-3 rounded-lg overflow-x-auto">
{`[
  {
    "text": "Question text here",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "Why A is correct",
    "subject": "Mathematics",
    "topic": "Algebra",
    "difficulty": "Easy|Medium|Hard",
    "level": "JSS|SSS|JAMB|University"
  }
]`}
                    </pre>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Paste JSON Array</label>
                    <textarea
                      value={jsonInput}
                      onChange={e => setJsonInput(e.target.value)}
                      placeholder="Paste your JSON array of questions here..."
                      rows={10}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none font-mono text-sm"
                    />
                  </div>

                  <Button 
                    onClick={handleJsonUpload} 
                    fullWidth 
                    className="mt-4"
                    icon={<Upload size={18} />}
                    disabled={!jsonInput.trim()}
                  >
                    Upload Questions
                  </Button>
                </GlassCard>
              )}

              {/* Uploaded Questions List */}
              <GlassCard hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Uploaded Questions ({uploadedQuestions.length})
                  </h3>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <div className="relative flex-shrink-0">
                    <select
                      value={questionFilter.level}
                      onChange={e => setQuestionFilter({ ...questionFilter, level: e.target.value })}
                      className="px-3 py-2 pr-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none appearance-none"
                    >
                      <option value="" className="bg-gray-900">All Levels</option>
                      {LEVELS.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  </div>
                  <div className="relative flex-1 min-w-[150px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={questionFilter.search}
                      onChange={e => setQuestionFilter({ ...questionFilter, search: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-8 text-white/40">
                      <FileText size={40} className="mx-auto mb-2 opacity-50" />
                      <p>No questions uploaded yet</p>
                    </div>
                  ) : (
                    filteredQuestions.map(q => (
                      <div 
                        key={q.id} 
                        className={`p-3 rounded-lg bg-white/5 border ${q.isActive ? 'border-white/10' : 'border-error/30 opacity-60'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm line-clamp-2">{q.text}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{q.level}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{q.subject}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{q.topic}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                q.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                                q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-error/20 text-error'
                              }`}>{q.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => q.id && handleToggleQuestionStatus(q.id, q.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                q.isActive 
                                  ? 'bg-success/20 text-success hover:bg-success/30' 
                                  : 'bg-white/10 text-white/40 hover:bg-white/20'
                              }`}
                              title={q.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {q.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </button>
                            <button
                              onClick={() => q.id && handleDeleteQuestion(q.id)}
                              className="p-2 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <GlassCard hover={false}>
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Daily Activity (Last 7 Days)
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyActivity}>
                      <defs>
                        <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#007AFF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Area type="monotone" dataKey="exams" stroke="#007AFF" fillOpacity={1} fill="url(#colorExams)" name="Mock Exams" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Performance by Level
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceByLevel}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="level" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="accuracy" fill="#34C759" name="Accuracy %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Level Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/60 border-b border-white/10">
                        <th className="text-left py-2">Level</th>
                        <th className="text-center py-2">Users</th>
                        <th className="text-center py-2">Questions</th>
                        <th className="text-right py-2">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceByLevel.map(level => (
                        <tr key={level.level} className="text-white border-b border-white/5">
                          <td className="py-2 font-medium">{level.level}</td>
                          <td className="text-center py-2">{level.users}</td>
                          <td className="text-center py-2">{level.questions}</td>
                          <td className="text-right py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              level.accuracy >= 70 ? 'bg-success/20 text-success' :
                              level.accuracy >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-error/20 text-error'
                            }`}>
                              {level.accuracy}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Platform Health
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">User Engagement</span>
                      <span className="text-white/60">{stats.totalUsers > 0 ? Math.round((stats.activeToday / stats.totalUsers) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.totalUsers > 0 ? (stats.activeToday / stats.totalUsers) * 100 : 0}%` }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Content Quality</span>
                      <span className="text-white/60">{stats.avgAccuracy}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.avgAccuracy}%` }}
                        className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">User Satisfaction</span>
                      <span className="text-white/60">{Math.round((stats.averageRating / 5) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.averageRating / 5) * 100}%` }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm">{users.length} registered users</p>
                <button className="flex items-center gap-1 text-white/40 text-sm">
                  <Filter size={14} />
                  Filter
                </button>
              </div>
              {users.map(user => (
                <GlassCard key={user.id} hover={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{user.fullName}</p>
                        {user.streak >= 7 && (
                          <Zap size={14} className="text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/60">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          {user.academicLevel}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {user.totalQuestionsAnswered} Qs
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.accuracy >= 70 ? 'bg-success/20 text-success' :
                          user.accuracy >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-error/20 text-error'
                        }`}>
                          {user.accuracy}% accuracy
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Zap size={14} />
                        <span className="text-sm font-medium">{user.streak}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No users registered yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-white/60 text-sm">{posts.length} forum posts</p>
              {posts.map(post => (
                <GlassCard key={post.id} hover={false}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{post.userName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {post.userLevel}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 line-clamp-3">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                    <button
                      onClick={() => post.id && handleDeletePost(post.id)}
                      className="p-2 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </GlassCard>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No forum posts yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/60 text-sm">{feedback.length} reviews received</p>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold">{stats.averageRating}</span>
                  <span className="text-white/40">/ 5</span>
                </div>
              </div>

              <GlassCard hover={false}>
                <h4 className="font-medium text-white mb-3">Rating Distribution</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = feedback.filter(f => f.rating === rating).length;
                    const percentage = feedback.length > 0 ? (count / feedback.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm text-white">{rating}</span>
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-yellow-400 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-white/60 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {feedback.map(review => (
                <GlassCard key={review.id} hover={false}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{review.userName}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                            />
                          ))}
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-sm text-white/70">{review.review}</p>
                      )}
                      <p className="text-xs text-white/40 mt-2">
                        {new Date(review.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => review.id && handleDeleteFeedback(review.id)}
                      className="p-2 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </GlassCard>
              ))}

              {feedback.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Star size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No feedback received yet</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
