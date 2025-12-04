
import React, { useState } from 'react';
import { AROMA_CATEGORIES, ITEM_COLOR_OVERRIDES, AROMA_TRANSLATIONS } from '../constants';
import { Chip } from './UI';
import { Language } from '../types';

interface AromaSelectorProps {
  selectedNotes: string[];
  onChange: (notes: string[]) => void;
  disabled?: boolean;
  language: Language;
}

const AromaSelector: React.FC<AromaSelectorProps> = ({ selectedNotes, onChange, disabled, language }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Helper to translate
  const t = (term: string) => {
    if (language === 'fr') return term;
    if (AROMA_TRANSLATIONS[term] && AROMA_TRANSLATIONS[term][language as 'en' | 'es']) {
        return AROMA_TRANSLATIONS[term][language as 'en' | 'es'];
    }
    return term;
  };

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
        ${selectedNotes.length > 0 ? 'bg-surface-container-high border-primary/30' : 'bg-surface-container-low border-outline-variant/30'}
      `}>
        {selectedNotes.length === 0 && (
          <span className="text-on-surface-variant text-body-small italic py-1 opacity-70">
             {language === 'fr' ? 'Aucun arôme sélectionné' : (language === 'en' ? 'No aroma selected' : 'Ningún aroma seleccionado')}
          </span>
        )}
        {selectedNotes.map(note => (
          <Chip 
            key={note} 
            label={t(note)} 
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
                  ${isExpanded ? 'border-primary shadow-sm bg-surface-container-high' : 'border-outline-variant/30 bg-surface-container-low'}
                `}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full flex justify-between items-center p-3 text-left hover:bg-surface-variant/20 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }}></div>
                    <span className="font-medium text-on-surface">{t(category.name)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeCount > 0 && (
                      <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full shadow-sm transform transition-transform duration-300 animate-pop">
                        {activeCount}
                      </span>
                    )}
                    <span className={`text-on-surface-variant transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                
                {/* CSS Grid Transition for Smooth Height Animation */}
                <div 
                  className={`grid transition-all duration-300 ease-emphasized ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-3 bg-surface-container border-t border-outline/10 flex flex-wrap gap-2">
                      {category.items.map(item => {
                        const isSelected = selectedNotes.includes(item);
                        const noteColor = getNoteColor(item);
                        
                        return (
                          <Chip
                            key={item}
                            label={
                              <span className="flex items-center gap-2">
                                {!isSelected && noteColor && (
                                  <span 
                                    className="w-2 h-2 rounded-full opacity-80 shadow-sm" 
                                    style={{ backgroundColor: noteColor }} 
                                  />
                                )}
                                {t(item)}
                              </span>
                            }
                            selected={isSelected}
                            color={noteColor}
                            onClick={() => toggleNote(item)}
                          />
                        );
                      })}
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
