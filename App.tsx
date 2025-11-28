import React, { useState, useEffect } from 'react';
import { CoffeeEntry, Session } from './types';
import { DEFAULT_COFFEE } from './constants';
import CoffeeForm from './components/CoffeeForm';
import SummaryTable from './components/SummaryTable';
import { Button, GoogleSignInButton } from './components/UI';
import { AppLogo } from './components/Icons';

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
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      name: 'Nouvelle Session',
      coffees: [{ ...DEFAULT_COFFEE, id: crypto.randomUUID() }]
    };
  });

  const [activeCoffeeIndex, setActiveCoffeeIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('toulouse_cupping_session', JSON.stringify(session));
  }, [session]);

  // Auth Handlers (Simulation)
  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate API delay
    setTimeout(() => {
      setUser({
        name: "Cupping Expert",
        email: "expert@toulouse-cupping.fr",
        photoURL: "https://ui-avatars.com/api/?name=Cupping+Expert&background=8D6E4D&color=fff"
      });
      setIsLoggingIn(false);
      setShowMenu(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setShowMenu(false);
  };

  const handleCloudSave = () => {
    if (!user) {
      alert("Veuillez vous connecter pour sauvegarder dans le cloud.");
      return;
    }
    // Simulate Cloud Save
    const btn = document.getElementById('cloud-save-btn');
    if(btn) btn.innerText = "Sauvegarde...";
    setTimeout(() => {
      alert(`Session sauvegardée dans le cloud pour ${user.email} !`);
      if(btn) btn.innerText = "☁️ Sauvegarder (Cloud)";
    }, 1000);
  };

  // Session Handlers
  const addCoffee = () => {
    const newCoffee = { 
      ...DEFAULT_COFFEE, 
      id: crypto.randomUUID(), 
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
    if (window.confirm("Voulez-vous vraiment commencer une nouvelle session ? Les données actuelles seront perdues si non exportées.")) {
      setSession({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        name: 'Nouvelle Session',
        coffees: [{ ...DEFAULT_COFFEE, id: crypto.randomUUID() }]
      });
      setActiveCoffeeIndex(0);
      setShowSummary(false);
      setShowMenu(false);
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `toulouse_cupping_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
             const parsed = JSON.parse(event.target.result as string);
             setSession(parsed);
             setActiveCoffeeIndex(0);
             setShowSummary(false);
             setShowMenu(false);
          }
        } catch (error) {
          alert("Fichier invalide");
        }
      };
    }
  };

  // View Logic
  if (showSummary) {
    return <SummaryTable coffees={session.coffees} onBack={() => setShowSummary(false)} />;
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-gray-800">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-primary text-on-primary shadow-md px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AppLogo className="w-9 h-9" />
          <h1 className="hidden md:block text-xl font-bold tracking-tight">Toulouse Cupping App</h1>
          <h1 className="md:hidden text-lg font-bold tracking-tight">Toulouse Cupping</h1>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Desktop Auth */}
           <div className="hidden md:block">
             {!user ? (
               <GoogleSignInButton onClick={handleGoogleLogin} isLoading={isLoggingIn} />
             ) : (
                <div className="flex items-center gap-2 bg-primary-container/10 px-3 py-1 rounded-full border border-white/20">
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
             )}
           </div>

           <button onClick={() => setShowMenu(!showMenu)} className="text-2xl focus:outline-none p-1 ml-2">
            ☰
           </button>
        </div>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-2 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-gray-800 animate-fadeIn">
             {/* Mobile Auth in Menu */}
             <div className="md:hidden px-4 py-2 border-b border-gray-100 mb-2">
                {!user ? (
                   <div className="flex justify-center">
                      <GoogleSignInButton onClick={handleGoogleLogin} isLoading={isLoggingIn} />
                   </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                       <span className="font-bold text-sm">{user.name}</span>
                       <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="px-4 py-2">
               <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Session</p>
               <button onClick={() => { setShowSummary(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-2 py-2 hover:text-primary transition-colors">
                 📊 Tableau récapitulatif
               </button>
               {user && (
                 <button id="cloud-save-btn" onClick={handleCloudSave} className="w-full text-left flex items-center gap-2 py-2 hover:text-primary transition-colors">
                   ☁️ Sauvegarder (Cloud)
                 </button>
               )}
             </div>
             
             <div className="h-px bg-gray-200 my-1"></div>
             
             <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Données</p>
                <button onClick={exportJSON} className="w-full text-left flex items-center gap-2 py-2 hover:text-primary transition-colors">
                  💾 Exporter local (JSON)
                </button>
                <label className="w-full text-left flex items-center gap-2 py-2 hover:text-primary transition-colors cursor-pointer">
                  📂 Importer local (JSON)
                  <input type="file" className="hidden" accept=".json" onChange={importJSON} />
                </label>
             </div>

             <div className="h-px bg-gray-200 my-1"></div>

             <div className="px-4 py-2">
                {user && (
                   <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                     🚪 Déconnexion
                   </button>
                )}
                <button onClick={resetSession} className="w-full text-left flex items-center gap-2 py-2 text-red-600 hover:bg-red-50 transition-colors rounded">
                  ❌ Nouvelle session
                </button>
             </div>
          </div>
        )}
      </header>

      {/* Coffee Tabs Carousel */}
      <div className="bg-surface-variant sticky top-[56px] z-30 shadow-sm border-b border-outline/20">
        <div className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-2">
          {session.coffees.map((coffee, idx) => (
            <button
              key={coffee.id}
              onClick={() => setActiveCoffeeIndex(idx)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCoffeeIndex === idx
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-transparent hover:border-primary/30'
              }`}
            >
              {coffee.name} {coffee.isLocked && '🔒'}
            </button>
          ))}
          <button 
             onClick={addCoffee}
             className="px-3 py-2 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
        {session.coffees[activeCoffeeIndex] && (
          <CoffeeForm 
            coffee={session.coffees[activeCoffeeIndex]}
            onUpdate={updateCoffee}
            onDelete={session.coffees.length > 1 ? () => deleteCoffee(session.coffees[activeCoffeeIndex].id) : undefined}
          />
        )}
        
        {/* End Session Button */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col items-center gap-4 text-center">
            <h3 className="text-lg font-medium text-gray-600">Session terminée ?</h3>
            <Button variant="secondary" onClick={() => setShowSummary(true)} className="w-full md:w-auto px-8 py-3 text-lg shadow-lg">
                Voir le Tableau Récapitulatif 🏁
            </Button>
        </div>
      </main>

    </div>
  );
};

export default App;