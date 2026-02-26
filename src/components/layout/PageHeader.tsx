import React from 'react';
import { Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface PageHeaderProps {
  title: string;
  onOpenMenu: () => void;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onOpenMenu,
  rightContent,
}) => {
  const { theme } = useStore();

  return (
    <header
      className={`sticky top-0 z-30 px-4 py-4 backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-black/60 border-b border-white/10'
          : 'bg-white/80 border-b border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenMenu}
          className={`flex items-center gap-3 p-2 -ml-2 rounded-xl transition-all active:scale-95 ${
            theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
          }`}
        >
          <Menu className="w-6 h-6" strokeWidth={2} />
          <h1
            className="font-display font-bold text-xl"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {title}
          </h1>
        </button>

        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </div>
    </header>
  );
};
