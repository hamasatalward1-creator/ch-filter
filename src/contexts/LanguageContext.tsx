import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../i18n';

type Language = 'ar' | 'en' | 'ur' | 'hi' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ar;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'ur'].includes(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang] || translations.ar,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
