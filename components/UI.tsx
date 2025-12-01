import React, { useMemo } from 'react';

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
export const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div 
    style={style}
    className={`
    bg-surface-container-low dark:bg-surface-container-high-dark 
    rounded-2xl shadow-elevation-1 hover:shadow-elevation-2 
    transition-all duration-500 ease-emphasized
    p-4 mb-4 ${className}
  `}>
    {children}
  </div>
);

// M3 Discrete Slider (Native Implementation for robustness)
interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = 6, max = 10, step = 0.25, disabled }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Calculate tick marks
  const ticks = useMemo(() => {
    const count = (max - min) / step;
    if (count > 50) return []; 
    return Array.from({ length: count + 1 }).map((_, i) => (i / count) * 100);
  }, [min, max, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    onChange(newVal);
    // Haptics on change
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
       try { navigator.vibrate(5); } catch(e){}
    }
  };

  return (
    <div className="mb-6 select-none group">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 transition-all duration-300 ease-standard">
        <label className="text-label-large text-on-surface dark:text-on-surface-dark group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors">{label}</label>
        <span className={`text-title-medium text-primary dark:text-primary-dark tabular-nums ${disabled ? 'opacity-50' : ''}`}>
          {value.toFixed(2)}
        </span>
      </div>
      
      {/* Slider Container */}
      <div className="relative h-10 w-full flex items-center touch-none">
        
        {/* Ticks Background Layer */}
        <div className="absolute w-full h-[4px] rounded-full overflow-hidden pointer-events-none z-0">
           {ticks.map((tickPct, idx) => {
             // Skip first and last for clean edges
             if (idx === 0 || idx === ticks.length - 1) return null;
             return (
               <div 
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-on-surface-variant dark:bg-on-surface-variant-dark opacity-40"
                  style={{ left: `${tickPct}%` }}
               />
             );
           })}
        </div>

        {/* Native Input with Dynamic Background Gradient for Track Fill */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="m3-slider z-10"
          style={{
            // Use gradient to simulate the "Active" track color
            background: `linear-gradient(to right, var(--slider-thumb) 0%, var(--slider-thumb) ${percentage}%, var(--slider-track) ${percentage}%, var(--slider-track) 100%)`
          }}
        />
      </div>
      
      {/* Range Labels */}
      <div className="flex justify-between text-xs font-medium text-on-surface-variant dark:text-on-surface-variant-dark opacity-70 -mt-2 px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Section Header
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <h3 className="text-title-medium text-on-surface dark:text-on-surface-dark mb-4 flex items-center gap-3">
    <span className="text-primary dark:text-primary-dark transition-all duration-500 ease-emphasized group-hover:scale-110 group-hover:rotate-6">
      {icon}
    </span>
    {children}
  </h3>
);

// M3 Filter Chip
export const Chip: React.FC<{ 
  label: string; 
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
          ? 'shadow-sm transform scale-100 border-transparent' 
          : 'bg-surface-container-high dark:bg-surface-container-high-dark border-outline-variant dark:border-outline-variant/30 text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-surface-variant dark:hover:bg-white/10'
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

// M3 Buttons (Stadium Shape)
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'filled' | 'tonal' | 'outlined' | 'text' }> = ({ 
  children, 
  variant = 'filled', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "h-10 px-6 rounded-full text-label-large transition-all duration-300 ease-emphasized flex items-center justify-center gap-2 active:scale-95 disabled:opacity-38 disabled:cursor-not-allowed";
  
  const variants = {
    filled: "bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark hover:brightness-105 hover:shadow-elevation-2 active:shadow-none",
    tonal: "bg-secondary-container text-on-secondary-container dark:bg-secondary-container-dark dark:text-on-secondary-container-dark hover:bg-secondary-container/80 dark:hover:bg-secondary-container-dark/80 hover:shadow-elevation-1 active:shadow-none",
    outlined: "border border-outline dark:border-outline-variant text-primary dark:text-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/5 active:bg-primary/10",
    text: "text-primary dark:text-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/5 active:bg-primary/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Google Sign In Button
export const GoogleSignInButton: React.FC<{ onClick: () => void; isLoading?: boolean }> = ({ onClick, isLoading }) => (
  <button 
    onClick={onClick}
    disabled={isLoading}
    className="bg-surface-container-high dark:bg-surface-container-high-dark text-on-surface dark:text-on-surface-dark border border-outline-variant dark:border-outline-variant px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-all duration-300 ease-emphasized hover:shadow-elevation-1 active:scale-95"
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