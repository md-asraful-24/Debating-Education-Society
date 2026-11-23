'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'footer' | 'nav';
}

export default function LanguageSwitcher({ className = '', variant = 'nav' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'footer') {
    return (
      <div className={`flex items-center justify-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-700/60 backdrop-blur-sm ${className}`}>
        <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-xs text-slate-300 font-medium">Select Language / ভাষা নির্বাচন করুন:</span>
        <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              language === 'bn'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            বাংলা (BN)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              language === 'en'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            English (EN)
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 transition-colors shadow-xs ${className}`}
      title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
    >
      <Globe className="w-3.5 h-3.5 text-theme-primary" />
      <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
    </button>
  );
}
