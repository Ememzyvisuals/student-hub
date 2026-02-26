import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  Flame, 
  Target,
  Award,
  LogOut,
  TrendingUp,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { useStore } from '@/store/useStore';
import { db, Badge, MockExamResult } from '@/lib/db';

interface ProfilePageProps {
  onOpenMenu: () => void;
}

const badgeDefinitions = [
  { type: 'first_question', name: 'First Steps', description: 'Answer your first question', icon: BookOpen },
  { type: 'streak_7', name: 'Week Warrior', description: '7-day study streak', icon: Flame },
  { type: 'streak_30', name: 'Monthly Master', description: '30-day study streak', icon: Flame },
  { type: 'questions_100', name: 'Century Club', description: 'Answer 100 questions', icon: Target },
  { type: 'questions_500', name: 'Knowledge Seeker', description: 'Answer 500 questions', icon: Target },
  { type: 'questions_1000', name: 'Scholar', description: 'Answer 1000 questions', icon: Award },
  { type: 'accuracy_80', name: 'Sharp Mind', description: '80% accuracy in a session', icon: CheckCircle },
  { type: 'mock_exam', name: 'Exam Ready', description: 'Complete a mock exam', icon: GraduationCap },
  { type: 'high_score', name: 'Top Performer', description: 'Score 300+ in mock exam', icon: TrendingUp },
];

export function ProfilePage({ onOpenMenu }: ProfilePageProps) {
  const { currentUser, setCurrentUser, theme } = useStore();
  const isDark = theme === 'dark';
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentExams, setRecentExams] = useState<MockExamResult[]>([]);

  useEffect(() => {
    loadUserData();
  }, [currentUser?.id]);

  const loadUserData = async () => {
    if (!currentUser) return;
    
    const userBadges = await db.badges.where('userId').equals(currentUser.id).toArray();
    setBadges(userBadges);

    const exams = await db.mockExamResults
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .limit(5)
      .toArray();
    setRecentExams(exams);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const accuracy = currentUser && (currentUser.totalQuestionsAnswered || 0) > 0
    ? Math.round(((currentUser.totalCorrect || 0) / (currentUser.totalQuestionsAnswered || 1)) * 100)
    : 0;

  const earnedBadgeTypes = new Set(badges.map(b => b.badgeType));

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <PageHeader title="Profile" onOpenMenu={onOpenMenu} />

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard hover={false} neonBorder className="text-center py-8">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <User size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h2 
              className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {currentUser?.fullName || 'Student'}
            </h2>
            <p className="text-primary font-semibold">{currentUser?.academicLevel} Candidate</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{currentUser?.email}</p>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <GlassCard className="text-center py-4" hover={false}>
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" strokeWidth={1.5} />
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser?.streak || 0}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Day Streak</p>
          </GlassCard>
          
          <GlassCard className="text-center py-4" hover={false}>
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" strokeWidth={1.5} />
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{accuracy}%</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Accuracy</p>
          </GlassCard>
          
          <GlassCard className="text-center py-4" hover={false}>
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-400" strokeWidth={1.5} />
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser?.totalQuestionsAnswered || 0}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Questions</p>
          </GlassCard>
          
          <GlassCard className="text-center py-4" hover={false}>
            <Award className="w-6 h-6 mx-auto mb-2 text-purple-400" strokeWidth={1.5} />
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{badges.length}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Badges</p>
          </GlassCard>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 
            className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Badges
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {badgeDefinitions.map(badge => {
              const isEarned = earnedBadgeTypes.has(badge.type);
              const Icon = badge.icon;
              
              return (
                <GlassCard 
                  key={badge.type} 
                  className={`text-center py-4 ${!isEarned && 'opacity-40'}`}
                  hover={false}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                    isEarned ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30' : isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <Icon size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{badge.name}</p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{badge.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Exams */}
        {recentExams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Recent Mock Exams
            </h3>
            <div className="space-y-3">
              {recentExams.map(exam => (
                <GlassCard key={exam.id} hover={false}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {exam.subjects.join(', ')}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        {new Date(exam.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        exam.jambScore >= 280 ? 'text-green-500' : exam.jambScore >= 200 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {exam.jambScore}/400
                      </p>
                      <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        {exam.correctAnswers}/{exam.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={handleLogout} variant="danger" fullWidth icon={<LogOut size={20} strokeWidth={1.5} />}>
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
