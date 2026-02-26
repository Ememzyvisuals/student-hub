import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ClipboardList, 
  Layers, 
  Bot, 
  Wrench, 
  MessageCircle,
  Flame,
  Target,
  TrendingUp,
  Award,
  Zap,
  BookMarked,
  Menu,
  X,
  Home,
  User,
  Sun,
  Moon,
  GraduationCap,
  Quote,
  ChevronRight,
  Calendar,
  CheckSquare,
  BarChart3,
  Bookmark,
  AlertTriangle,
  Info,
  Building2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/store/useStore';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenMenu?: () => void;
}

const dailyQuotes = [
  { quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.", author: "Pele" },
  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'practice', label: 'Practice Questions', icon: BookOpen },
  { id: 'mock-exam', label: 'Mock Exam', icon: ClipboardList },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
  { id: 'tools', label: 'Study Tools', icon: Wrench },
  { id: 'universities', label: 'Universities Guide', icon: Building2 },
  { id: 'forum', label: 'Community Forum', icon: MessageCircle },
  { id: 'novel', label: 'JAMB Novel', icon: BookMarked },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'about', label: 'About Us', icon: Info },
];

const toolsShortcut = [
  { id: 'calculator', label: 'Calculator', icon: Wrench },
  { id: 'study-planner', label: 'Study Planner', icon: Calendar },
  { id: 'daily-goals', label: 'Daily Goals', icon: CheckSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'weak-topics', label: 'Weak Topics', icon: AlertTriangle },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { currentUser, theme, toggleTheme } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [todayQuote, setTodayQuote] = useState(dailyQuotes[0]);

  useEffect(() => {
    // Get daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setTodayQuote(dailyQuotes[dayOfYear % dailyQuotes.length]);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const quickActions = [
    { id: 'practice', label: 'Practice', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
    { id: 'mock-exam', label: 'Mock Exam', icon: ClipboardList, color: 'from-purple-500 to-pink-400' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, color: 'from-orange-500 to-yellow-400' },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, color: 'from-green-500 to-emerald-400' },
    { id: 'tools', label: 'Tools', icon: Wrench, color: 'from-red-500 to-rose-400' },
    { id: 'forum', label: 'Forum', icon: MessageCircle, color: 'from-indigo-500 to-violet-400' },
  ];

  const accuracy = currentUser && (currentUser.totalQuestionsAnswered || 0) > 0
    ? Math.round(((currentUser.totalCorrect || 0) / (currentUser.totalQuestionsAnswered || 1)) * 100)
    : 0;

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/60' : 'text-gray-600';
  const bgCard = isDark ? 'bg-white/5' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'ambient-bg' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      {/* Side Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 bottom-0 w-72 z-50 ${isDark ? 'bg-gray-900' : 'bg-white'} border-r ${borderColor} shadow-2xl`}
            >
              {/* Menu Header */}
              <div className={`p-6 border-b ${borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`font-bold ${textColor}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        STUDENTHUB NG
                      </h2>
                      <p className={`text-xs ${textMuted}`}>Study Platform</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  >
                    <X size={20} className={textMuted} />
                  </button>
                </div>
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-warning" />}
                    <span className={`text-sm font-medium ${textColor}`}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <div className={`w-12 h-6 rounded-full ${isDark ? 'bg-primary' : 'bg-gray-300'} relative transition-colors`}>
                    <motion.div
                      animate={{ x: isDark ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate(item.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <item.icon size={20} className="text-primary" />
                    <span className={`font-medium ${textColor}`}>{item.label}</span>
                    <ChevronRight size={16} className={`ml-auto ${textMuted}`} />
                  </motion.button>
                ))}
              </div>

              {/* Menu Footer */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${borderColor}`}>
                <p className={`text-center text-xs ${textMuted}`}>
                  Built by EMEMZYVISUALS
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header with Menu Button */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl border-b ${borderColor}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <Menu size={24} className={textColor} />
          </motion.button>
          
          <h1 
            className={`text-lg font-bold ${textColor}`}
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            STUDENTHUB NG
          </h1>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            {isDark ? <Sun size={22} className="text-warning" /> : <Moon size={22} className="text-primary" />}
          </motion.button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-primary/20 via-accent/10 to-transparent' : 'bg-gradient-to-br from-primary/10 via-accent/5 to-transparent'}`} />
        <div className="relative px-4 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <p className={`${textMuted} text-sm`}>Welcome back,</p>
            <h1 
              className={`text-2xl font-black ${textColor}`}
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {currentUser?.fullName || 'Student'}
            </h1>
            <p className="text-primary text-sm font-medium">
              {currentUser?.academicLevel || 'JAMB'} Candidate
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* Daily Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <GlassCard 
            className={`${isDark ? '' : 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20'}`} 
            hover={false}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Quote size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className={`${textColor} text-sm italic leading-relaxed mb-2`}>
                  "{todayQuote.quote}"
                </p>
                <p className={`${textMuted} text-xs font-medium`}>
                  - {todayQuote.author}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <GlassCard className={`text-center py-4 ${isDark ? '' : bgCard}`} hover={false}>
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
            <p className={`text-2xl font-bold ${textColor}`}>{currentUser?.streak || 0}</p>
            <p className={`text-xs ${textMuted}`}>Day Streak</p>
          </GlassCard>
          
          <GlassCard className={`text-center py-4 ${isDark ? '' : bgCard}`} hover={false}>
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className={`text-2xl font-bold ${textColor}`}>{accuracy}%</p>
            <p className={`text-xs ${textMuted}`}>Accuracy</p>
          </GlassCard>
          
          <GlassCard className={`text-center py-4 ${isDark ? '' : bgCard}`} hover={false}>
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className={`text-2xl font-bold ${textColor}`}>{currentUser?.totalQuestionsAnswered || 0}</p>
            <p className={`text-xs ${textMuted}`}>Questions</p>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 
            className={`text-lg font-bold ${textColor} mb-3`}
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <GlassCard 
                  onClick={() => onNavigate(action.id)}
                  className={`text-center py-5 ${isDark ? '' : bgCard}`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-sm font-medium ${textColor}`}>{action.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 
              className={`text-lg font-bold ${textColor}`}
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Quick Tools
            </h2>
            <button 
              onClick={() => onNavigate('tools')}
              className="text-primary text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {toolsShortcut.map((tool) => (
              <motion.button
                key={tool.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('tools')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'} transition-colors`}
              >
                <tool.icon size={16} className="text-primary" />
                <span className={`text-sm font-medium ${textColor}`}>{tool.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 
            className={`text-lg font-bold ${textColor} mb-3`}
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Featured
          </h2>
          
          <GlassCard 
            onClick={() => onNavigate('novel')}
            className={`mb-3 ${isDark ? '' : bgCard}`}
            neonBorder={isDark}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BookMarked className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${textColor}`}>The Lekki Headmaster</h3>
                <p className={`text-sm ${textMuted}`}>JAMB Literature - Complete Analysis</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </GlassCard>

          <GlassCard 
            onClick={() => onNavigate('mock-exam')}
            className={`mb-3 ${isDark ? '' : bgCard}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${textColor}`}>JAMB Mock Exam</h3>
                <p className={`text-sm ${textMuted}`}>Full CBT simulation - Score /400</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </div>
          </GlassCard>

          <GlassCard 
            onClick={() => onNavigate('universities')}
            className={isDark ? '' : bgCard}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${textColor}`}>Universities Guide</h3>
                <p className={`text-sm ${textMuted}`}>2026/2027 Admission Guide - 230+ Schools</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-4"
        >
          <p className={`${textMuted} text-sm italic`}>
            "The best free study platform in Nigeria"
          </p>
          <p className={`${isDark ? 'text-white/30' : 'text-gray-400'} text-xs mt-2`}>
            Built by EMEMZYVISUALS
          </p>
        </motion.div>
      </div>
    </div>
  );
}
