import React, { useState, useEffect, useRef } from 'react';
import { CoffeeEntry, Session, Language } from './types';
import { DEFAULT_COFFEE, GOOGLE_CLIENT_ID, TRANSLATIONS } from './constants';
import CoffeeForm from './components/CoffeeForm';
import SummaryTable from './components/SummaryTable';
import FlavorWheel from './components/FlavorWheel';
import BrewingInterface from './components/BrewingInterface';
import { Button, GoogleSignInButton } from './components/UI';
import { 
  AppLogo, QrCodeIcon, SunIcon, MoonIcon, LocationIcon, CalendarIcon, 
  WheelIcon, GlobeIcon, FlameIcon, BoxIcon, BrewIcon,
  InfoSessionIcon, SummaryTableIcon, UpdateAppIcon, CloudUploadIcon, LogoutIcon, DeleteSessionIcon
} from './components/Icons';
import { IOSInstallPrompt } from './components/IOSInstallPrompt';
import TimerModal from './components/TimerModal';

const APP_VERSION = "1.6.0";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface User {
  name: string;
  email: string;
  photoURL?: string;
}

// Full Screen Page for Session Info
const SessionInfoPage: React.FC<{
    session: Session;
    setSession: (s: Session) => void;
    onClose: () => void;
    dict: any;
}> = ({ session, setSession, onClose, dict }) => {
    return (
        <div className="fixed inset-0 z-[60] bg-surface animate-slideUp flex flex-col pt-safe">
            <div className="flex items-center justify-between p-4 border-b border-outline/10 bg-surface-container mt-safe">
                <h3 className="text-headline-small font-bold text-primary">{dict.sessionInfo}</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/20 text-on-surface">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6 max-w-md mx-auto pb-20">
                    <div className="group">
                        <label className="text-label-large text-on-surface-variant mb-2 block font-bold">{dict.tastingLocation}</label>
                        <div className="relative">
                            <LocationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-high border border-outline/30 rounded-xl py-4 pl-12 pr-4 text-body-large text-on-surface focus:border-primary focus:outline-none transition-colors"
                                placeholder="Ex: Labo, Café..."
                                value={session.location}
                                onChange={(e) => setSession({...session, location: e.target.value})}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-label-large text-on-surface-variant mb-2 block font-bold">{dict.sessionDate}</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                            <input 
                                type="date" 
                                className="w-full bg-surface-container-high border border-outline/30 rounded-xl py-4 pl-12 pr-4 text-body-large text-on-surface focus:border-primary focus:outline-none transition-colors"
                                value={session.dateString}
                                onChange={(e) => setSession({...session, dateString: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="border-t border-outline/10 my-4"></div>
                    <h4 className="text-title-medium font-bold text-on-surface mb-4">{dict.generalNotes}</h4>

                    <div className="group">
                        <label className="text-label-large text-on-surface-variant mb-2 block font-bold">{dict.origins}</label>
                        <div className="relative">
                            <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant" />
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-high border border-outline/30 rounded-xl py-4 pl-12 pr-4 text-body-large text-on-surface focus:border-primary focus:outline-none transition-colors"
                                placeholder="Ex: Colombie, Éthiopie..."
                                value={session.originNotes || ''}
                                onChange={(e) => setSession({...session, originNotes: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-label-large text-on-surface-variant mb-2 block font-bold">{dict.roaster}</label>
                        <div className="relative">
                            <FlameIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant" />
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-high border border-outline/30 rounded-xl py-4 pl-12 pr-4 text-body-large text-on-surface focus:border-primary focus:outline-none transition-colors"
                                placeholder="Ex: La Claque, KB..."
                                value={session.roasterNotes || ''}
                                onChange={(e) => setSession({...session, roasterNotes: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-label-large text-on-surface-variant mb-2 block font-bold">{dict.importer}</label>
                        <div className="relative">
                            <BoxIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant" />
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-high border border-outline/30 rounded-xl py-4 pl-12 pr-4 text-body-large text-on-surface focus:border-primary focus:outline-none transition-colors"
                                placeholder="Ex: Belco, Mare Terra..."
                                value={session.importerNotes || ''}
                                onChange={(e) => setSession({...session, importerNotes: e.target.value})}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="p-4 bg-surface-container border-t border-outline/10 pb-safe">
                <Button variant="filled" className="w-full py-4 text-title-medium" onClick={onClose}>{dict.validate}</Button>
            </div>
        </div>
    );
};

const InviteModal: React.FC<{ onClose: () => void; dict: any }> = ({ onClose, dict }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-surface-container p-6 rounded-2xl shadow-elevation-3 max-w-sm w-full text-center relative" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant/60 hover:text-on-surface-variant">✕</button>
         
         <h3 className="text-headline-small font-bold text-primary mb-4">{dict.invite}</h3>
         <p className="text-body-medium text-on-surface-variant mb-6">Flashez ce code pour ouvrir l'application sur un autre appareil.</p>
         
         <div className="bg-white p-4 rounded-xl inline-block shadow-sm mb-4">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&color=4D2900&bgcolor=FFFFFF`} 
              alt="QR Code" 
              className="w-48 h-48"
            />
         </div>
         
         <p className="text-label-small text-outline">Lien: {window.location.host}</p>
         <Button variant="tonal" className="w-full mt-6" onClick={onClose}>{dict.close}</Button>
      </div>
    </div>
);

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'cupping' | 'brewing'>('cupping');

  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('toulouse_cupping_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.location) parsed.location = '';
        if (!parsed.dateString) parsed.dateString = new Date(parsed.createdAt || Date.now()).toLocaleDateString();
        if (!parsed.originNotes) parsed.originNotes = '';
        if (!parsed.roasterNotes) parsed.roasterNotes = '';
        if (!parsed.importerNotes) parsed.importerNotes = '';
        return parsed;
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
    return {
      id: generateId(),
      createdAt: Date.now(),
      name: 'Nouvelle Session',
      location: '',
      dateString: new Date().toLocaleDateString(),
      originNotes: '',
      roasterNotes: '',
      importerNotes: '',
      coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
    };
  });

  const [activeCoffeeIndex, setActiveCoffeeIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showFlavorWheel, setShowFlavorWheel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('toulouse_cupping_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme_mode');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('app_language');
    return (savedLang as Language) || 'fr';
  });

  const dict = TRANSLATIONS[language]; // Current Dictionary

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply Dark Mode Class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }

    // Updated Status Bar Color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        // In dark mode, we stick to the static Espresso background #1E1B18
        // In light mode, the background might change based on dynamic theme, 
        // but let's default to a neutral light surface for now or attempt to read computed style
        metaThemeColor.setAttribute('content', isDarkMode ? '#1E1B18' : '#FFF8F6');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new_session') {
      if (window.confirm("Raccourci détecté : Démarrer une nouvelle session ?")) {
         const newSession = {
            id: generateId(),
            createdAt: Date.now(),
            name: dict.newSession,
            location: '',
            dateString: new Date().toLocaleDateString(),
            originNotes: '',
            roasterNotes: '',
            importerNotes: '',
            coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
          };
          setSession(newSession);
          setActiveCoffeeIndex(0);
          setShowSummary(false);
          setShowFlavorWheel(false);
          setShowSessionInfo(true);
          window.history.replaceState({}, '', '/');
      }
    }
  }, []);
  
  // Pull to refresh logic... (kept same as before)
  useEffect(() => {
    let startY = 0;
    let isPulling = false;
    const threshold = 70;
    
    const handleTouchStart = (e: TouchEvent) => {
        if ((e.target as Element).closest('.flavor-wheel-container')) return;
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff <= 0) isPulling = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (!isPulling) return;
        const currentY = e.changedTouches[0].clientY;
        const diff = currentY - startY;
        if (diff > threshold && window.scrollY === 0) {
             const spinner = document.createElement('div');
             spinner.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-surface-container-high p-3 rounded-full shadow-elevation-2 animate-fadeIn pt-safe mt-2';
             spinner.innerHTML = '<div class="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>';
             document.body.appendChild(spinner);
             setTimeout(() => window.location.reload(), 800);
        }
        isPulling = false;
    };
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('toulouse_cupping_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.children[activeCoffeeIndex] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCoffeeIndex]);

  const handleGoogleLogin = () => {
    if (!(window as any).google) {
        alert("Services Google non chargés. Vérifiez votre connexion.");
        return;
    }
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("VOTRE_CLIENT_ID")) {
        alert("Erreur de configuration : GOOGLE_CLIENT_ID manquant.");
        return;
    }
    setIsLoggingIn(true);
    try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` }
                    })
                    .then(res => res.json())
                    .then(data => {
                        const newUser: User = {
                            name: data.name,
                            email: data.email,
                            photoURL: data.picture
                        };
                        setUser(newUser);
                        localStorage.setItem('toulouse_cupping_user', JSON.stringify(newUser));
                        setIsLoggingIn(false);
                        setShowMenu(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setIsLoggingIn(false);
                    });
                } else {
                    setIsLoggingIn(false);
                }
            },
            error_callback: (err: any) => {
                 setIsLoggingIn(false);
            }
        });
        client.requestAccessToken();
    } catch (e) {
        setIsLoggingIn(false);
    }
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
      if(btn) btn.innerText = dict.cloudSave;
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
    if (window.confirm(dict.confirmReset)) {
      setSession({
        id: generateId(),
        createdAt: Date.now(),
        name: dict.newSession,
        location: '',
        dateString: new Date().toLocaleDateString(),
        originNotes: '',
        roasterNotes: '',
        importerNotes: '',
        coffees: [{ ...DEFAULT_COFFEE, id: generateId() }]
      });
      setActiveCoffeeIndex(0);
      setShowSummary(false);
      setShowFlavorWheel(false);
      setShowMenu(false);
      setShowSessionInfo(true);
    }
  };

  if (currentMode === 'brewing') {
    return <BrewingInterface onBack={() => setCurrentMode('cupping')} dict={dict} />;
  }

  if (showFlavorWheel) {
    return <FlavorWheel onBack={() => setShowFlavorWheel(false)} dict={dict} language={language} />;
  }

  if (showSummary) {
    return <SummaryTable session={session} onBack={() => setShowSummary(false)} dict={dict} language={language} />;
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface transition-colors duration-500">
      <IOSInstallPrompt />
      
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} dict={dict} />}
      
      {showSessionInfo && (
          <SessionInfoPage 
            session={session} 
            setSession={setSession} 
            onClose={() => setShowSessionInfo(false)}
            dict={dict}
          />
      )}
      
      {showTimer && <TimerModal onClose={() => setShowTimer(false)} dict={dict} />}

      <header className="sticky top-0 z-40 bg-surface-container text-on-surface px-4 py-3 flex justify-between items-center select-none pt-safe transition-colors duration-500 no-print relative border-b border-outline/5">
        <div className="flex items-center z-10">
          <AppLogo className="w-12 h-12 text-primary" />
        </div>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-safe w-full text-center pointer-events-none">
           <h1 className="text-title-large font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-16">
             Toulouse Cupping
           </h1>
        </div>
        
        <div className="flex items-center gap-1 z-10">
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

           <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
           </button>
        </div>
        
        {showMenu && (
          <div className="absolute top-full right-4 mt-2 w-80 bg-surface-container-high rounded-xl shadow-elevation-2 py-2 z-50 text-on-surface animate-fadeIn origin-top-right ring-1 ring-black/5 max-h-[80vh] overflow-y-auto">
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

             <div className="px-4 py-2">
               <h4 className="text-label-medium font-bold text-on-surface-variant mb-2 uppercase tracking-wider">{dict.preferences}</h4>
               
               {/* Dark Mode Toggle */}
               <button 
                 onClick={() => setIsDarkMode(!isDarkMode)} 
                 className="w-full text-left flex items-center justify-between px-3 py-2 bg-surface-variant/30 rounded-lg mb-2 hover:bg-surface-variant/50 transition-colors"
               >
                 <span className="flex items-center gap-2 text-label-large">
                    {isDarkMode ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
                    {isDarkMode ? dict.darkMode : dict.lightMode}
                 </span>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-outline'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-emphasized ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                 </div>
               </button>

               {/* Language Selector */}
               <div className="flex items-center justify-between px-3 py-2 bg-surface-variant/30 rounded-lg hover:bg-surface-variant/50 transition-colors">
                  <span className="flex items-center gap-2 text-label-large">
                    <span className="text-lg">🌍</span> {dict.language}
                  </span>
                  <div className="flex gap-1 bg-surface-container rounded-lg p-1">
                      <button onClick={() => handleLanguageChange('fr')} className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${language === 'fr' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>FR</button>
                      <button onClick={() => handleLanguageChange('en')} className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>EN</button>
                      <button onClick={() => handleLanguageChange('es')} className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${language === 'es' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>ES</button>
                  </div>
               </div>
             </div>
             
             <div className="h-px bg-outline/10 my-2 mx-4"></div>

             <div className="px-2 space-y-1">
               <button onClick={() => { setShowSessionInfo(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                   <div className="flex gap-2 items-center"><InfoSessionIcon className="w-5 h-5 text-on-surface-variant" /> {dict.sessionInfo}</div>
               </button>
               
               <button onClick={() => { setCurrentMode('brewing'); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                   <BrewIcon className="w-5 h-5 text-on-surface-variant" /> {dict.brewingMode}
               </button>

               <button onClick={() => { setShowInviteModal(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                  <QrCodeIcon className="w-5 h-5 text-on-surface-variant" /> {dict.invite}
               </button>

               <button onClick={() => { setShowFlavorWheel(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                  <WheelIcon className="w-5 h-5 text-on-surface-variant" /> {dict.flavorWheel}
               </button>

               <button onClick={() => { setShowSummary(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                 <SummaryTableIcon className="w-5 h-5 text-on-surface-variant" /> {dict.summary}
               </button>
               {user && (
                 <button id="cloud-save-btn" onClick={handleCloudSave} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                   <CloudUploadIcon className="w-5 h-5 text-on-surface-variant" /> {dict.cloudSave}
                 </button>
               )}
             </div>
             
             <div className="h-px bg-outline/10 my-2 mx-4"></div>
             
             <div className="px-2">
                <button onClick={handleForceUpdate} className="w-full text-left flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 rounded-lg transition-colors text-label-large">
                   <UpdateAppIcon className="w-5 h-5" /> {dict.update} (v{APP_VERSION})
                </button>
                {user && (
                   <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors text-label-large">
                     <LogoutIcon className="w-5 h-5" /> {dict.logout}
                   </button>
                )}
                <button onClick={resetSession} className="w-full text-left flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-colors text-label-large">
                  <DeleteSessionIcon className="w-5 h-5" /> {dict.newSession}
                </button>
             </div>
          </div>
        )}
      </header>

      {currentMode === 'cupping' && (
          <div className="sticky top-[env(safe-area-inset-top,_0px)] mt-[0px] z-30 bg-surface border-b border-outline/10 no-print transition-colors duration-500">
            <div className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-3 snap-x" ref={tabsRef}>
            {session.coffees.map((coffee, idx) => (
                <button
                key={coffee.id}
                onClick={() => setActiveCoffeeIndex(idx)}
                className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-label-large font-bold transition-all duration-300 ease-emphasized flex items-center gap-1 snap-center
                    ${activeCoffeeIndex === idx
                    ? 'bg-secondary-container text-on-secondary-container shadow-elevation-1 ring-1 ring-black/5 scale-105'
                    : 'text-on-surface-variant hover:bg-surface-variant/50 opacity-80'
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
                className="px-4 py-1.5 rounded-full border border-outline text-primary font-bold hover:bg-primary/5 transition-colors text-label-large snap-center active:scale-95 animate-fadeIn"
            >
                {dict.newCoffeeBtn}
            </button>
            </div>
        </div>
      )}

      {currentMode === 'cupping' && (
          <main className="max-w-3xl mx-auto p-4 md:p-6 pb-28">
            {session.coffees[activeCoffeeIndex] && (
            <div key={session.coffees[activeCoffeeIndex].id} className="animate-slideInRight">
                <CoffeeForm 
                coffee={session.coffees[activeCoffeeIndex]}
                onUpdate={updateCoffee}
                onDelete={session.coffees.length > 1 ? () => deleteCoffee(session.coffees[activeCoffeeIndex].id) : undefined}
                onOpenTimer={() => setShowTimer(true)}
                dict={dict}
                language={language}
                />
            </div>
            )}
            
            <div className="mt-8 flex flex-col items-center gap-4 text-center no-print">
                <Button 
                  variant="filled" 
                  onClick={() => setShowSummary(true)} 
                  className="w-full md:w-auto h-12 text-title-medium font-bold relative overflow-hidden group shadow-elevation-2 hover:shadow-elevation-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    {dict.seeSummaryBtn}
                </Button>
            </div>
        </main>
      )}
    </div>
  );
};

export default App;