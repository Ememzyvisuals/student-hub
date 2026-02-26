import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  BookOpen,
  FileText,
  Layers,
  Bot,
  Wrench,
  Users,
  User,
  BookMarked,
  LogOut,
  Shield,
  Sun,
  Moon,
  Info,
  GraduationCap,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'practice', label: 'Practice', icon: BookOpen },
  { id: 'mock-exam', label: 'Mock Exam', icon: FileText },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'universities', label: 'Universities', icon: GraduationCap },
  { id: 'forum', label: 'Community', icon: Users },
  { id: 'novel', label: 'JAMB Novel', icon: BookMarked },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'about', label: 'About Us', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) => {
  const { currentUser: user, theme, setTheme, logout } = useStore();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-72 z-50 ${
              theme === 'dark'
                ? 'bg-gray-900/95 border-r border-white/10'
                : 'bg-white/95 border-r border-gray-200'
            } backdrop-blur-xl shadow-2xl`}
          >
            {/* Header */}
            <div className={`p-5 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`font-display font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    StudentHub NG
                  </h2>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Learn. Practice. Excel.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.fullName}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.academicLevel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="p-3 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Admin Link */}
              {user?.email === 'ememzyvisuals@gmail.com' && (
                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate('admin')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPage === 'admin'
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Shield className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium text-sm">Admin Panel</span>
                  </motion.button>
                </div>
              )}
            </nav>

            {/* Footer Actions */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
              theme === 'dark' ? 'border-white/10 bg-gray-900/95' : 'border-gray-200 bg-white/95'
            }`}>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Moon className="w-5 h-5" strokeWidth={2} />
                )}
                <span className="font-medium text-sm">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
