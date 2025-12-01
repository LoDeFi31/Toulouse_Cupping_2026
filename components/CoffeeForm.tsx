import React, { useMemo } from 'react';
import { CoffeeEntry } from '../types';
import { Card, SectionTitle, Slider, Chip, Button } from './UI';
import AromaSelector from './AromaSelector';
import { ACIDITY_TYPES, ACIDITY_INTENSITIES, BODY_TYPES } from '../constants';
import { 
  FragranceIcon, FlavorIcon, AftertasteIcon, 
  AcidityIcon, BodyIcon, BalanceIcon, CommentIcon 
} from './Icons';

interface CoffeeFormProps {
  coffee: CoffeeEntry;
  onUpdate: (coffee: CoffeeEntry) => void;
  onDelete?: () => void;
}

const CoffeeForm: React.FC<CoffeeFormProps> = ({ coffee, onUpdate, onDelete }) => {
  const isDisabled = coffee.isLocked;

  const handleUpdate = (updates: Partial<CoffeeEntry>) => {
    if (isDisabled) return;
    onUpdate({ ...coffee, ...updates });
  };

  const finalScore = useMemo(() => {
    const sum = coffee.fragranceScore + coffee.flavorScore + coffee.aftertasteScore + coffee.acidityScore + coffee.bodyScore + coffee.balanceScore;
    return sum / 6;
  }, [coffee]);

  return (
    <div className="pb-24 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-primary text-white p-5 rounded-2xl shadow-lg mb-6 flex flex-col gap-2 transition-transform duration-300 hover:scale-[1.01]">
        <label className="text-xs uppercase tracking-wide opacity-80 font-bold">Nom du café</label>
        <input
          type="text"
          value={coffee.name}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          disabled={isDisabled}
          className="bg-transparent text-2xl font-bold border-b-2 border-white/30 focus:border-white focus:outline-none placeholder-white/50 w-full pb-1 transition-colors duration-300"
          placeholder="Ex: Éthiopie Yirgacheffe"
        />
        <div className="flex justify-between items-end mt-2">
           <div className="text-sm opacity-90">
             Date: {new Date(coffee.timestamp).toLocaleDateString()}
           </div>
           {isDisabled && <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold animate-pop">Validé 🔒</span>}
        </div>
      </div>

      {/* B. Fragrance */}
      <Card>
        <SectionTitle icon={<FragranceIcon className="w-6 h-6" />}>Fragrance / Arôme</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.fragranceScore} 
          onChange={(val) => handleUpdate({ fragranceScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">Notes olfactives</label>
          <AromaSelector 
            selectedNotes={coffee.fragranceNotes}
            onChange={(notes) => handleUpdate({ fragranceNotes: notes })}
            disabled={isDisabled}
          />
        </div>
      </Card>

      {/* C. Flavor */}
      <Card>
        <SectionTitle icon={<FlavorIcon className="w-6 h-6" />}>Saveur</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.flavorScore} 
          onChange={(val) => handleUpdate({ flavorScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">Notes en bouche</label>
          <AromaSelector 
            selectedNotes={coffee.flavorNotes}
            onChange={(notes) => handleUpdate({ flavorNotes: notes })}
            disabled={isDisabled}
          />
        </div>
      </Card>

      {/* D. Aftertaste */}
      <Card>
        <SectionTitle icon={<AftertasteIcon className="w-6 h-6" />}>Arrière-goût</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.aftertasteScore} 
          onChange={(val) => handleUpdate({ aftertasteScore: val })}
          disabled={isDisabled}
        />
      </Card>

      {/* E. Acidity */}
      <Card>
        <SectionTitle icon={<AcidityIcon className="w-6 h-6" />}>Acidité</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.acidityScore} 
          onChange={(val) => handleUpdate({ acidityScore: val })}
          disabled={isDisabled}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 block tracking-wider">Type</label>
            <div className="flex flex-wrap gap-2">
              {ACIDITY_TYPES.map(t => (
                <Chip 
                  key={t} 
                  label={t} 
                  selected={coffee.acidityType === t}
                  onClick={() => handleUpdate({ acidityType: t as any })}
                  disabled={isDisabled}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 block tracking-wider">Intensité</label>
            <div className="flex flex-wrap gap-2">
              {ACIDITY_INTENSITIES.map(i => (
                <Chip 
                  key={i} 
                  label={i} 
                  selected={coffee.acidityIntensity === i}
                  onClick={() => handleUpdate({ acidityIntensity: i as any })}
                  disabled={isDisabled}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* F. Body */}
      <Card>
        <SectionTitle icon={<BodyIcon className="w-6 h-6" />}>Corps</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.bodyScore} 
          onChange={(val) => handleUpdate({ bodyScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-6">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 block tracking-wider">Texture</label>
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map(t => (
              <Chip 
                key={t} 
                label={t} 
                selected={coffee.bodyType === t}
                onClick={() => handleUpdate({ bodyType: t as any })}
                disabled={isDisabled}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* G. Balance */}
      <Card>
        <SectionTitle icon={<BalanceIcon className="w-6 h-6" />}>Équilibre</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.balanceScore} 
          onChange={(val) => handleUpdate({ balanceScore: val })}
          disabled={isDisabled}
        />
      </Card>

      {/* I. Comments */}
      <Card>
        <SectionTitle icon={<CommentIcon className="w-6 h-6" />}>Commentaires</SectionTitle>
        <textarea
          className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 min-h-[120px] 
                     focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all duration-300 ease-standard
                     placeholder-gray-400 dark:placeholder-gray-600 text-gray-800 dark:text-white"
          placeholder="Notez vos observations..."
          value={coffee.comments}
          onChange={(e) => handleUpdate({ comments: e.target.value })}
          disabled={isDisabled}
        />
      </Card>

      {/* Score & Validation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 p-4 shadow-lg z-50 md:pl-64 transition-colors duration-300">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Score Final</span>
                <span className="text-3xl font-black text-primary transition-all duration-300 key={finalScore} animate-pop">
                  {finalScore.toFixed(2)}
                </span>
            </div>
            
            <div className="flex gap-3">
                {!isDisabled && onDelete && (
                    <Button variant="outline" onClick={onDelete} className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      🗑️
                    </Button>
                )}
                {!isDisabled ? (
                    <Button onClick={() => onUpdate({ ...coffee, isLocked: true })} className="shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        Valider ce café
                    </Button>
                ) : (
                    <Button variant="secondary" onClick={() => onUpdate({ ...coffee, isLocked: false })}>
                        Déverrouiller
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeForm;