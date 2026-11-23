'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteSettings } from '@/lib/types';
import {
  ShieldAlert,
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  const { t, loc, language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সংগঠন পরিচিতি ও নীতিমালা' : 'Organization & Conduct Policy'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'আমাদের সম্পর্কে ও কঠোর আচরণবিধি' : 'About Society & Code of Conduct'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('tagline')}
        </p>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white font-extrabold text-lg">
          <BookOpen className="w-5 h-5 text-theme-primary" />
          <h2>{t('aboutSociety')}</h2>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {settings ? loc(settings.aboutContent) : t('tagline')}
        </p>
      </div>

      {/* Strict Code of Conduct & Anti-Harassment (Requirement 9) */}
      <div className="bg-gradient-to-br from-red-50 to-amber-50/50 dark:from-red-950/20 dark:to-slate-900 p-8 rounded-3xl border-2 border-red-500/30 shadow-md space-y-5">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-extrabold text-lg">
          <ShieldAlert className="w-6 h-6 shrink-0 animate-pulse" />
          <h2>{t('conductPolicy')}</h2>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-red-200 dark:border-red-900/50 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {settings ? loc(settings.conductRules) : ''}
        </div>

        {/* Clear Admin Enforcement Actions */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
            {language === 'bn' ? 'অ্যাডমিন প্যানেলের চার স্তরের শাস্তিমূলক ব্যবস্থা:' : 'Four-Tier Admin Enforcement Pipeline:'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 block">১. প্রথম সতর্কতা (Warning)</span>
              <span className="text-slate-500 text-[11px]">মৌখিক বা আনুষ্ঠানিক প্রোফাইল সতর্কবার্তা জারি।</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-orange-600 block">২. রুম কিক (Kick)</span>
              <span className="text-slate-500 text-[11px]">চলমান বিতর্ক বা চ্যাটরুম থেকে তাৎক্ষণিক অপসারণ।</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-red-600 block">৩. সাময়িক বহিষ্কার (Temp Ban)</span>
              <span className="text-slate-500 text-[11px]">নির্দিষ্ট মেয়াদের জন্য অ্যাকাউন্ট স্থগিতকরণ।</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-red-700 block">৪. স্থায়ী ব্যান (Permanent Ban)</span>
              <span className="text-slate-500 text-[11px]">সোসাইটি থেকে চিরতরে সদস্যপদ ও লগইন বাতিল।</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white font-extrabold text-lg">
          <Scale className="w-5 h-5 text-theme-primary" />
          <h2>{t('terms')}</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-2">
          {settings ? loc(settings.termsOfService) : ''}
        </div>
      </div>

      {/* Current Leadership & Moderation Panel */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Users className="w-5 h-5 text-theme-primary" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('leadershipTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {settings?.leadership?.map((leader) => (
            <div
              key={leader.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-theme-light text-theme-primary font-black flex items-center justify-center text-sm">
                {leader.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {leader.name}
                </h4>
                <p className="text-xs text-theme-primary font-semibold">
                  {loc(leader.role)}
                </p>
                {leader.email && (
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    {leader.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
