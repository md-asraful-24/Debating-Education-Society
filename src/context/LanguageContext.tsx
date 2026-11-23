'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, LocalizedString } from '@/lib/types';
import { translations, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  loc: (obj?: LocalizedString | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('des_lang') as Language;
    if (saved === 'en' || saved === 'bn') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('des_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.bn;
    return dict[key] || translations.en[key] || key;
  };

  const loc = (obj?: LocalizedString | null): string => {
    if (!obj) return '';
    return obj[language] || obj.en || obj.bn || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, loc }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
