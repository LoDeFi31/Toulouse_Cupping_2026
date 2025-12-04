import React, { useState, useEffect } from 'react';

export const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    // Detect Standalone (Already installed)
    const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    // Check if already dismissed
    const isDismissed = localStorage.getItem('ios_prompt_dismissed') === 'true';

    // Show if iOS, NOT standalone, and NOT dismissed
    if (isIOS && !isStandalone && !isDismissed) {
      // Delay showing to not be intrusive immediately
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ios_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-slideUp no-print pointer-events-none">
      <div className="pointer-events-auto bg-surface-container-high dark:bg-surface-container-high-dark backdrop-blur-md border border-outline-variant/20 dark:border-outline-variant-dark/20 shadow-elevation-3 rounded-2xl p-5 max-w-md mx-auto relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-surface-variant/20 transition-colors"
          aria-label="Fermer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 className="text-title-medium font-bold text-primary dark:text-primary-dark mb-2 pr-8">
          Installer l'application
        </h3>
        <p className="text-body-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-4">
          Pour une meilleure expérience sur iPhone (plein écran, hors-ligne), ajoutez l'app à l'écran d'accueil.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-body-medium text-on-surface dark:text-on-surface-dark bg-surface dark:bg-surface-dark p-3 rounded-xl border border-outline/10">
             <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 text-primary dark:text-primary-dark rounded-full text-label-small font-bold">1</span>
             <span>Appuyez sur </span>
             <span className="text-[#007AFF] dark:text-[#0A84FF]">
               {/* Share Icon */}
               <svg viewBox="0 0 50 50" width="20" height="20" fill="currentColor" style={{ display: 'inline', verticalAlign: 'text-bottom' }}>
                 <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/>
                 <path d="M24 7h2v21h-2z"/>
                 <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/>
               </svg>
             </span>
             <span className="font-medium">(Partager)</span>
          </div>
          
          <div className="flex items-center gap-3 text-body-medium text-on-surface dark:text-on-surface-dark bg-surface dark:bg-surface-dark p-3 rounded-xl border border-outline/10">
             <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 text-primary dark:text-primary-dark rounded-full text-label-small font-bold">2</span>
             <span>Cherchez </span>
             <span className="font-bold flex items-center gap-1">
               Sur l'écran d'accueil
               <span className="flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 leading-none">＋</span>
             </span>
          </div>
        </div>
        
        {/* Visual pointer to bottom of screen */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-0 md:opacity-0 animate-fadeIn" style={{ animationDelay: '1s', opacity: 1 }}>
             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-surface-container-high dark:border-t-surface-container-high-dark drop-shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;