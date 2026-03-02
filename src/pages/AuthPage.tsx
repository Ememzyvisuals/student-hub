import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, Eye, EyeOff, BookOpen, Wifi, WifiOff } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { 
  isFirebaseConfigured, 
  firebaseSignUp, 
  firebaseSignIn, 
  getUserData,
  setUserOnline,
  saveUserToDatabase
} from '@/lib/firebase';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const useFirebase = isFirebaseConfigured();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    academicLevel: 'JAMB' as 'JSS' | 'SSS' | 'JAMB' | 'University'
  });

  const setCurrentUser = useStore(state => state.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useFirebase) {
        // Firebase Authentication
        if (isLogin) {
          // Firebase Login
          const authUser = await firebaseSignIn(formData.email, formData.password);
          let userData = await getUserData(authUser.uid);
          
          // If user exists in Auth but not in Database, create database entry
          // This handles users who signed up before database sync was implemented
          if (!userData) {
            console.log('⚠️ User exists in Auth but not in Database. Creating database entry...');
            userData = await saveUserToDatabase(authUser.uid, {
              name: authUser.displayName || authUser.email?.split('@')[0] || 'Student',
              email: authUser.email || formData.email,
              level: 'JAMB', // Default level for existing users
              createdAt: Date.now(),
              questionsAnswered: 0,
              correctAnswers: 0,
              streak: 1,
              lastActiveDate: new Date().toDateString(),
              badges: [],
              mockExamsTaken: 0
            });
            console.log('✅ Database entry created for existing Auth user');
          }
          
          if (userData) {
            await setUserOnline(authUser.uid);
            setCurrentUser({
              id: authUser.uid,
              email: userData.email,
              fullName: userData.name,
              academicLevel: userData.level,
              streak: userData.streak,
              questionsAnswered: userData.questionsAnswered,
              correctAnswers: userData.correctAnswers
            });
          } else {
            setError('Failed to load user data');
          }
        } else {
          // Firebase Signup
          const userData = await firebaseSignUp(
            formData.email,
            formData.password,
            formData.fullName,
            formData.academicLevel
          );
          
          await setUserOnline(userData.id);
          setCurrentUser({
            id: userData.id,
            email: userData.email,
            fullName: userData.name,
            academicLevel: userData.level,
            streak: userData.streak,
            questionsAnswered: userData.questionsAnswered,
            correctAnswers: userData.correctAnswers
          });
        }
      } else {
        // IndexedDB Fallback (offline mode)
        if (isLogin) {
          // Local Login
          const user = await db.users.where('email').equals(formData.email.toLowerCase()).first();
          
          if (!user || user.password !== formData.password) {
            setError('Invalid email or password');
            setLoading(false);
            return;
          }

          setCurrentUser({
            id: String(user.id!),
            email: user.email,
            fullName: user.fullName,
            academicLevel: user.academicLevel,
            streak: user.streak,
            questionsAnswered: user.totalQuestionsAnswered,
            correctAnswers: user.totalCorrect
          });
        } else {
          // Local Signup
          const existingUser = await db.users.where('email').equals(formData.email.toLowerCase()).first();
          
          if (existingUser) {
            setError('Email already registered');
            setLoading(false);
            return;
          }

          const today = new Date().toISOString().split('T')[0];
          
          const id = await db.users.add({
            email: formData.email.toLowerCase(),
            password: formData.password,
            fullName: formData.fullName,
            academicLevel: formData.academicLevel,
            createdAt: new Date(),
            streak: 1,
            lastActiveDate: today,
            totalQuestionsAnswered: 0,
            totalCorrect: 0
          });

          setCurrentUser({
            id: String(id),
            email: formData.email.toLowerCase(),
            fullName: formData.fullName,
            academicLevel: formData.academicLevel,
            streak: 1,
            questionsAnswered: 0,
            correctAnswers: 0
          });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Handle Firebase-specific errors
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-8 ambient-bg">
      {/* Logo & Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-[0_0_40px_rgba(0,122,255,0.4)]">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 
          className="text-3xl font-black text-white mb-1"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          STUDENTHUB NG
        </h1>
        <p className="text-white/60 text-sm">The best free study platform in Nigeria</p>
        
        {/* Connection status */}
        <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs ${
          useFirebase 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {useFirebase ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{useFirebase ? 'Online Mode' : 'Offline Mode'}</span>
        </div>
      </motion.div>

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="max-w-md mx-auto w-full" hover={false}>
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin ? 'bg-primary text-white shadow-lg' : 'text-white/60'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? 'bg-primary text-white shadow-lg' : 'text-white/60'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={<User size={18} />}
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock size={18} />}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Select
                    label="Academic Level"
                    value={formData.academicLevel}
                    onChange={e => setFormData({ ...formData, academicLevel: e.target.value as 'JSS' | 'SSS' | 'JAMB' | 'University' })}
                    options={[
                      { value: 'JSS', label: 'Junior Secondary School (JSS)' },
                      { value: 'SSS', label: 'Senior Secondary School (SSS)' },
                      { value: 'JAMB', label: 'JAMB Candidate' },
                      { value: 'University', label: 'University Student' }
                    ]}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-error text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              icon={<GraduationCap size={20} />}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>
        </GlassCard>
      </motion.div>

      {/* Firebase info */}
      {!useFirebase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 px-4"
        >
          <p className="text-yellow-400/80 text-xs">
            Running in offline mode. Data will be stored locally on this device.
          </p>
        </motion.div>
      )}
    </div>
  );
}
