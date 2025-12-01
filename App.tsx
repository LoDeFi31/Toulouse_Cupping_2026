import React, { useState, useEffect } from 'react';
import { CoffeeEntry, Session } from './types';
import { DEFAULT_COFFEE } from './constants';
import CoffeeForm from './components/CoffeeForm';
import SummaryTable from './components/SummaryTable';
import { Button, GoogleSignInButton } from './components/UI';
import { AppLogo, QrCodeIcon, SunIcon, MoonIcon } from './components/Icons';
import { IOSInstallPrompt } from './components/IOSInstallPrompt';

// Version de l'application
const APP_VERSION = "1.0.4";

// Helper for ID generation that works in all contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock User Interface
interface User {
  name: string;
  email: string;
  photoURL?: string;
}

const App: React.FC = () => {
  // State
  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('toulouse_cupping_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
    return {
      id: generateId(),
      createdAt: Date.now(),
      name: 'Nouvelle Session',
      coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
    };
  });

  const [activeCoffeeIndex, setActiveCoffeeIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('toulouse_cupping_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Android Shortcut Actions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new_session') {
      if (window.confirm("Raccourci détecté : Démarrer une nouvelle session ?")) {
         const newSession = {
            id: generateId(),
            createdAt: Date.now(),
            name: 'Nouvelle Session',
            coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
          };
          setSession(newSession);
          setActiveCoffeeIndex(0);
          setShowSummary(false);
          window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('toulouse_cupping_session', JSON.stringify(session));
  }, [session]);

  // Auth Handlers
  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const newUser = {
        name: "Cupping Expert",
        email: "expert@toulouse-cupping.fr",
        photoURL: "https://ui-avatars.com/api/?name=Cupping+Expert&background=8D6E4D&color=fff"
      };
      setUser(newUser);
      localStorage.setItem('toulouse_cupping_user', JSON.stringify(newUser));
      setIsLoggingIn(false);
      setShowMenu(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('toulouse_cupping_user');
    setShowMenu(false);
  };

  const handleCloudSave = () => {
    if (!user) {
      alert("Veuillez vous connecter pour sauvegarder dans le cloud.");
      return;
    }
    const btn = document.getElementById('cloud-save-btn');
    if(btn) btn.innerText = "Sauvegarde...";
    setTimeout(() => {
      alert(`Session synchronisée dans le cloud pour ${user.email} !`);
      if(btn) btn.innerText = "☁️ Sauvegarder (Cloud)";
    }, 1000);
  };

  const handleForceUpdate = () => {
    if (confirm("Voulez-vous recharger l'application pour obtenir la dernière version ?")) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister();
                }
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    }
  };

  // Session Handlers
  const addCoffee = () => {
    const newCoffee = { 
      ...DEFAULT_COFFEE, 
      id: generateId(), 
      name: `Café ${session.coffees.length + 1}` 
    };
    setSession(prev => ({
      ...prev,
      coffees: [...prev.coffees, newCoffee]
    }));
    setActiveCoffeeIndex(session.coffees.length);
  };

  const updateCoffee = (updatedCoffee: CoffeeEntry) => {
    setSession(prev => ({
      ...prev,
      coffees: prev.coffees.map(c => c.id === updatedCoffee.id ? updatedCoffee : c)
    }));
  };

  const deleteCoffee = (id: string) => {
    if (session.coffees.length <= 1) return;
    const newCoffees = session.coffees.filter(c => c.id !== id);
    setSession(prev => ({ ...prev, coffees: newCoffees }));
    if (activeCoffeeIndex >= newCoffees.length) {
      setActiveCoffeeIndex(newCoffees.length - 1);
    }
  };

  const resetSession = () => {
    if (window.confirm("Voulez-vous vraiment commencer une nouvelle session ? Les données actuelles seront perdues.")) {
      setSession({
        id: generateId(),
        createdAt: Date.now(),
        name: 'Nouvelle Session',
        coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
      });
      setActiveCoffeeIndex(0);
      setShowSummary(false);
      setShowMenu(false);
    }
  };

  const InviteModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowInviteModal(false)}>
      <div className="bg-surface dark:bg-surface-container-dark p-6 rounded-2xl shadow-elevation-3 max-w-sm w-full text-center relative" onClick={e => e.stopPropagation()}>
         <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
         
         <h3 className="text-headline-small font-bold text-primary dark:text-primary-dark mb-4">Inviter un participant</h3>
         <p className="text-body-medium text-on-surface-variant dark:text-on-surface-variant-dark mb-6">Flashez ce code pour ouvrir l'application sur un autre appareil.</p>
         
         <div className="bg-white p-4 rounded-xl inline-block shadow-sm mb-4">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&color=4D2900&bgcolor=FFFFFF`} 
              alt="QR Code" 
              className="w-48 h-48"
            />
         </div>
         
         <p className="text-label-small text-gray-400">Lien: {window.location.host}</p>
         <Button variant="tonal" className="w-full mt-6" onClick={() => setShowInviteModal(false)}>Fermer</Button>
      </div>
    </div>
  );

  if (showSummary) {
    return <SummaryTable coffees={session.coffees} onBack={() => setShowSummary(false)} />;
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans text-on-surface dark:text-on-surface-dark transition-colors duration-300">
      <IOSInstallPrompt />
      
      {showInviteModal && <InviteModal />}

      {/* Top App Bar - M3 Small Top App Bar */}
      <header className="sticky top-0 z-40 bg-surface dark:bg-surface-container-dark text-on-surface dark:text-on-surface-dark px-4 py-2 flex justify-between items-center select-none pt-safe transition-colors no-print">
        <div className="flex items-center gap-3">
          <AppLogo className="w-8 h-8" />
          <h1 className="text-title-medium font-medium tracking-tight">Toulouse Cupping</h1>
        </div>
        
        <div className="flex items-center gap-1">
           {/* Dark Mode Toggle */}
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)} 
             className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-white/10 text-on-surface dark:text-on-surface-dark transition-transform active:rotate-12"
             title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
           >
             {isDarkMode ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
           </button>

           <div className="hidden md:block">
             {!user ? (
               <GoogleSignInButton onClick={handleGoogleLogin} isLoading={isLoggingIn} />
             ) : (
                <div className="flex items-center gap-2 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container">
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  <span className="text-label-medium font-medium">{user.name}</span>
                </div>
             )}
           </div>

           <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
           </button>
        </div>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-4 mt-2 w-72 bg-surface-container-high dark:bg-surface-container-high-dark rounded-xl shadow-elevation-2 py-2 z-50 text-on-surface dark:text-on-surface-dark animate-fadeIn origin-top-right ring-1 ring-black/5">
             <div className="md:hidden px-4 py-3 border-b border-outline/10 mb-2">
                {!user ? (
                   <div className="flex justify-center">
                      <GoogleSignInButton onClick={handleGoogleLogin} isLoading={isLoggingIn} />
                   </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                       <span className="font-bold text-label-large">{user.name}</span>
                       <span className="text-label-small opacity-70">{user.email}</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="px-2">
               <button onClick={() => { setShowInviteModal(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors text-label-large">
                  <QrCodeIcon className="w-5 h-5" /> Inviter / QR Code
               </button>
               <button onClick={() => { setShowSummary(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors text-label-large">
                 <span>📊</span> Tableau récapitulatif
               </button>
               {user && (
                 <button id="cloud-save-btn" onClick={handleCloudSave} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors text-label-large">
                   <span>☁️</span> Sauvegarder (Cloud)
                 </button>
               )}
             </div>
             
             <div className="h-px bg-outline/10 my-2 mx-4"></div>
             
             <div className="px-2">
                <button onClick={handleForceUpdate} className="w-full text-left flex items-center gap-3 px-4 py-3 text-primary dark:text-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/5 rounded-lg transition-colors text-label-large">
                   <span>🔄</span> Mise à jour (v{APP_VERSION})
                </button>
                {user && (
                   <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                     <span>🚪</span> Déconnexion
                   </button>
                )}
                <button onClick={resetSession} className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-label-large">
                  <span>❌</span> Nouvelle session
                </button>
             </div>
          </div>
        )}
      </header>

      {/* Navigation Bar / Tabs - M3 Secondary Navigation */}
      <div className="sticky top-[env(safe-area-inset-top,_0px)] mt-[0px] z-30 bg-surface dark:bg-surface-dark border-b border-outline/10 no-print">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-3">
          {session.coffees.map((coffee, idx) => (
            <button
              key={coffee.id}
              onClick={() => setActiveCoffeeIndex(idx)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-label-large font-medium transition-all duration-300 flex items-center gap-1
                ${activeCoffeeIndex === idx
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                  : 'text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-surface-variant/50 dark:hover:bg-white/5'
                }
              `}
            >
              {coffee.isFavorite && <span className="text-red-500">♥</span>}
              {coffee.name} 
              {coffee.isLocked && '🔒'}
            </button>
          ))}
          <button 
             onClick={addCoffee}
             className="px-4 py-1.5 rounded-full border border-outline text-primary dark:text-primary-dark font-medium hover:bg-primary/5 transition-colors text-label-large"
          >
            + Nouveau
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto p-4 md:p-6 pb-28">
        {session.coffees[activeCoffeeIndex] && (
          <CoffeeForm 
            coffee={session.coffees[activeCoffeeIndex]}
            onUpdate={updateCoffee}
            onDelete={session.coffees.length > 1 ? () => deleteCoffee(session.coffees[activeCoffeeIndex].id) : undefined}
          />
        )}
        
        {/* End Session Button */}
        <div className="mt-8 flex flex-col items-center gap-4 text-center no-print">
            <Button variant="tonal" onClick={() => setShowSummary(true)} className="w-full md:w-auto h-12 text-title-medium">
                Voir le Tableau Récapitulatif 🏁
            </Button>
        </div>
      </main>
    </div>
  );
};

export default App;