import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Layers, 
  MessageCircle, 
  User,
  Bot
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStore } from '@/store/useStore';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'practice', label: 'Practice', icon: BookOpen },
  { id: 'mock-exam', label: 'Exam', icon: ClipboardList },
  { id: 'flashcards', label: 'Cards', icon: Layers },
  { id: 'ai-tutor', label: 'AI', icon: Bot },
  { id: 'forum', label: 'Forum', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className={`absolute inset-0 backdrop-blur-xl border-t ${isDark ? 'bg-black/80 border-white/10' : 'bg-white/90 border-gray-200'}`} />
      <div className="relative max-w-lg mx-auto">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-1 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/20'
                )}
              >
                <Icon 
                  size={22} 
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-primary' : isDark ? 'text-white/50' : 'text-gray-400'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={cn(
                  'text-[10px] mt-0.5 transition-colors duration-200',
                  isActive ? 'text-primary font-medium' : isDark ? 'text-white/40' : 'text-gray-400'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
