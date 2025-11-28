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
    // First check if there is a specific override
    if (ITEM_COLOR_OVERRIDES[note]) {
      return ITEM_COLOR_OVERRIDES[note];
    }
    // Fallback to category color
    const cat = AROMA_CATEGORIES.find(c => c.items.includes(note));
    return cat ? cat.color : undefined;
  };

  const getCategoryColor = (catId: string) => {
    return AROMA_CATEGORIES.find(c => c.id === catId)?.color;
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-gray-50 rounded-lg border border-gray-100 mb-2">
        {selectedNotes.length === 0 && <span className="text-gray-400 text-sm italic py-1 px-2">Aucun arôme sélectionné</span>}
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
        <div className="space-y-1">
          {AROMA_CATEGORIES.map(category => {
            const isExpanded = expandedCategory === category.id;
            const activeCount = category.items.filter(item => selectedNotes.includes(item)).length;

            return (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full flex justify-between items-center p-3 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{activeCount}</span>
                    )}
                    <span className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 animate-fadeIn">
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AromaSelector;