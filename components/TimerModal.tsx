
import React, { useState, useEffect } from 'react';
import { Button } from './UI';

interface TimerModalProps {
  onClose: () => void;
  dict: any;
}

const TimerModal: React.FC<TimerModalProps> = ({ onClose, dict }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  // Sound generation helper using Web Audio API
  const playNotificationSound = (type: 'simple' | 'double' = 'simple') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playBeep = (startTime: number, freq: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.5, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          osc.start(startTime);
          osc.stop(startTime + duration);
      };

      // First beep
      playBeep(now, 880, 1);

      // Second beep if double (for finish)
      if (type === 'double') {
          playBeep(now + 0.2, 880, 1);
          playBeep(now + 0.4, 1100, 1.5);
      }

    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
            const newVal = prev - 1;
            
            // LOGIQUE D'ALERTE INTERMÉDIAIRE (Casse de la croûte)
            // Si on est sur le mode 6 minutes (360s), on veut sonner quand il reste 2 minutes (120s)
            // Ce qui correspond à 4 minutes écoulées.
            if (initialTime === 360 && newVal === 120) {
                 playNotificationSound('simple');
                 if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
            return newVal;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      
      // Fin du timer
      playNotificationSound('double');

      // Vibration longue
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 500]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, initialTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // Calcul pour afficher le marqueur des 4 minutes sur le cercle
  // Si Total = 6min (360s), 4min = 66% du cercle. 
  // Le marqueur doit être à (4/6) * 360 degrés.
  const crustMarkerRotation = initialTime === 360 ? (4/6) * 360 : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-surface dark:bg-surface-container-dark p-6 rounded-3xl shadow-elevation-3 max-w-sm w-full relative flex flex-col items-center gap-6" 
        onClick={e => e.stopPropagation()}
      >
         <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant/50 hover:text-on-surface-variant p-2">✕</button>
         
         <h3 className="text-title-large font-bold text-primary dark:text-primary-dark">{dict.timer}</h3>

         <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle 
                  cx="100" cy="100" r={radius} 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className="text-surface-container-high dark:text-surface-container-high-dark" 
                />
                
                {/* Marker for Crust Break (only visible in 6min mode) */}
                {initialTime === 360 && (
                    <line 
                        x1="100" y1="10" x2="100" y2="25" 
                        stroke="currentColor" strokeWidth="4"
                        className="text-on-surface-variant/50"
                        transform={`rotate(${crustMarkerRotation} 100 100)`}
                    />
                )}

                {/* Progress Circle */}
                <circle 
                    cx="100" cy="100" r={radius} 
                    stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className="text-primary dark:text-primary-dark transition-all duration-1000 ease-linear"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * progress) / 100}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-6xl font-bold tabular-nums text-on-surface dark:text-on-surface-dark">
                    {formatTime(timeLeft)}
                </span>
                <span className="text-label-medium text-on-surface-variant dark:text-on-surface-variant-dark uppercase tracking-widest mt-2 animate-pulse">
                    {isRunning 
                        ? (initialTime === 360 && timeLeft > 120 ? dict.crust : dict.taste) 
                        : (timeLeft === 0 && initialTime > 0 ? dict.finished : dict.pause)
                    }
                </span>
            </div>
         </div>

         <div className="flex gap-3 w-full">
            <button 
                onClick={() => startTimer(4)} 
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-label-large hover:brightness-95 active:scale-95 transition-all
                    ${initialTime === 240 ? 'bg-primary text-on-primary ring-2 ring-offset-2 ring-primary' : 'bg-secondary-container text-on-secondary-container animate-pulse-gentle'}
                `}
            >
                4 min
                <span className="block text-[10px] font-normal opacity-70">{dict.crust}</span>
            </button>
            <button 
                onClick={() => startTimer(6)} 
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-label-large hover:brightness-95 active:scale-95 transition-all
                    ${initialTime === 360 ? 'bg-primary text-on-primary ring-2 ring-offset-2 ring-primary' : 'bg-secondary-container text-on-secondary-container animate-pulse-gentle'}
                `}
            >
                6 min
                <span className="block text-[10px] font-normal opacity-70">{dict.taste}</span>
            </button>
         </div>

         <div className="flex gap-4 w-full">
            {initialTime > 0 && (
                <>
                    <Button variant="tonal" onClick={reset} className="flex-1">
                        {dict.reset}
                    </Button>
                    <Button variant="filled" onClick={togglePause} className="flex-[2]">
                        {isRunning ? dict.pause : dict.resume}
                    </Button>
                </>
            )}
         </div>
      </div>
    </div>
  );
};

export default TimerModal;
