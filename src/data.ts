export interface Category {
  id: keyof typeof import('./i18n').translations['ar']['categories'];
  icon: string;
}

export const categories: Category[] = [
  { id: 'tools', icon: '🔧' },
  { id: 'accessories', icon: '🚗' },
  { id: 'maintenance', icon: '🧠' },
  { id: 'emergency', icon: '🧰' },
  { id: 'organic', icon: '🌿' },
  { id: 'all', icon: '📦' },
];

