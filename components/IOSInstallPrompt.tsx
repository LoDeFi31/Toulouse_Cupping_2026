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
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ios_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-slideUp">
      <div className="bg-surface/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl p-4 max-w-md mx-auto relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-primary text-lg mb-2 pr-8">Installer l'application</h3>
        <p className="text-sm text-gray-600 mb-4">
          Pour une meilleure expérience sur iPhone, installez l'application sur votre écran d'accueil.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-800 bg-white/50 p-2 rounded-lg border border-primary/10">
             <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs">1</span>
             <span>Appuyez sur le bouton </span>
             <span className="text-[#007AFF]">
               {/* Share Icon */}
               <svg viewBox="0 0 50 50" width="20" height="20" fill="currentColor">
                 <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/>
                 <path d="M24 7h2v21h-2z"/>
                 <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/>
               </svg>
             </span>
             <span> (Partager)</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm font-medium text-gray-800 bg-white/50 p-2 rounded-lg border border-primary/10">
             <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs">2</span>
             <span>Sélectionnez </span>
             <span className="font-bold">Sur l'écran d'accueil</span>
             <span className="bg-gray-200 p-0.5 rounded text-xs border border-gray-300">➕</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;