import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={cn("glass-card p-6 md:p-12", className)}
    >
      {children}
    </motion.div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: "bg-white text-slate-900 hover:bg-white/90 shadow-[0_10px_30px_-5px_rgba(255,255,255,0.3)]",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.3)]",
    outline: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 md:px-10 py-4 rounded-2xl font-poppins font-bold text-sm tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      {...props}
      className={cn(
        "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-white/30 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/30 shadow-inner",
        props.className
      )}
    />
  );
};

export const GlassSelect: React.FC<{
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}> = ({ options, value, onChange, placeholder = "Select an option", label }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 mb-2 block">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between outline-none transition-all hover:bg-white/10 hover:border-white/20",
          isOpen && "border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        )}
      >
        <span className={cn("font-medium truncate text-left pr-2 flex-1", value ? "text-white" : "text-white/30")}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[100] left-0 right-0 mt-3 p-2 bg-[#0a0a0b]/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)] max-h-64 overflow-y-auto no-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-medium text-sm mb-1 last:mb-0 flex items-center justify-between group",
                  value === option 
                    ? "bg-white text-slate-900 shadow-lg" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{option}</span>
                {value === option && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-slate-900">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Searchable autocomplete input.
 * Dropdown is hidden until the user types at least one character.
 * Matches substring anywhere in the option string and highlights the match.
 */
export const SearchableInput: React.FC<{
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}> = ({ options, value, onChange, placeholder = 'Start typing…', label }) => {
  const [query, setQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync internal query when parent resets value
  React.useEffect(() => { setQuery(value); }, [value]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!options.includes(query)) setQuery(value);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, value, options]);

  const filtered = React.useMemo(
    () =>
      query.trim().length > 0
        ? options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : [],
    [query, options]
  );

  const highlight = (opt: string) => {
    const idx = opt.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{opt}</span>;
    return (
      <>
        <span className="text-white/50">{opt.substring(0, idx)}</span>
        <span className="text-blue-400 font-bold">{opt.substring(idx, idx + query.length)}</span>
        <span className="text-white/50">{opt.substring(idx + query.length)}</span>
      </>
    );
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 mb-2 block">
          {label}
        </label>
      )}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
          if (!options.includes(e.target.value)) onChange('');
        }}
        onFocus={() => { if (query.trim().length > 0) setOpen(true); }}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-white/30 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/30 shadow-inner',
          value && 'border-white/20'
        )}
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[200] left-0 right-0 mt-2 p-1.5 bg-[#0a0a0b]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)]"
          >
            {filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  setQuery(opt);
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm mb-0.5 last:mb-0 font-medium',
                  value === opt
                    ? 'bg-white text-slate-900 font-bold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                {value === opt ? opt : highlight(opt)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
