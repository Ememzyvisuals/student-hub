import { Menu, Sun, Moon } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface PageHeaderProps {
  title: string;
  onOpenMenu: () => void;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, onOpenMenu, rightContent }: PageHeaderProps) {
  const { theme, toggleTheme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`sticky top-0 z-40 px-4 py-3 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={onOpenMenu}
          className={`flex items-center gap-3 p-2 -ml-2 rounded-xl transition-all active:scale-95 ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
            <Menu className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-lg">{title}</span>
        </button>
        
        <div className="flex items-center gap-2">
          {rightContent}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" strokeWidth={2} />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
