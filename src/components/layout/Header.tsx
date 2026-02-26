import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  rightElement?: React.ReactNode;
}

export function Header({ title, showBack, onBack, showSettings, onSettings, rightElement }: HeaderProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40">
      <div className={`absolute inset-0 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-white/10' : 'bg-white/90 border-gray-200'}`} />
      <div className="relative flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className={`p-2 -ml-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft size={24} className={isDark ? 'text-white' : 'text-gray-900'} />
            </motion.button>
          )}
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {rightElement}
          {showSettings && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSettings}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <Settings size={22} className={isDark ? 'text-white/70' : 'text-gray-600'} />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
