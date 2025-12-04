
import { AromaCategory, RoastLevelType, CoffeeEntry, Language } from './types';

// --- CONFIGURATION GOOGLE ---
export const GOOGLE_CLIENT_ID = '696310574132-77phpk6qec99smmhdfrsmnmgo8qbo7ac.apps.googleusercontent.com'; 

// --- TRANSLATIONS ---
export const TRANSLATIONS = {
  fr: {
    // Menu
    preferences: "Préférences",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    language: "Langue",
    sessionInfo: "Infos Session",
    brewingMode: "Mode Brewing",
    invite: "Inviter / QR Code",
    flavorWheel: "Roue des Saveurs",
    summary: "Tableau récapitulatif",
    cloudSave: "Sauvegarder (Cloud)",
    update: "Mise à jour",
    logout: "Déconnexion",
    newSession: "Nouvelle session",
    
    // App Main
    newCoffeeBtn: "+ Nouveau",
    seeSummaryBtn: "Voir le Tableau Récapitulatif 🏁",
    confirmReset: "Voulez-vous vraiment commencer une nouvelle session ? Les données actuelles seront perdues.",
    
    // Coffee Form
    coffeeNamePlaceholder: "Nom du café",
    validated: "Validé",
    deleteConfirm: "Supprimer ce café ?",
    fragrance: "Fragrance / Arôme",
    flavor: "Saveur",
    process: "Procédé / Process",
    aftertaste: "Arrière-goût",
    acidity: "Acidité",
    body: "Corps",
    balance: "Équilibre",
    comments: "Commentaires",
    notesOlfactory: "Notes olfactives",
    notesMouth: "Notes en bouche",
    commentsPlaceholder: "Observations, défauts, notes...",
    score: "Score",
    validate: "Valider",
    modify: "Modifier",
    resetNotes: "Réinitialiser notes",
    deleteCoffee: "Supprimer café",
    type: "TYPE",
    intensity: "INTENSITÉ",
    texture: "TEXTURE",

    // Timer
    timer: "Chronomètre",
    crust: "Croûte",
    taste: "Goût",
    running: "En cours",
    finished: "Terminé",
    pause: "Pause",
    resume: "Reprendre",
    reset: "Reset",

    // Brewing
    brewingLab: "Brewing Lab",
    back: "Retour",
    history: "Historique de recettes",
    closeHistory: "Fermer l'historique",
    recipe: "Recette",
    coffeeWeight: "Café (g)",
    ratio: "Ratio (1:?)",
    waterRequired: "Eau requise",
    grindSize: "Taille mouture (Optionnel)",
    grindPlaceholder: "Ex: Sel fin, Sucre...",
    cupResult: "Résultat en tasse",
    globalRating: "Note Globale",
    notesPlaceholder: "Profil sensoriel, ajustements...",
    save: "Enregistrer",
    saved: "Recette enregistrée !",
    noRecipes: "Aucune recette enregistrée.",
    confirmDeleteRecipe: "Supprimer cette recette ?",

    // Summary
    reportTitle: "Rapport de Dégustation",
    date: "Date",
    location: "Lieu",
    csv: "CSV",
    print: "Imprimer",
    pdf: "Télécharger PDF",
    fav: "Fav",
    
    // Session Info
    tastingLocation: "Lieu de dégustation",
    sessionDate: "Date de la session",
    generalNotes: "Notes Générales",
    origins: "Origine(s)",
    roaster: "Torréfacteur",
    importer: "Importateur / Sourcing",
    
    // Wheel
    close: "Fermer",
    category: "Catégorie",
    aroma: "Arôme"
  },
  en: {
    // Menu
    preferences: "Preferences",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    sessionInfo: "Session Info",
    brewingMode: "Brewing Mode",
    invite: "Invite / QR Code",
    flavorWheel: "Flavor Wheel",
    summary: "Summary Table",
    cloudSave: "Cloud Save",
    update: "Update",
    logout: "Logout",
    newSession: "New Session",
    
    // App Main
    newCoffeeBtn: "+ New",
    seeSummaryBtn: "View Summary Table 🏁",
    confirmReset: "Are you sure you want to start a new session? Current data will be lost.",

    // Coffee Form
    coffeeNamePlaceholder: "Coffee Name",
    validated: "Locked",
    deleteConfirm: "Delete this coffee?",
    fragrance: "Fragrance / Aroma",
    flavor: "Flavor",
    process: "Processing",
    aftertaste: "Aftertaste",
    acidity: "Acidity",
    body: "Body",
    balance: "Balance",
    comments: "Comments",
    notesOlfactory: "Olfactory notes",
    notesMouth: "Tasting notes",
    commentsPlaceholder: "Observations, defects, notes...",
    score: "Score",
    validate: "Validate",
    modify: "Modify",
    resetNotes: "Reset notes",
    deleteCoffee: "Delete coffee",
    type: "TYPE",
    intensity: "INTENSITY",
    texture: "TEXTURE",

    // Timer
    timer: "Timer",
    crust: "Break",
    taste: "Taste",
    running: "Running",
    finished: "Done",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",

    // Brewing
    brewingLab: "Brewing Lab",
    back: "Back",
    history: "Recipe History",
    closeHistory: "Close History",
    recipe: "Recipe",
    coffeeWeight: "Coffee (g)",
    ratio: "Ratio (1:?)",
    waterRequired: "Water Required",
    grindSize: "Grind Size (Optional)",
    grindPlaceholder: "Ex: Fine salt, Sugar...",
    cupResult: "Cup Result",
    globalRating: "Global Rating",
    notesPlaceholder: "Sensory profile, adjustments...",
    save: "Save",
    saved: "Recipe saved!",
    noRecipes: "No recipes saved.",
    confirmDeleteRecipe: "Delete this recipe?",

    // Summary
    reportTitle: "Cupping Report",
    date: "Date",
    location: "Location",
    csv: "CSV",
    print: "Print",
    pdf: "Download PDF",
    fav: "Fav",

    // Session Info
    tastingLocation: "Tasting Location",
    sessionDate: "Session Date",
    generalNotes: "General Notes",
    origins: "Origin(s)",
    roaster: "Roaster",
    importer: "Importer / Sourcing",
    
    // Wheel
    close: "Close",
    category: "Category",
    aroma: "Aroma"
  },
  es: {
    // Menu
    preferences: "Preferencias",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    language: "Idioma",
    sessionInfo: "Info. Sesión",
    brewingMode: "Modo Brewing",
    invite: "Invitar / Código QR",
    flavorWheel: "Rueda de Sabores",
    summary: "Tabla Resumen",
    cloudSave: "Guardar (Nube)",
    update: "Actualizar",
    logout: "Cerrar Sesión",
    newSession: "Nueva Sesión",
    
    // App Main
    newCoffeeBtn: "+ Nuevo",
    seeSummaryBtn: "Ver Tabla Resumen 🏁",
    confirmReset: "¿Estás seguro de que quieres empezar una nueva sesión? Se perderán los datos actuales.",

    // Coffee Form
    coffeeNamePlaceholder: "Nombre del café",
    validated: "Validado",
    deleteConfirm: "¿Eliminar este café?",
    fragrance: "Fragancia / Aroma",
    flavor: "Sabor",
    process: "Proceso",
    aftertaste: "Posgusto",
    acidity: "Acidez",
    body: "Cuerpo",
    balance: "Equilibrio",
    comments: "Comentarios",
    notesOlfactory: "Notas olfativas",
    notesMouth: "Notas de cata",
    commentsPlaceholder: "Observaciones, defectos, notas...",
    score: "Puntaje",
    validate: "Validar",
    modify: "Modificar",
    resetNotes: "Restablecer notas",
    deleteCoffee: "Eliminar café",
    type: "TIPO",
    intensity: "INTENSIDAD",
    texture: "TEXTURA",

    // Timer
    timer: "Cronómetro",
    crust: "Romper",
    taste: "Catar",
    running: "En marcha",
    finished: "Terminado",
    pause: "Pausa",
    resume: "Reanudar",
    reset: "Reiniciar",

    // Brewing
    brewingLab: "Laboratorio Brewing",
    back: "Volver",
    history: "Historial de recetas",
    closeHistory: "Cerrar historial",
    recipe: "Receta",
    coffeeWeight: "Café (g)",
    ratio: "Ratio (1:?)",
    waterRequired: "Agua requerida",
    grindSize: "Molienda (Opcional)",
    grindPlaceholder: "Ej: Sal fina, Azúcar...",
    cupResult: "Resultado en taza",
    globalRating: "Nota Global",
    notesPlaceholder: "Perfil sensorial, ajustes...",
    save: "Guardar",
    saved: "¡Receta guardada!",
    noRecipes: "No hay recetas guardadas.",
    confirmDeleteRecipe: "¿Eliminar esta receta?",

    // Summary
    reportTitle: "Informe de Catación",
    date: "Fecha",
    location: "Lugar",
    csv: "CSV",
    print: "Imprimir",
    pdf: "Descargar PDF",
    fav: "Fav",

    // Session Info
    tastingLocation: "Lugar de cata",
    sessionDate: "Fecha de sesión",
    generalNotes: "Notas Generales",
    origins: "Origen(es)",
    roaster: "Tostador",
    importer: "Importador",
    
    // Wheel
    close: "Cerrar",
    category: "Categoría",
    aroma: "Aroma"
  }
};

export const AROMA_CATEGORIES: AromaCategory[] = [
  {
    id: 'fruity',
    name: 'Fruité', // ID Key for translation
    color: '#CF3E53', 
    items: ['Citron', 'Orange', 'Pamplemousse', 'Cerise', 'Fraise', 'Framboise', 'Myrtille', 'Raisin', 'Ananas', 'Mangue', 'Passion', 'Pêche', 'Pomme verte', 'Poire']
  },
  {
    id: 'floral',
    name: 'Floral',
    color: '#E14684', 
    items: ['Jasmin', 'Rose', "Fleur d'oranger", 'Lavande', 'Hibiscus', 'Violette', 'Camomille']
  },
  {
    id: 'spicy',
    name: 'Épicé',
    color: '#CC3D42', 
    items: ['Cannelle', 'Clou de girofle', 'Muscade', 'Poivre', 'Cardamome', 'Gingembre']
  },
  {
    id: 'nutty',
    name: 'Chocolat / Noix',
    color: '#B57B4E', 
    items: ['Chocolat noir', 'Chocolat au lait', 'Cacao', 'Noisette', 'Amande', 'Noix', 'Cacahuète']
  },
  {
    id: 'sweet',
    name: 'Caramélisé',
    color: '#E48833', 
    items: ['Caramel', 'Miel', 'Cassonade', "Sirop d'érable", 'Mélasse']
  },
  {
    id: 'cereal',
    name: 'Céréales / Pain',
    color: '#DDAF61', 
    items: ['Pain grillé', 'Biscuit', 'Céréales', 'Malt', 'Noisette grillée']
  }
];

// Dictionary to map French keys to other languages
export const AROMA_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  // Categories
  'Fruité': { en: 'Fruity', es: 'Frutal' },
  'Floral': { en: 'Floral', es: 'Floral' },
  'Épicé': { en: 'Spicy', es: 'Especiado' },
  'Chocolat / Noix': { en: 'Nutty / Cocoa', es: 'Frutos Secos / Cacao' },
  'Caramélisé': { en: 'Sweet', es: 'Dulce' },
  'Céréales / Pain': { en: 'Roasted', es: 'Tostado' },

  // Fruité
  'Citron': { en: 'Lemon', es: 'Limón' },
  'Orange': { en: 'Orange', es: 'Naranja' },
  'Pamplemousse': { en: 'Grapefruit', es: 'Pomelo' },
  'Cerise': { en: 'Cherry', es: 'Cereza' },
  'Fraise': { en: 'Strawberry', es: 'Fresa' },
  'Framboise': { en: 'Raspberry', es: 'Frambuesa' },
  'Myrtille': { en: 'Blueberry', es: 'Arándano' },
  'Raisin': { en: 'Grape', es: 'Uva' },
  'Ananas': { en: 'Pineapple', es: 'Piña' },
  'Mangue': { en: 'Mango', es: 'Mango' },
  'Passion': { en: 'Passion Fruit', es: 'Maracuyá' },
  'Pêche': { en: 'Peach', es: 'Melocotón' },
  'Pomme verte': { en: 'Green Apple', es: 'Manzana Verde' },
  'Poire': { en: 'Pear', es: 'Pera' },

  // Floral
  'Jasmin': { en: 'Jasmine', es: 'Jazmín' },
  'Rose': { en: 'Rose', es: 'Rosa' },
  'Fleur d\'oranger': { en: 'Orange Blossom', es: 'Azahar' },
  'Lavande': { en: 'Lavender', es: 'Lavanda' },
  'Hibiscus': { en: 'Hibiscus', es: 'Hibisco' },
  'Violette': { en: 'Violet', es: 'Violeta' },
  'Camomille': { en: 'Chamomile', es: 'Manzanilla' },

  // Épicé
  'Cannelle': { en: 'Cinnamon', es: 'Canela' },
  'Clou de girofle': { en: 'Clove', es: 'Clavo' },
  'Muscade': { en: 'Nutmeg', es: 'Nuez Moscada' },
  'Poivre': { en: 'Pepper', es: 'Pimienta' },
  'Cardamome': { en: 'Cardamom', es: 'Cardamomo' },
  'Gingembre': { en: 'Ginger', es: 'Jengibre' },

  // Chocolat / Noix
  'Chocolat noir': { en: 'Dark Chocolate', es: 'Choc. Negro' },
  'Chocolat au lait': { en: 'Milk Chocolate', es: 'Choc. con Leche' },
  'Cacao': { en: 'Cocoa', es: 'Cacao' },
  'Noisette': { en: 'Hazelnut', es: 'Avellana' },
  'Amande': { en: 'Almond', es: 'Almendra' },
  'Noix': { en: 'Walnut', es: 'Nuez' },
  'Cacahuète': { en: 'Peanut', es: 'Cacahuete' },

  // Caramélisé
  'Caramel': { en: 'Caramel', es: 'Caramelo' },
  'Miel': { en: 'Honey', es: 'Miel' },
  'Cassonade': { en: 'Brown Sugar', es: 'Azúcar Moreno' },
  'Sirop d\'érable': { en: 'Maple Syrup', es: 'Jarabe de Arce' },
  'Mélasse': { en: 'Molasses', es: 'Melaza' },

  // Céréales / Pain
  'Pain grillé': { en: 'Toast', es: 'Pan Tostado' },
  'Biscuit': { en: 'Biscuit', es: 'Galleta' },
  'Céréales': { en: 'Cereal', es: 'Cereal' },
  'Malt': { en: 'Malt', es: 'Malta' },
  'Noisette grillée': { en: 'Roasted Hazelnut', es: 'Avellana Tostada' }
};

export const ITEM_COLOR_OVERRIDES: Record<string, string> = {
  // --- FRUITÉ (Fruity) ---
  'Citron': '#F5E452', 'Orange': '#F29635', 'Pamplemousse': '#F27056',
  'Cerise': '#E72D37', 'Fraise': '#EF474A', 'Framboise': '#E52E6C', 'Myrtille': '#6165A4',
  'Raisin': '#AEBF43', 'Ananas': '#F8C739', 'Mangue': '#F7941D', 'Passion': '#F2CA1E', 
  'Pêche': '#F3965E', 'Pomme verte': '#64AC56', 'Poire': '#C5B446',

  // --- FLORAL ---
  'Jasmin': '#F8F8F3', 'Rose': '#EF8CA6', 'Camomille': '#F5C656', 
  'Fleur d\'oranger': '#FCE6C9', 'Lavande': '#907DC1', 'Hibiscus': '#D44C6A', 'Violette': '#7F5C9E',

  // --- ÉPICÉ (Spices) ---
  'Poivre': '#9D3235', 'Cannelle': '#C46436', 'Clou de girofle': '#A26947', 
  'Muscade': '#8C6544', 'Gingembre': '#D6B563', 'Cardamome': '#999C63',

  // --- CHOCOLAT / NOIX (Nutty/Cocoa) ---
  'Chocolat noir': '#462920', 'Chocolat au lait': '#694231', 'Cacao': '#5D3C2E', 
  'Noisette': '#9C7349', 'Amande': '#C7A482', 'Noix': '#7B6652', 'Cacahuète': '#D3A45C',

  // --- CARAMÉLISÉ (Sweet) ---
  'Caramel': '#D17C2D', 'Miel': '#EAA63F', 'Sirop d\'érable': '#AD5D2D', 
  'Mélasse': '#5E2C22', 'Cassonade': '#C66940',

  // --- CÉRÉALES / PAIN (Cereal/Roasted) ---
  'Pain grillé': '#886A4C', 'Biscuit': '#E7C888', 'Céréales': '#D7B066', 
  'Malt': '#D8AF67', 'Noisette grillée': '#B0885D'
};

export const ROAST_LEVELS: { id: RoastLevelType; label: string; color: string }[] = [
  { id: 'light', label: 'Light', color: '#C89F78' },
  { id: 'medium-light', label: 'Med-Light', color: '#A67B5B' },
  { id: 'medium', label: 'Medium', color: '#8D6E4D' },
  { id: 'medium-dark', label: 'Med-Dark', color: '#6F4E37' },
  { id: 'dark', label: 'Dark', color: '#4A3428' },
];

export const ACIDITY_TYPES = ['Citrique', 'Malique', 'Tartrique', 'Acétique'];
export const ACIDITY_INTENSITIES = ['Faible', 'Moyenne', 'Forte'];

export const BODY_TYPES = ['Aqueux', 'Léger', 'Moyen', 'Rond', 'Crémeux', 'Sirupeux', 'Velouté', 'Charnu'];

export const PROCESSING_METHODS = ['Nature', 'Honey', 'Lavé', 'Anaérobie', 'Co-Fermenté'];

export const DEFAULT_COFFEE: CoffeeEntry = {
  id: '',
  name: 'Nouveau Café',
  isLocked: false,
  isFavorite: false,
  timestamp: Date.now(),
  process: '',
  fragranceScore: 8.0,
  fragranceNotes: [],
  flavorScore: 8.0,
  flavorNotes: [],
  aftertasteScore: 8.0,
  acidityScore: 8.0,
  acidityType: '',
  acidityIntensity: '',
  bodyScore: 8.0,
  bodyType: '',
  balanceScore: 8.0,
  comments: '',
};
