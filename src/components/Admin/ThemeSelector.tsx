'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeName } from '@/lib/types';
import { Palette, Check } from 'lucide-react';

interface ThemeOption {
  name: ThemeName;
  labelBn: string;
  labelEn: string;
  colorHex: string;
  accentHex: string;
  descBn: string;
  descEn: string;
}

const themeOptions: ThemeOption[] = [
  {
    name: 'emerald',
    labelBn: 'সবুজ (ইমারেল্ড - বাংলাদেশ ও প্রবৃদ্ধি)',
    labelEn: 'Emerald (National Forest & Growth)',
    colorHex: '#059669',
    accentHex: '#10b981',
    descBn: 'বাংলাদেশের সবুজ শ্যামল প্রতীক ও প্রাতিষ্ঠানিক আভিজাত্য',
    descEn: 'Deep evergreen representative of Bangladesh nature & logic',
  },
  {
    name: 'crimson',
    labelBn: 'লাল (রুবী ক্রিমসন - যুক্তির তেজ)',
    labelEn: 'Ruby Crimson (Passion & Oratory Power)',
    colorHex: '#dc2626',
    accentHex: '#ef4444',
    descBn: 'বিতর্কের প্রাণবন্ত তীব্রতা ও তেজস্বী যুক্তিখণ্ডন',
    descEn: 'Dynamic fiery red embodying competitive debate zeal',
  },
  {
    name: 'blue',
    labelBn: 'নীল (রয়েল নেভি - সংসদীয় প্রজ্ঞা)',
    labelEn: 'Royal Blue (Parliamentary Order)',
    colorHex: '#2563eb',
    accentHex: '#3b82f6',
    descBn: 'আন্তর্জাতিক সংসদীয় ঐতিহ্য ও স্বচ্ছ বিচারিক মান',
    descEn: 'Authoritative blue reflecting adjudicative equilibrium',
  },
  {
    name: 'midnight',
    labelBn: 'মিডনাইট (ইন্ডিগো স্লেট - আধুনিক আভা)',
    labelEn: 'Midnight Indigo (Modern Elegance)',
    colorHex: '#4f46e5',
    accentHex: '#6366f1',
    descBn: 'আধুনিক প্রযুক্তিনির্ভর স্মার্ট রূপরেখা',
    descEn: 'Sleek high-tech indigo tailored for futuristic vision',
  },
  {
    name: 'sunset',
    labelBn: 'সানসেট (অরেঞ্জ অ্যাম্বার - তারুণ্যের দীপ্তি)',
    labelEn: 'Sunset Amber (Youth Radiance)',
    colorHex: '#ea580c',
    accentHex: '#f97316',
    descBn: 'উষ্ণ ও প্রাণোচ্ছ্বল তারুণ্যের মেলবন্ধন',
    descEn: 'Warm sunset tones celebrating youth camaraderie',
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSelectTheme = async (selected: ThemeName) => {
    setTheme(selected);
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selected }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save theme setting:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-theme-primary" />
          <span>{t('adminThemes')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'ওয়েবসাইটের সামগ্রিক ব্র্যান্ড কালার থিম পরিবর্তন করুন — সকল ব্যবহারকারী ও পেজে একযোগে প্রতিফলিত হবে'
            : 'Change the website color palette site-wide for all members in real-time'}
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Theme updated and applied site-wide!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themeOptions.map((opt) => {
          const isSelected = theme === opt.name;
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => handleSelectTheme(opt.name)}
              className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-slate-900 dark:border-white bg-white dark:bg-slate-900 shadow-lg scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: opt.colorHex }}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {language === 'bn' ? opt.labelBn : opt.labelEn}
                  </span>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {language === 'bn' ? opt.descBn : opt.descEn}
              </p>

              {/* Color preview swatches */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-2 w-8 rounded-full" style={{ backgroundColor: opt.colorHex }} />
                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: opt.accentHex }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
