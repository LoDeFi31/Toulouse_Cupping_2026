import React from 'react';

// Helper to determine text color based on background brightness
const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) return 'black';
  const hex = hexcolor.replace("#", "");
  // Handle shorthand hex like #ccc
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substr(0,2),16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substr(2,2),16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#1f2937' : 'white'; // Gray-800 or White
};

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-4 mb-4 border border-surface-variant ${className}`}>
    {children}
  </div>
);

// Slider
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
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-lg font-bold text-primary">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-primary-container rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-gray-400 px-1 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Section Header
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
    {icon}
    {children}
  </h3>
);

// Chip
export const Chip: React.FC<{ 
  label: string; 
  selected?: boolean; 
  onClick?: () => void;
  onDelete?: () => void;
  color?: string;
  disabled?: boolean;
}> = ({ label, selected, onClick, onDelete, color, disabled }) => {
  const bg = selected ? (color || '#8D6E4D') : '#E5E7EB';
  const textColor = selected ? getContrastYIQ(bg) : '#374151';
  const borderStyle = (selected && textColor === '#1f2937') ? '1px solid rgba(0,0,0,0.1)' : 'none';
  
  return (
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium m-1 transition-colors border border-transparent ${!disabled && onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      style={{ backgroundColor: bg, color: textColor, border: borderStyle }}
      onClick={!disabled ? onClick : undefined}
    >
      {label}
      {onDelete && !disabled && (
        <span className="ml-2 cursor-pointer opacity-70 hover:opacity-100 font-bold">×</span>
      )}
    </div>
  );
};

// Button
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-[#755839]",
    secondary: "bg-secondary text-white hover:bg-[#5E462E]",
    outline: "border border-primary text-primary hover:bg-surface-variant bg-transparent"
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
    className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg shadow-sm font-medium text-sm flex items-center gap-2 transition-all active:scale-95"
  >
    {isLoading ? (
      <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
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