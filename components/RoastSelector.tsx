import React from 'react';
import { ROAST_LEVELS } from '../constants';
import { RoastLevelType } from '../types';

interface RoastSelectorProps {
  value: RoastLevelType;
  onChange: (roast: RoastLevelType) => void;
  disabled?: boolean;
}

const CoffeeBeanIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7.5 2 4 6.5 4 11C4 16.5 8 22 13.5 22C17.5 22 20 18.5 20 13C20 6.5 16 2 12 2ZM13 19.5C10 19.5 7.5 16 6.5 11C7 9.5 9 5.5 12 4.5C14.5 5.5 17 9.5 17.5 13C16.5 17 14.5 19 13 19.5Z" />
    <path d="M12 4.5C9 5.5 7 9.5 6.5 11C7.5 16 10 19.5 13 19.5C14.5 19 16.5 17 17.5 13C17 9.5 14.5 5.5 12 4.5Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
  </svg>
);

const RoastSelector: React.FC<RoastSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-row justify-between items-center gap-1 overflow-x-auto no-scrollbar py-2">
      {ROAST_LEVELS.map((level) => {
        const isSelected = value === level.id;
        return (
          <button
            key={level.id}
            onClick={() => !disabled && onChange(level.id)}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] ${
              isSelected 
                ? 'bg-surface-variant ring-2 ring-primary scale-105' 
                : 'hover:bg-gray-100 opacity-70 hover:opacity-100'
            }`}
          >
            <CoffeeBeanIcon color={level.color} size={32} />
            <span className={`text-[10px] font-medium ${isSelected ? 'text-primary font-bold' : 'text-gray-500'}`}>
              {level.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RoastSelector;