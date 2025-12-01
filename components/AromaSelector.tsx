import React, { useState } from 'react';
import { AROMA_CATEGORIES, ITEM_COLOR_OVERRIDES } from '../constants';
import { Chip } from './UI';

interface AromaSelectorProps {
  selectedNotes: string[];
  onChange: (notes: string[]) => void;
  disabled?: boolean;
}

const AromaSelector: React.FC<AromaSelectorProps> = ({ selectedNotes, onChange, disabled }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleNote = (note: string) => {
    if (disabled) return;
    if (selectedNotes.includes(note)) {
      onChange(selectedNotes.filter(n => n !== note));
    } else {
      onChange([...selectedNotes, note]);
    }
  };

  const getNoteColor = (note: string) => {
    if (ITEM_COLOR_OVERRIDES[note]) {
      return ITEM_COLOR_OVERRIDES[note];
    }
    const cat = AROMA_CATEGORIES.find(c => c.items.includes(note));
    return cat ? cat.color : undefined;
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags Display */}
      <div className={`
        flex flex-wrap gap-2 min-h-[44px] p-3 rounded-xl border border-dashed transition-all duration-300
        ${selectedNotes.length > 0 ? 'bg-white dark:bg-surface-container-high-dark border-primary/30' : 'bg-gray-50 dark:bg-white/5 border-outline-variant dark:border-outline-variant/30'}
      `}>
        {selectedNotes.length === 0 && (
          <span className="text-on-surface-variant dark:text-on-surface-variant-dark text-body-small italic py-1">Aucun arôme sélectionné</span>
        )}
        {selectedNotes.map(note => (
          <Chip 
            key={note} 
            label={note} 
            selected={true} 
            color={getNoteColor(note)}
            onDelete={() => toggleNote(note)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Categories Accordion */}
      {!disabled && (
        <div className="space-y-2">
          {AROMA_CATEGORIES.map(category => {
            const isExpanded = expandedCategory === category.id;
            const activeCount = category.items.filter(item => selectedNotes.includes(item)).length;

            return (
              <div 
                key={category.id} 
                className={`
                  border rounded-xl overflow-hidden transition-all duration-300 ease-standard
                  ${isExpanded ? 'border-primary shadow-sm bg-white dark:bg-surface-container-high-dark' : 'border-outline-variant/50 dark:border-white/10 bg-white dark:bg-card-dark'}
                `}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }}></div>
                    <span className="font-medium text-on-surface dark:text-on-surface-dark">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeCount > 0 && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm transform transition-transform duration-300 animate-pop">
                        {activeCount}
                      </span>
                    )}
                    <span className={`text-on-surface-variant dark:text-on-surface-variant-dark transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                
                {/* CSS Grid Transition for Smooth Height Animation */}
                <div 
                  className={`grid transition-all duration-300 ease-emphasized ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-3 bg-surface-container dark:bg-surface-container-dark border-t border-outline/10 dark:border-white/5 flex flex-wrap gap-2">
                      {category.items.map(item => (
                        <Chip
                          key={item}
                          label={item}
                          selected={selectedNotes.includes(item)}
                          color={getNoteColor(item)}
                          onClick={() => toggleNote(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AromaSelector;