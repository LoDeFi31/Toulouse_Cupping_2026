
export interface AromaCategory {
  id: string;
  name: string;
  color: string; // Hex code for tag background
  items: string[];
}

export type RoastLevelType = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export type Language = 'fr' | 'en' | 'es';

export interface CoffeeEntry {
  id: string;
  name: string;
  isLocked: boolean;
  isFavorite: boolean;
  timestamp: number;
  
  // Process
  process: string;
  
  // B. Fragrance / Aroma
  fragranceScore: number;
  fragranceNotes: string[];
  
  // C. Flavor
  flavorScore: number;
  flavorNotes: string[];
  
  // D. Aftertaste
  aftertasteScore: number;

  // E. Acidity
  acidityScore: number;
  acidityType: string;
  acidityIntensity: string;

  // F. Body
  bodyScore: number;
  bodyType: string;

  // G. Balance
  balanceScore: number;

  // I. Comments
  comments: string;
}

export interface Session {
  id: string;
  createdAt: number;
  name: string;
  location: string;
  dateString: string;
  
  // Session Notes
  originNotes?: string;
  roasterNotes?: string;
  importerNotes?: string;

  coffees: CoffeeEntry[];
}

// --- BREWING TYPES ---

export type BrewMethodType = 'v60' | 'chemex' | 'aeropress' | 'french_press' | 'moka' | 'origami' | 'kalita';

export interface BrewRecipe {
  id: string;
  timestamp: number;
  method: BrewMethodType;
  coffeeWeight: number; // grams
  ratio: number; // 1:x
  waterWeight: number; // calculated
  grindSize?: string; // e.g. "Moyen-Fin"
  totalTime: number; // seconds
  waterTemp?: number; // celsius
  notes: string;
  rating?: number; // 1-5 stars maybe? kept simple for now
}
