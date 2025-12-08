
import React, { useMemo, useState, useRef } from 'react';

// Helper to determine text color based on background brightness
const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) return 'black';
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substr(0,2),16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substr(2,2),16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#1E1B18' : '#FFFFFF';
};

// M3 Elevated Card
export const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: (e: React.MouseEvent) => void; id?: string }> = ({ children, className = '', style, onClick, id }) => (
  <div 
    id={id}
    style={style}
    onClick={onClick}
    className={`
    bg-surface-container-low 
    rounded-2xl shadow-elevation-1 hover:shadow-elevation-2 
    transition-all duration-500 ease-emphasized
    p-4 mb-4 ${className}
  `}>
    {children}
  </div>
);

// M3 Discrete Slider (Android 16 QPR2 Style - Tall Track)
interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  variant?: 'standard' | 'centered';
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = 6, max = 10, step = 0.25, disabled, variant = 'standard' }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate Percentage based on value relative to range
  // Always fill from left (min) to current value
  const rawPct = ((value - min) / (max - min)) * 100;
  const fillPct = Math.max(0, Math.min(100, rawPct));

  // Generate Ticks
  const ticks = useMemo(() => {
    const count = (max - min) / step;
    if (count > 50) return []; 
    return Array.from({ length: count + 1 }).map((_, i) => (i / count) * 100);
  }, [min, max, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    onChange(newVal);
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
       try { navigator.vibrate(5); } catch(e){}
    }
  };

  return (
    <div className="mb-6 select-none group relative pt-2">
      {/* Header Label Row */}
      <div className="flex justify-between items-end mb-2 px-1">
        <label className={`text-label-large transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-on-surface'}`}>
          {label}
        </label>
        <span className={`text-title-medium font-bold tabular-nums transition-colors duration-200 ${isDragging ? 'text-primary scale-110' : 'text-on-surface-variant'}`}>
          {value.toFixed(2)}
        </span>
      </div>
      
      {/* Slider Container (The Thick Pill) */}
      <div 
        className={`
            relative w-full h-[44px] rounded-full overflow-hidden 
            transition-all duration-300 ease-emphasized
            ${isDragging ? 'scale-[1.02] shadow-elevation-1' : 'scale-100'}
            bg-surface-container-highest
        `}
      >
        
        {/* 1. Track Background (Inactive) is the container bg itself */}

        {/* 2. Active Track (Fill) - Always from left to cursor */}
        <div 
          className="absolute top-0 h-full bg-primary transition-[width] duration-75 ease-linear pointer-events-none z-0 opacity-90"
          style={{ 
              left: 0, 
              width: `${fillPct}%`
          }}
        />

        {/* 3. Ticks (Dots) - Subtle overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
           {ticks.map((tickPct, idx) => {
             // Skip first/last to avoid edge artifacts
             if (idx === 0 || idx === ticks.length - 1) return null;
             
             // Active if covered by the fill
             const isActive = tickPct <= fillPct;
             
             return (
               <div 
                  key={idx}
                  className={`absolute top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full transition-colors duration-200 ${isActive ? 'bg-on-primary/30' : 'bg-on-surface-variant/20'}`}
                  style={{ left: `${tickPct}%` }}
               />
             );
           })}
        </div>

        {/* 4. Native Input (Invisible Hitbox - Full Size) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onBlur={() => setIsDragging(false)}
          className="m3-slider z-20 opacity-0 absolute inset-0 w-full h-full cursor-pointer touch-none" 
          style={{ touchAction: 'pan-y' }}
          inputMode="none"
        />

        {/* 5. Separator Line for "Centered" variant (The Zero point visual marker only) */}
        {variant === 'centered' && (
             <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-surface/30 mix-blend-overlay pointer-events-none z-10"></div>
        )}
      </div>
      
      {/* Range Labels */}
      <div className="flex justify-between text-label-small text-on-surface-variant/50 mt-1 px-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Section Header
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <h3 className="text-title-medium text-on-surface mb-4 flex items-center gap-3 group">
    <span className="text-primary transition-all duration-500 ease-emphasized group-hover:scale-110 group-hover:rotate-6">
      {icon}
    </span>
    {children}
  </h3>
);

// M3 Filter Chip
export const Chip: React.FC<{ 
  label: React.ReactNode; 
  selected?: boolean; 
  onClick?: () => void;
  onDelete?: () => void;
  color?: string;
  disabled?: boolean;
}> = ({ label, selected, onClick, onDelete, color, disabled }) => {
  const customBg = selected ? (color || '#865328') : 'transparent';
  const customText = selected ? getContrastYIQ(customBg) : 'inherit';
  
  return (
    <div 
      className={`
        inline-flex items-center px-4 py-1.5 rounded-lg text-label-large m-1 
        border transition-all duration-300 ease-emphasized select-none
        ${selected 
          ? 'shadow-sm transform scale-100 border-transparent active:scale-95' 
          : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:bg-surface-variant'
        }
        ${!disabled && onClick ? 'cursor-pointer active:scale-90 hover:scale-[1.02]' : 'opacity-60 cursor-default'}
      `}
      style={selected ? { backgroundColor: customBg, color: customText } : {}}
      onClick={!disabled ? onClick : undefined}
    >
      {selected && (
        <svg className="w-4 h-4 mr-1.5 -ml-1 animate-fadeIn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {label}
      {onDelete && !disabled && (
        <span 
          className="ml-2 -mr-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          ×
        </span>
      )}
    </div>
  );
};

// M3 Buttons
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'filled' | 'tonal' | 'outlined' | 'text' }> = ({ 
  children, 
  variant = 'filled', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "h-10 px-6 rounded-full text-label-large transition-all duration-300 ease-emphasized flex items-center justify-center gap-2 active:scale-95 disabled:opacity-38 disabled:cursor-not-allowed";
  
  const variants = {
    filled: "bg-primary text-on-primary hover:bg-opacity-90 hover:shadow-elevation-2 active:shadow-none",
    tonal: "bg-secondary-container text-on-secondary-container hover:bg-opacity-90 hover:shadow-elevation-1 active:shadow-none",
    outlined: "border border-outline text-primary hover:bg-primary/10 active:bg-primary/20",
    text: "text-primary hover:bg-primary/10 active:bg-primary/20"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// M3 Split Button
export const SplitButton: React.FC<{
  mainLabel: string;
  onMainClick: () => void;
  actions: { label: string; onClick: () => void; danger?: boolean }[];
  variant?: 'filled' | 'tonal';
  className?: string;
}> = ({ mainLabel, onMainClick, actions, variant = 'filled', className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseStyle = "h-10 px-4 flex items-center justify-center text-label-large transition-all duration-300 ease-emphasized active:scale-95";
  const variants = {
    filled: "bg-primary text-on-primary hover:bg-opacity-90",
    tonal: "bg-secondary-container text-on-secondary-container hover:bg-opacity-90"
  };

  return (
    <div className={`relative inline-flex rounded-full shadow-elevation-1 ${className}`} ref={containerRef}>
      <button 
        onClick={onMainClick}
        className={`${baseStyle} ${variants[variant]} rounded-l-full pr-2 border-r border-white/20`}
      >
        {mainLabel}
      </button>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseStyle} ${variants[variant]} rounded-r-full pl-2`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-surface-container-high rounded-xl shadow-elevation-3 py-1 z-50 overflow-hidden animate-fadeIn origin-bottom-right">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => { action.onClick(); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-label-large hover:bg-surface-variant/50 transition-colors ${action.danger ? 'text-error' : 'text-on-surface'}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Google Sign In Button
export const GoogleSignInButton: React.FC<{ onClick: () => void; isLoading?: boolean }> = ({ onClick, isLoading }) => (
  <button 
    onClick={onClick}
    disabled={isLoading}
    className="bg-surface-container-high text-on-surface border border-outline-variant px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-all duration-300 ease-emphasized hover:shadow-elevation-1 active:scale-95"
  >
    {isLoading ? (
      <span className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></span>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )}
    Sign in with Google
  </button>
);
