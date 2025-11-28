export interface AromaCategory {
  id: string;
  name: string;
  color: string; // Hex code for tag background
  items: string[];
}

export type RoastLevelType = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export interface CoffeeEntry {
  id: string;
  name: string;
  isLocked: boolean;
  timestamp: number;
  
  // A. Roast
  roastLevel: RoastLevelType;
  
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
  acidityType: 'Citrique' | 'Malique' | 'Tartrique' | 'Phosphorique' | 'Acétique' | '';
  acidityIntensity: 'Faible' | 'Moyenne' | 'Forte' | '';
  
  // F. Body
  bodyScore: number;
  bodyType: 'Aqueux' | 'Léger' | 'Moyen' | 'Rond' | 'Crémeux' | 'Sirupeux' | 'Velouté' | 'Charnu' | '';
  
  // G. Balance
  balanceScore: number;
  
  // I. Comments
  comments: string;
}

export interface Session {
  id: string;
  createdAt: number;
  name: string;
  coffees: CoffeeEntry[];
}