
import React, { useState, useEffect } from 'react';
import { BrewRecipe, BrewMethodType } from '../types';
import { Button, Card, SectionTitle, Slider } from './UI';
import { V60Icon, ChemexIcon, AeropressIcon, FrenchPressIcon, MokaIcon, CommentIcon, DeleteSessionIcon } from './Icons';

interface BrewingInterfaceProps {
    onBack: () => void;
    dict: any;
}

const METHODS: { id: BrewMethodType; name: string; icon: React.FC<any>; defaultRatio: number }[] = [
    { id: 'v60', name: 'V60', icon: V60Icon, defaultRatio: 16 },
    { id: 'chemex', name: 'Chemex', icon: ChemexIcon, defaultRatio: 15 },
    { id: 'aeropress', name: 'Aeropress', icon: AeropressIcon, defaultRatio: 14 },
    { id: 'french_press', name: 'Piston', icon: FrenchPressIcon, defaultRatio: 12 },
    { id: 'moka', name: 'Moka', icon: MokaIcon, defaultRatio: 10 },
    { id: 'kalita', name: 'Kalita', icon: V60Icon, defaultRatio: 16 },
];

const generateId = () => Math.random().toString(36).substring(2, 15);

const BrewingInterface: React.FC<BrewingInterfaceProps> = ({ onBack, dict }) => {
    const [method, setMethod] = useState<BrewMethodType>('v60');
    const [coffeeWeight, setCoffeeWeight] = useState<number>(20);
    const [ratio, setRatio] = useState<number>(16);
    const [waterWeight, setWaterWeight] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const [rating, setRating] = useState<number>(8);
    const [grindSize, setGrindSize] = useState<string>('');
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const [savedRecipes, setSavedRecipes] = useState<BrewRecipe[]>(() => {
        const saved = localStorage.getItem('toulouse_cupping_brews');
        return saved ? JSON.parse(saved) : [];
    });
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        setWaterWeight(Math.round(coffeeWeight * ratio));
    }, [coffeeWeight, ratio]);

    useEffect(() => {
        const m = METHODS.find(m => m.id === method);
        if (m) setRatio(m.defaultRatio);
    }, [method]);

    useEffect(() => {
        let interval: number;
        if (isTimerRunning) {
            interval = window.setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const saveRecipe = () => {
        const newRecipe: BrewRecipe = {
            id: generateId(),
            timestamp: Date.now(),
            method,
            coffeeWeight,
            ratio,
            waterWeight,
            grindSize,
            totalTime: timerSeconds,
            rating,
            notes
        };
        const updated = [newRecipe, ...savedRecipes];
        setSavedRecipes(updated);
        localStorage.setItem('toulouse_cupping_brews', JSON.stringify(updated));
        alert(dict.saved);
    };

    const deleteRecipe = (id: string) => {
        if(confirm(dict.confirmDeleteRecipe)) {
            const updated = savedRecipes.filter(r => r.id !== id);
            setSavedRecipes(updated);
            localStorage.setItem('toulouse_cupping_brews', JSON.stringify(updated));
        }
    };

    const loadRecipe = (r: BrewRecipe) => {
        setMethod(r.method);
        setCoffeeWeight(r.coffeeWeight);
        setRatio(r.ratio);
        setNotes(r.notes);
        setGrindSize(r.grindSize || '');
        setRating(r.rating || 8);
        setTimerSeconds(r.totalTime || 0);
        setIsTimerRunning(false);
        setShowHistory(false);
    };

    return (
        <div className="animate-fadeIn p-4 pb-20 max-w-2xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-small font-bold text-primary flex items-center gap-2">
                    <span>☕</span> {dict.brewingLab}
                </h2>
                <Button variant="outlined" onClick={onBack}>{dict.back}</Button>
            </div>

            {showHistory ? (
                <div className="animate-slideUp">
                    <h3 className="text-title-medium mb-4 font-bold text-on-surface">{dict.history}</h3>
                    <div className="space-y-3">
                        {savedRecipes.length === 0 && <p className="opacity-60 italic text-on-surface-variant">{dict.noRecipes}</p>}
                        {savedRecipes.map(recipe => (
                            <Card key={recipe.id} className="cursor-pointer hover:bg-surface-container-high" onClick={() => loadRecipe(recipe)}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-primary capitalize text-lg">
                                                {METHODS.find(m => m.id === recipe.method)?.name || recipe.method}
                                            </span>
                                            {recipe.rating && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                                    {recipe.rating}/10
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm opacity-80 text-on-surface-variant">{new Date(recipe.timestamp).toLocaleDateString()}</div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }} 
                                        className="text-error p-2 hover:bg-error/10 rounded-full transition-colors"
                                        title={dict.confirmDeleteRecipe}
                                    >
                                        <DeleteSessionIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mt-2 text-sm grid grid-cols-2 gap-2 text-on-surface-variant">
                                    <div>☕ {recipe.coffeeWeight}g</div>
                                    <div>💧 {recipe.waterWeight}g (1:{recipe.ratio})</div>
                                    <div>⏱️ {formatTime(recipe.totalTime)}</div>
                                    <div>⚙️ {recipe.grindSize || '-'}</div>
                                </div>
                                {recipe.notes && (
                                    <div className="mt-2 text-sm italic border-t border-outline/10 pt-2 opacity-80 truncate text-on-surface">
                                        "{recipe.notes}"
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                    <Button variant="tonal" className="w-full mt-4" onClick={() => setShowHistory(false)}>{dict.closeHistory}</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Method Selector */}
                    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar flex gap-4 py-2 snap-x">
                        {METHODS.map(m => {
                            const Icon = m.icon;
                            const isSelected = method === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`
                                        flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[80px] snap-center transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-primary text-on-primary shadow-elevation-2 scale-105' 
                                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                        }
                                    `}
                                >
                                    <Icon className="w-8 h-8" />
                                    <span className="text-label-medium font-bold">{m.name}</span>
                                </button>
                            );
                        })}
                        <div className="min-w-[1px]"></div>
                    </div>

                    {/* Calculator Card */}
                    <Card>
                        <SectionTitle>{dict.recipe}</SectionTitle>
                        <div className="flex gap-4 items-end mb-4">
                            <div className="flex-1">
                                <label className="text-label-medium text-on-surface-variant mb-1 block">{dict.coffeeWeight}</label>
                                <input 
                                    type="number" 
                                    value={coffeeWeight} 
                                    onChange={(e) => setCoffeeWeight(Number(e.target.value))}
                                    className="w-full bg-surface-container-highest border border-outline/30 rounded-xl p-3 text-headline-small font-bold text-center text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div className="text-2xl pb-3 opacity-50 text-on-surface">×</div>
                            <div className="flex-1">
                                <label className="text-label-medium text-on-surface-variant mb-1 block">{dict.ratio}</label>
                                <input 
                                    type="number" 
                                    value={ratio} 
                                    onChange={(e) => setRatio(Number(e.target.value))}
                                    className="w-full bg-surface-container-highest border border-outline/30 rounded-xl p-3 text-headline-small font-bold text-center text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="bg-secondary-container rounded-xl p-4 text-center">
                            <span className="text-label-large block text-on-secondary-container mb-1">{dict.waterRequired}</span>
                            <span className="text-display-medium font-bold text-primary">{waterWeight}g</span>
                        </div>
                        <div className="mt-4">
                            <label className="text-label-medium text-on-surface-variant mb-1 block">{dict.grindSize}</label>
                            <input 
                                type="text" 
                                value={grindSize}
                                onChange={(e) => setGrindSize(e.target.value)}
                                placeholder={dict.grindPlaceholder}
                                className="w-full bg-transparent border-b border-outline/30 p-2 text-body-large text-on-surface focus:border-primary focus:outline-none placeholder-on-surface-variant/50"
                            />
                        </div>
                    </Card>

                    {/* Timer Card */}
                    <Card>
                        <div className="text-center">
                            <div className="text-display-large font-bold tabular-nums mb-4 text-on-surface">
                                {formatTime(timerSeconds)}
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button 
                                    variant={isTimerRunning ? "outlined" : "filled"} 
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className="w-32"
                                >
                                    {isTimerRunning ? dict.pause : 'Start'}
                                </Button>
                                <Button 
                                    variant="tonal" 
                                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                                >
                                    {dict.reset}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Notes & Rating Card */}
                    <Card>
                        <SectionTitle icon={<CommentIcon className="w-5 h-5"/>}>{dict.cupResult}</SectionTitle>
                        
                        <div className="mb-6">
                             <Slider 
                                label={dict.globalRating}
                                value={rating}
                                min={1}
                                max={10}
                                step={0.5}
                                onChange={setRating}
                                variant="centered"
                             />
                        </div>

                        <textarea
                            className="w-full bg-surface-container-highest border border-outline/20 rounded-lg p-3 min-h-[100px] text-body-medium text-on-surface focus:border-primary focus:outline-none placeholder-on-surface-variant/50"
                            placeholder={dict.notesPlaceholder}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Card>

                    <div className="flex gap-3 pb-6">
                         <Button variant="tonal" className="flex-1" onClick={() => setShowHistory(true)}>
                            📂 {dict.history}
                         </Button>
                         <Button variant="filled" className="flex-1" onClick={saveRecipe}>
                            💾 {dict.save}
                         </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrewingInterface;
