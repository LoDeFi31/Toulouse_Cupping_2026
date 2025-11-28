import { AromaCategory, RoastLevelType, CoffeeEntry } from './types';

export const AROMA_CATEGORIES: AromaCategory[] = [
  {
    id: 'fruity',
    name: 'Fruité',
    color: '#D95858', // Reddish
    items: ['Citron', 'Orange', 'Pamplemousse', 'Cerise', 'Fraise', 'Framboise', 'Myrtille', 'Raisin', 'Ananas', 'Mangue', 'Passion', 'Pêche', 'Pomme verte', 'Poire']
  },
  {
    id: 'floral',
    name: 'Floral',
    color: '#E05297', // Pinkish
    items: ['Jasmin', 'Rose', "Fleur d'oranger", 'Lavande', 'Hibiscus', 'Violette', 'Camomille']
  },
  {
    id: 'spicy',
    name: 'Épicé',
    color: '#B85C38', // Brown/Rust
    items: ['Cannelle', 'Clou de girofle', 'Muscade', 'Poivre', 'Cardamome', 'Gingembre']
  },
  {
    id: 'nutty',
    name: 'Chocolat / Noix',
    color: '#6D4C41', // Dark Brown
    items: ['Chocolat noir', 'Chocolat au lait', 'Cacao', 'Noisette', 'Amande', 'Noix', 'Cacahuète']
  },
  {
    id: 'sweet',
    name: 'Caramélisé',
    color: '#D4883B', // Orange/Caramel
    items: ['Caramel', 'Miel', 'Cassonade', "Sirop d'érable", 'Mélasse']
  },
  {
    id: 'cereal',
    name: 'Céréales / Pain',
    color: '#E3C16F', // Yellow/Beige
    items: ['Pain grillé', 'Biscuit', 'Céréales', 'Malt', 'Noisette grillée']
  }
];

// Specific color overrides for items that need to look distinct
export const ITEM_COLOR_OVERRIDES: Record<string, string> = {
  // Chocolat / Noix
  'Chocolat noir': '#3E2723', // Very Dark Brown
  'Cacao': '#212121', // Almost Black
  'Chocolat au lait': '#795548', // Brown
  'Noisette': '#8D6E63',
  'Amande': '#D7CCC8',
  'Cacahuète': '#FFECB3',

  // Fruité
  'Citron': '#FFEB3B', // Yellow
  'Orange': '#FF9800', // Orange
  'Pomme verte': '#AED581', // Light Green
  'Cerise': '#C62828', // Deep Red
  'Myrtille': '#4A148C', // Purple
  
  // Floral
  'Rose': '#F48FB1',
  'Lavande': '#9575CD',
  
  // Sweet
  'Miel': '#FFC107', // Amber
  'Caramel': '#BF360C', // Burnt Orange
  
  // Cereal
  'Pain grillé': '#5D4037',
  'Biscuit': '#FFE0B2',
};

export const ROAST_LEVELS: { id: RoastLevelType; label: string; color: string }[] = [
  { id: 'light', label: 'Light', color: '#C89F78' },
  { id: 'medium-light', label: 'Med-Light', color: '#A67B5B' },
  { id: 'medium', label: 'Medium', color: '#8D6E4D' },
  { id: 'medium-dark', label: 'Med-Dark', color: '#6F4E37' },
  { id: 'dark', label: 'Dark', color: '#4A3428' },
];

export const ACIDITY_TYPES = ['Citrique', 'Malique', 'Tartrique', 'Phosphorique', 'Acétique'];
export const ACIDITY_INTENSITIES = ['Faible', 'Moyenne', 'Forte'];

export const BODY_TYPES = ['Aqueux', 'Léger', 'Moyen', 'Rond', 'Crémeux', 'Sirupeux', 'Velouté', 'Charnu'];

export const DEFAULT_COFFEE: CoffeeEntry = {
  id: '',
  name: 'Nouveau Café',
  isLocked: false,
  timestamp: Date.now(),
  roastLevel: 'medium',
  fragranceScore: 7.5,
  fragranceNotes: [],
  flavorScore: 7.5,
  flavorNotes: [],
  aftertasteScore: 7.5,
  acidityScore: 7.5,
  acidityType: '',
  acidityIntensity: '',
  bodyScore: 7.5,
  bodyType: '',
  balanceScore: 7.5,
  comments: '',
};