import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useStore } from '@/store/useStore';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  neonBorder?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, onClick, neonBorder, hover = true }: GlassCardProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4',
        isDark 
          ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
          : 'bg-white border border-gray-200 shadow-sm',
        hover && 'transition-all duration-300',
        neonBorder && isDark && 'shadow-[0_0_20px_rgba(0,122,255,0.3)]',
        neonBorder && !isDark && 'ring-2 ring-primary/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
