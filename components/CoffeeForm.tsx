
import React, { useMemo, useState } from 'react';
import { CoffeeEntry, Language } from '../types';
import { Card, SectionTitle, Slider, Chip, Button, SplitButton } from './UI';
import AromaSelector from './AromaSelector';
import { ACIDITY_TYPES, ACIDITY_INTENSITIES, BODY_TYPES, PROCESSING_METHODS } from '../constants';
import { 
  FragranceIcon, FlavorIcon, AftertasteIcon, 
  AcidityIcon, BodyIcon, BalanceIcon, CommentIcon,
  HeartIcon, HeartFilledIcon, ProcessIcon, TimerIcon, DeleteSessionIcon
} from './Icons';

interface CoffeeFormProps {
  coffee: CoffeeEntry;
  onUpdate: (coffee: CoffeeEntry) => void;
  onDelete?: () => void;
  onOpenTimer?: () => void;
  timerState?: { isRunning: boolean; timeLeft: number }; // Optional prop for timer display
  dict: any;
  language?: Language;
}

const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  score: number;
  onScoreChange: (val: number) => void;
  disabled: boolean;
  children: React.ReactNode;
  delay?: string;
  label?: string;
}> = ({ title, icon, score, onScoreChange, disabled, children, delay = '0ms', label = "Note" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="animate-fadeIn transition-all duration-300" style={{ animationDelay: delay }}>
      <div className="flex justify-between items-center mb-4">
        <SectionTitle icon={icon}>{title}</SectionTitle>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
            className={`transform transition-transform duration-300 ease-emphasized ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      <Slider 
        label={label} 
        value={score} 
        onChange={onScoreChange}
        disabled={disabled}
        variant="centered"
      />

      <div className={`grid transition-all duration-300 ease-emphasized ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
           {children}
        </div>
      </div>
    </Card>
  );
};

const CoffeeForm: React.FC<CoffeeFormProps> = ({ coffee, onUpdate, onDelete, onOpenTimer, timerState, dict, language = 'fr' }) => {
  const isDisabled = coffee.isLocked;

  const handleUpdate = (updates: Partial<CoffeeEntry>) => {
    if (isDisabled && !('isFavorite' in updates)) return;
    onUpdate({ ...coffee, ...updates });
  };

  const finalScore = useMemo(() => {
    const sum = coffee.fragranceScore + coffee.flavorScore + coffee.aftertasteScore + coffee.acidityScore + coffee.bodyScore + coffee.balanceScore;
    return sum / 6;
  }, [coffee]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pb-32">
      {/* Header Info */}
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
                placeholder={dict.coffeeNamePlaceholder}
                />
                <label 
                    htmlFor="coffeeName"
                    className="absolute left-0 -top-3 text-label-small text-primary dark:text-primary-dark transition-all duration-300 ease-emphasized peer-placeholder-shown:text-body-large peer-placeholder-shown:top-1 peer-placeholder-shown:text-on-surface-variant peer-focus:-top-3 peer-focus:text-label-small peer-focus:text-primary"
                >
                    {dict.coffeeNamePlaceholder}
                </label>
            </div>
            
            {!isDisabled && onDelete && (
                <button 
                    onClick={() => {
                        if(window.confirm(dict.deleteConfirm)) onDelete();
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors active:scale-90"
                    title={dict.deleteCoffee}
                >
                    <DeleteSessionIcon className="w-6 h-6" />
                </button>
            )}
        </div>

        <div className="flex justify-between items-center mt-3">
           <div className="text-body-small text-on-surface-variant dark:text-on-surface-variant-dark">
             Date: {new Date(coffee.timestamp).toLocaleDateString()}
           </div>
           {isDisabled && (
             <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-small font-bold animate-pop flex items-center gap-1">
               🔒 {dict.validated}
             </span>
           )}
        </div>
      </div>

      {/* B. Fragrance */}
      <CollapsibleSection
        title={dict.fragrance}
        icon={<FragranceIcon className="w-6 h-6" />}
        score={coffee.fragranceScore}
        onScoreChange={(val) => handleUpdate({ fragranceScore: val })}
        disabled={isDisabled}
        delay="50ms"
        label={dict.score}
      >
          <label className="text-label-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-3 block">{dict.notesOlfactory}</label>
          <AromaSelector 
            selectedNotes={coffee.fragranceNotes}
            onChange={(notes) => handleUpdate({ fragranceNotes: notes })}
            disabled={isDisabled}
            language={language}
          />
      </CollapsibleSection>

      {/* C. Flavor */}
      <CollapsibleSection
        title={dict.flavor}
        icon={<FlavorIcon className="w-6 h-6" />}
        score={coffee.flavorScore}
        onScoreChange={(val) => handleUpdate({ flavorScore: val })}
        disabled={isDisabled}
        delay="100ms"
        label={dict.score}
      >
          <label className="text-label-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-3 block">{dict.notesMouth}</label>
          <AromaSelector 
            selectedNotes={coffee.flavorNotes}
            onChange={(notes) => handleUpdate({ flavorNotes: notes })}
            disabled={isDisabled}
            language={language}
          />
      </CollapsibleSection>

      {/* Process Section */}
      <Card className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
         <SectionTitle icon={<ProcessIcon className="w-6 h-6" />}>{dict.process}</SectionTitle>
         <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mx-2 px-2">
            {PROCESSING_METHODS.map(process => (
              <Chip 
                key={process} 
                label={process} 
                selected={coffee.process === process}
                onClick={() => handleUpdate({ process: process })}
                disabled={isDisabled}
              />
            ))}
         </div>
      </Card>

      {/* D. Aftertaste */}
      <Card className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <SectionTitle icon={<AftertasteIcon className="w-6 h-6" />}>{dict.aftertaste}</SectionTitle>
        <Slider 
          label={dict.score}
          value={coffee.aftertasteScore} 
          onChange={(val) => handleUpdate({ aftertasteScore: val })}
          disabled={isDisabled}
          variant="centered"
        />
      </Card>

      {/* E. Acidity */}
      <CollapsibleSection
        title={dict.acidity}
        icon={<AcidityIcon className="w-6 h-6" />}
        score={coffee.acidityScore}
        onScoreChange={(val) => handleUpdate({ acidityScore: val })}
        disabled={isDisabled}
        delay="250ms"
        label={dict.score}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">{dict.type}</label>
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
            <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">{dict.intensity}</label>
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
      </CollapsibleSection>

      {/* F. Body */}
      <CollapsibleSection
        title={dict.body}
        icon={<BodyIcon className="w-6 h-6" />}
        score={coffee.bodyScore}
        onScoreChange={(val) => handleUpdate({ bodyScore: val })}
        disabled={isDisabled}
        delay="300ms"
        label={dict.score}
      >
        <div className="mt-2">
          <label className="text-label-small text-on-surface-variant dark:text-on-surface-variant-dark uppercase mb-3 block tracking-wider">{dict.texture}</label>
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
      </CollapsibleSection>

      {/* G. Balance */}
      <Card className="animate-fadeIn" style={{ animationDelay: '350ms' }}>
        <SectionTitle icon={<BalanceIcon className="w-6 h-6" />}>{dict.balance}</SectionTitle>
        <Slider 
          label={dict.score}
          value={coffee.balanceScore} 
          onChange={(val) => handleUpdate({ balanceScore: val })}
          disabled={isDisabled}
          variant="centered"
        />
      </Card>

      {/* I. Comments */}
      <Card className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <SectionTitle icon={<CommentIcon className="w-6 h-6" />}>{dict.comments}</SectionTitle>
        <div className="relative group">
          <textarea
            className="w-full bg-surface-container dark:bg-surface-container-high-dark border-b border-outline dark:border-outline-variant rounded-t-lg p-4 min-h-[120px] 
                       focus:border-primary focus:outline-none transition-all duration-300 ease-emphasized focus:scale-[1.005] origin-top
                       placeholder-on-surface-variant/50 text-body-large text-on-surface dark:text-on-surface-dark resize-none"
            placeholder={dict.commentsPlaceholder}
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
                    <HeartFilledIcon key={`fav-${coffee.isFavorite}`} className="w-7 h-7 text-red-500 animate-pop" />
                ) : (
                    <HeartIcon key={`fav-${coffee.isFavorite}`} className="w-7 h-7 text-on-surface-variant dark:text-on-surface-variant-dark" />
                )}
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-8 bg-outline-variant dark:bg-white/10"></div>

            {/* Score Display */}
            <div className="flex flex-col items-center leading-none min-w-[3rem]">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-on-surface-variant-dark tracking-wider">{dict.score}</span>
                <span className="text-headline-small font-bold text-primary dark:text-primary-dark tabular-nums transition-all duration-200">
                    {finalScore.toFixed(2)}
                </span>
            </div>

            {/* Timer Button */}
            {onOpenTimer && (
              <button 
                  onClick={onOpenTimer}
                  className={`
                    flex items-center justify-center p-2 ml-1 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark 
                    hover:bg-surface-variant/50 dark:hover:bg-white/5 active:scale-90 transition-all duration-300 ease-emphasized relative
                    ${timerState?.isRunning ? 'bg-primary/10 text-primary dark:text-primary-dark' : ''}
                  `}
                  title={dict.timer}
              >
                  {timerState?.isRunning ? (
                      <span className="text-xs font-bold tabular-nums min-w-[32px]">{formatTime(timerState.timeLeft)}</span>
                  ) : (
                      <TimerIcon className="w-6 h-6" />
                  )}
                  {timerState?.isRunning && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  )}
              </button>
            )}

            {/* Split Button Actions */}
            <div className="ml-2">
                {!isDisabled ? (
                    <Button 
                        variant="filled" 
                        onClick={() => onUpdate({ ...coffee, isLocked: true })} 
                        className="shadow-elevation-1 !h-12 !px-6 ring-2 ring-primary/20 ring-offset-2 ring-offset-surface"
                    >
                        {dict.validate}
                    </Button>
                ) : (
                   <div className="relative inline-flex rounded-full shadow-elevation-1">
                        <button 
                            onClick={() => onUpdate({ ...coffee, isLocked: false })}
                            className="h-12 px-5 rounded-l-full bg-secondary-container text-on-secondary-container dark:bg-secondary-container-dark dark:text-on-secondary-container-dark font-medium border-r border-white/20 active:scale-95 transition-transform"
                        >
                            {dict.modify}
                        </button>
                        <div className="h-12 bg-secondary-container dark:bg-secondary-container-dark rounded-r-full flex items-center pr-2 pl-1 group relative">
                            <span className="text-on-secondary-container dark:text-on-secondary-container-dark p-1 cursor-pointer">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
                            </span>
                             <div className="absolute bottom-full right-0 mb-2 w-48 bg-surface-container-high dark:bg-surface-container-high-dark rounded-xl shadow-elevation-3 py-1 z-50 overflow-hidden hidden group-hover:block hover:block origin-bottom-right animate-fadeIn">
                                <button
                                    onClick={() => onUpdate({ 
                                        ...coffee, 
                                        fragranceScore: 8.0, flavorScore: 8.0, aftertasteScore: 8.0, 
                                        acidityScore: 8.0, bodyScore: 8.0, balanceScore: 8.0 
                                    })}
                                    className="w-full text-left px-4 py-3 text-label-large hover:bg-surface-variant/50 dark:hover:bg-white/5 text-on-surface dark:text-on-surface-dark"
                                >
                                    {dict.resetNotes}
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={() => { if(window.confirm(dict.deleteConfirm)) onDelete(); }}
                                        className="w-full text-left px-4 py-3 text-label-large hover:bg-error/10 text-error"
                                    >
                                        {dict.deleteCoffee}
                                    </button>
                                )}
                             </div>
                        </div>
                   </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeForm;
