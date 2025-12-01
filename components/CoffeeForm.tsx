import React, { useMemo } from 'react';
import { CoffeeEntry } from '../types';
import { Card, SectionTitle, Slider, Chip, Button } from './UI';
import AromaSelector from './AromaSelector';
import { ACIDITY_TYPES, ACIDITY_INTENSITIES, BODY_TYPES } from '../constants';
import { 
  FragranceIcon, FlavorIcon, AftertasteIcon, 
  AcidityIcon, BodyIcon, BalanceIcon, CommentIcon,
  HeartIcon, HeartFilledIcon
} from './Icons';

interface CoffeeFormProps {
  coffee: CoffeeEntry;
  onUpdate: (coffee: CoffeeEntry) => void;
  onDelete?: () => void;
}

const CoffeeForm: React.FC<CoffeeFormProps> = ({ coffee, onUpdate, onDelete }) => {
  const isDisabled = coffee.isLocked;

  const handleUpdate = (updates: Partial<CoffeeEntry>) => {
    if (isDisabled && !('isFavorite' in updates)) return; // Allow favoriting even if locked
    onUpdate({ ...coffee, ...updates });
  };

  const finalScore = useMemo(() => {
    const sum = coffee.fragranceScore + coffee.flavorScore + coffee.aftertasteScore + coffee.acidityScore + coffee.bodyScore + coffee.balanceScore;
    return sum / 6;
  }, [coffee]);

  return (
    <div className="pb-32">
      {/* Header Info - M3 Surface Container Style */}
      <div className="bg-surface-container-high dark:bg-surface-container-high-dark p-5 rounded-2xl shadow-sm mb-6 flex flex-col gap-1 transition-transform duration-500 ease-emphasized relative animate-fadeIn">
        <div className="flex justify-between items-start">
            <div className="relative pt-2 w-full mr-10 group">
                <input
                type="text"
                id="coffeeName"
                value={coffee.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
                disabled={isDisabled}
                className="peer w-full bg-transparent border-b border-outline text-headline-small text-on-surface dark:text-on-surface-dark pb-1 focus:border-primary focus:outline-none transition-all duration-300 ease-emphasized placeholder-transparent focus:scale-[1.01] origin-left"
                placeholder="Nom du café"
                />
                <label 
                    htmlFor="coffeeName"
                    className="absolute left-0 -top-3 text-label-small text-primary dark:text-primary-dark transition-all duration-300 ease-emphasized peer-placeholder-shown:text-body-large peer-placeholder-shown:top-1 peer-placeholder-shown:text-on-surface-variant peer-focus:-top-3 peer-focus:text-label-small peer-focus:text-primary"
                >
                    Nom du café
                </label>
            </div>
            
            {/* Delete Button (Moved to Header) */}
            {!isDisabled && onDelete && (
                <button 
                    onClick={() => {
                        if(window.confirm('Supprimer ce café ?')) onDelete();
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:bg-error/10 hover:text-red-600 transition-colors"
                    title="Supprimer ce café"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            )}
        </div>

        <div className="flex justify-between items-center mt-3">
           <div className="text-body-small text-on-surface-variant dark:text-on-surface-variant-dark">
             Date: {new Date(coffee.timestamp).toLocaleDateString()}
           </div>
           {isDisabled && (
             <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-small font-bold animate-pop flex items-center gap-1">
               🔒 Validé
             </span>
           )}
        </div>
      </div>

      {/* B. Fragrance */}
      <Card className="animate-fadeIn" style={{ animationDelay: '50ms' }}>
        <SectionTitle icon={<FragranceIcon className="w-6 h-6" />}>Fragrance / Arôme</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.fragranceScore} 
          onChange={(val) => handleUpdate({ fragranceScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-5">
          <label className="text-label-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-3 block">Notes olfactives</label>
          <AromaSelector 
            selectedNotes={coffee.fragranceNotes}
            onChange={(notes) => handleUpdate({ fragranceNotes: notes })}
            disabled={isDisabled}
          />
        </div>
      </Card>

      {/* C. Flavor */}
      <Card className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <SectionTitle icon={<FlavorIcon className="w-6 h-6" />}>Saveur</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.flavorScore} 
          onChange={(val) => handleUpdate({ flavorScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-5">
          <label className="text-label-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-3 block">Notes en bouche</label>
          <AromaSelector 
            selectedNotes={coffee.flavorNotes}
            onChange={(notes) => handleUpdate({ flavorNotes: notes })}
            disabled={isDisabled}
          />
        </div>
      </Card>

      {/* D. Aftertaste */}
      <Card className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
        <SectionTitle icon={<AftertasteIcon className="w-6 h-6" />}>Arrière-goût</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.aftertasteScore} 
          onChange={(val) => handleUpdate({ aftertasteScore: val })}
          disabled={isDisabled}
        />
      </Card>

      {/* E. Acidity */}
      <Card className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <SectionTitle icon={<AcidityIcon className="w-6 h-6" />}>Acidité</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.acidityScore} 
          onChange={(val) => handleUpdate({ acidityScore: val })}
          disabled={isDisabled}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">Type</label>
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
            <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">Intensité</label>
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
      <Card className="animate-fadeIn" style={{ animationDelay: '250ms' }}>
        <SectionTitle icon={<BodyIcon className="w-6 h-6" />}>Corps</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.bodyScore} 
          onChange={(val) => handleUpdate({ bodyScore: val })}
          disabled={isDisabled}
        />
        <div className="mt-6">
          <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">Texture</label>
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
      <Card className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <SectionTitle icon={<BalanceIcon className="w-6 h-6" />}>Équilibre</SectionTitle>
        <Slider 
          label="Note" 
          value={coffee.balanceScore} 
          onChange={(val) => handleUpdate({ balanceScore: val })}
          disabled={isDisabled}
        />
      </Card>

      {/* I. Comments - M3 Filled Text Area */}
      <Card className="animate-fadeIn" style={{ animationDelay: '350ms' }}>
        <SectionTitle icon={<CommentIcon className="w-6 h-6" />}>Commentaires</SectionTitle>
        <div className="relative group">
          <textarea
            className="w-full bg-surface-container dark:bg-surface-container-high-dark border-b border-outline dark:border-outline-variant rounded-t-lg p-4 min-h-[120px] 
                       focus:border-primary focus:outline-none transition-all duration-300 ease-emphasized focus:scale-[1.005] origin-top
                       placeholder-on-surface-variant/50 text-body-large text-on-surface dark:text-on-surface-dark resize-none"
            placeholder="Observations, défauts, notes..."
            value={coffee.comments}
            onChange={(e) => handleUpdate({ comments: e.target.value })}
            disabled={isDisabled}
          />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline scale-x-0 transition-transform duration-300 ease-emphasized peer-focus:scale-x-100 group-focus-within:scale-x-100 group-focus-within:h-[2px] group-focus-within:bg-primary"></div>
        </div>
      </Card>

      {/* M3 Floating Toolbar */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-50 flex justify-center pointer-events-none no-print">
        <div className="pointer-events-auto bg-surface-container-high dark:bg-surface-container-high-dark text-on-surface dark:text-on-surface-dark shadow-elevation-3 rounded-full p-2 pl-5 pr-2 flex items-center gap-4 border border-outline/10 backdrop-blur-md animate-slideUp">
            
            {/* Favorite Toggle */}
            <button 
                onClick={() => handleUpdate({ isFavorite: !coffee.isFavorite })}
                className="flex items-center justify-center p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/5 active:scale-90 transition-all duration-300 ease-emphasized"
                title="Favoris"
            >
                {coffee.isFavorite ? (
                    <HeartFilledIcon className="w-7 h-7 text-red-500 animate-pop" />
                ) : (
                    <HeartIcon className="w-7 h-7 text-on-surface-variant dark:text-on-surface-variant-dark" />
                )}
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-8 bg-outline-variant dark:bg-white/10"></div>

            {/* Score Display */}
            <div className="flex flex-col items-center leading-none min-w-[3rem]">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-on-surface-variant-dark tracking-wider">Score</span>
                <span className="text-headline-small font-bold text-primary dark:text-primary-dark tabular-nums transition-all duration-200">
                    {finalScore.toFixed(2)}
                </span>
            </div>

            {/* Validate/Unlock Button */}
            {!isDisabled ? (
                <Button 
                    variant="filled" 
                    onClick={() => onUpdate({ ...coffee, isLocked: true })} 
                    className="shadow-elevation-1 !h-12 !px-6"
                >
                    Valider
                </Button>
            ) : (
                <Button 
                    variant="tonal" 
                    onClick={() => onUpdate({ ...coffee, isLocked: false })}
                    className="!h-12 !px-6"
                >
                    Modifier
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeForm;