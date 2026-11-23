'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate } from '@/lib/types';
import DebateScheduleCard from '@/components/DebateScheduleCard';
import { Calendar, Video, Clock, ShieldCheck } from 'lucide-react';

export default function DebatesPage() {
  const { t, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDebates = async () => {
    try {
      const res = await fetch('/api/debates');
      const data = await res.json();
      if (data.debates) setDebates(data.debates);
    } catch (err) {
      console.error('Failed to load debates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  const upcoming = debates.filter((d) => d.status === 'scheduled');
  const completed = debates.filter((d) => d.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme-primary text-xs font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('debatesTitle')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'বিতর্ক সূচি ও ভার্চুয়াল সেশন' : 'Debate Schedules & Meet Sessions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('debatesSubtitle')}
        </p>
      </div>

      {/* Upcoming Debates */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('upcomingDebates')}
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {upcoming.length}
          </span>
        </div>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcoming.map((debate) => (
              <DebateScheduleCard key={debate.id} debate={debate} onRefresh={fetchDebates} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {language === 'bn' ? 'বর্তমানে কোনো আসন্ন বিতর্ক সূচি নেই।' : 'No upcoming debates scheduled at this moment.'}
          </div>
        )}
      </div>

      {/* Completed Debates */}
      {completed.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('completedDebates')}
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {completed.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completed.map((debate) => (
              <DebateScheduleCard key={debate.id} debate={debate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
