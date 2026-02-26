import { cn } from '@/utils/cn';
import { useStore } from '@/store/useStore';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            isDark 
              ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30' 
              : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
            'transition-all duration-200',
            icon && 'pl-10',
            error && 'border-error/50',
            className
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-xl resize-none',
          isDark 
            ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30' 
            : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
          'transition-all duration-200',
          error && 'border-error/50',
          className
        )}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-xl appearance-none',
          'bg-white/5 border border-white/10',
          'text-white',
          'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
          'transition-all duration-200',
          error && 'border-error/50',
          className
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}
