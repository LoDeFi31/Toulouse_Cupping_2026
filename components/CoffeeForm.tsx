import React, { useMemo } from 'react';
import { CoffeeEntry } from '../types';
import { Card, SectionTitle, Slider, Chip, Button } from './UI';
import AromaSelector from './AromaSelector';
import RoastSelector from './RoastSelector';
import { ACIDITY_TYPES, ACIDITY_INTENSITIES, BODY_TYPES } from '../constants';
import { 
  RoastIcon, FragranceIcon, FlavorIcon, AftertasteIcon, 
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
      <div className="bg-primary text-white p-4 rounded-xl shadow-lg mb-6 flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wide opacity-80">Nom du café</label>
        <input
          type="text"
          value={coffee.name}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          disabled={isDisabled}
          className="bg-transparent text-2xl font-bold border-b border-white/30 focus:border-white focus:outline-none placeholder-white/50 w-full"
          placeholder="Ex: Éthiopie Yirgacheffe"
        />
        <div className="flex justify-between items-end mt-2">
           <div className="text-sm opacity-90">
             Date: {new Date(coffee.timestamp).toLocaleDateString()}
           </div>
           {isDisabled && <span className="bg-white/20 px-2 py-1 rounded text-xs">Validé 🔒</span>}
        </div>
      </div>

      {/* A. Roast Level */}
      <Card>
        <SectionTitle icon={<RoastIcon className="w-6 h-6" />}>Torréfaction</SectionTitle>
        <RoastSelector 
          value={coffee.roastLevel} 
          onChange={(val) => handleUpdate({ roastLevel: val })}
          disabled={isDisabled}
        />
      </Card>

      {/* B. Fragrance */}
      <Card>
        <SectionTitle icon={<FragranceIcon className="w-6 h-6" />}>Fragrance / Arôme</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.fragranceScore} 
          onChange={(val) => handleUpdate({ fragranceScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-4">
          <label className="text-sm text-gray-600 mb-2 block">Notes olfactives</label>
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
        <div className="mt-4">
          <label className="text-sm text-gray-600 mb-2 block">Notes en bouche</label>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Type</label>
            <div className="flex flex-wrap gap-1">
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
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Intensité</label>
            <div className="flex flex-wrap gap-1">
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
        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Texture</label>
          <div className="flex flex-wrap gap-1">
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
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Notez vos observations..."
          value={coffee.comments}
          onChange={(e) => handleUpdate({ comments: e.target.value })}
          disabled={isDisabled}
        />
      </Card>

      {/* Score & Validation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 md:pl-64">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Score Final</span>
                <span className="text-3xl font-bold text-primary">{finalScore.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2">
                {!isDisabled && onDelete && (
                    <Button variant="outline" onClick={onDelete} className="text-red-500 border-red-500">
                      🗑️
                    </Button>
                )}
                {!isDisabled ? (
                    <Button onClick={() => onUpdate({ ...coffee, isLocked: true })}>
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