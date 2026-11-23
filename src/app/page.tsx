'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import DebateScheduleCard from '@/components/DebateScheduleCard';
import WinnerShowcase from '@/components/WinnerShowcase';
import { useLanguage } from '@/context/LanguageContext';
import { Debate } from '@/lib/types';
import {
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);

  useEffect(() => {
    fetch('/api/debates')
      .then((res) => res.json())
      .then((data) => {
        if (data.debates) setDebates(data.debates);
      })
      .catch((err) => console.error('Failed to load debates:', err));
  }, []);

  const upcomingDebates = debates.filter((d) => d.status === 'scheduled');

  return (
    <div className="space-y-16 pb-16">
      {/* Requirement 5: Homepage Hero Banner & Auto-Sliding Carousel */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Prominent Top Position: TODAY'S WINNER (আজকের বিজয়ী) Board */}
        <section className="pt-2">
          <WinnerShowcase />
        </section>

        {/* Quick Highlights Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/debates"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('navDebates')}</span>
                <ArrowRight className="w-4 h-4 text-theme-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'আসন্ন বিতর্ক সূচি ও ৫-৭ মিনিট পূর্বের টাইম-লকড গুগল মিট রুম'
                  : 'Upcoming debates with 5-7 min time-locked Google Meet access'}
              </p>
            </div>
          </Link>

          <Link
            href="/chat"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('navChat')}</span>
                <ArrowRight className="w-4 h-4 text-theme-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'সার্বজনীন সাধারণ বাংলা চ্যাটরুম ও ৩ সদস্যের প্রাইভেট টিম গ্রুপ'
                  : 'Universal Bangla debate chat and 3-member private team rooms'}
              </p>
            </div>
          </Link>

          <Link
            href="/cv-maker"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('navCvMaker')}</span>
                <ArrowRight className="w-4 h-4 text-theme-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'রেফারেন্স ফরম্যাটে লাইভ সিভি তৈরি ও হাই-কোয়ালিটি পিডিএফ ডাউনলোড'
                  : 'Live CV builder matching reference format with clean PDF export'}
              </p>
            </div>
          </Link>
        </div>

        {/* Next Scheduled Debates with Time-Locked Meet */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-theme-primary text-xs font-bold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('upcomingDebates')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {t('debatesTitle')}
              </h2>
            </div>
            <Link
              href="/debates"
              className="text-xs sm:text-sm font-bold text-theme-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{language === 'bn' ? 'সকল বিতর্ক সূচি দেখুন' : 'View Full Schedule'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingDebates.slice(0, 2).map((debate) => (
              <DebateScheduleCard key={debate.id} debate={debate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
