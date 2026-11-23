'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate } from '@/lib/types';
import confetti from 'canvas-confetti';
import TodayWinnerBanner from './TodayWinnerBanner';
import {
  Trophy,
  Award,
  Calendar,
  Flame,
} from 'lucide-react';

interface WinnerShowcaseProps {
  showTitle?: boolean;
}

export default function WinnerShowcase({ showTitle = true }: WinnerShowcaseProps) {
  const { t, language } = useLanguage();
  const [todayWinner, setTodayWinner] = useState<Debate | null>(null);
  const [yesterdayWinner, setYesterdayWinner] = useState<Debate | null>(null);
  const [archive, setArchive] = useState<Debate[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'yesterday' | 'archive'>('today');

  useEffect(() => {
    fetch('/api/debates/results')
      .then((res) => res.json())
      .then((data) => {
        if (data.todayWinner) setTodayWinner(data.todayWinner);
        if (data.yesterdayWinner) setYesterdayWinner(data.yesterdayWinner);
        if (data.archive) setArchive(data.archive);
      })
      .catch((err) => console.error('Failed to load results:', err));
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{t('resultsTitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'bn' ? 'ফলাফল ও বিজয়ী মঞ্চ' : 'Debate Results & Champions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t('resultsSubtitle')}
          </p>
        </div>
      )}

      {/* Navigation Tabs: Today's Winner | Yesterday's Winner | Archive */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => {
            setActiveTab('today');
            triggerCelebration();
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'today'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'bn' ? 'আজকের বিজয়ী (TODAY\'S WINNER)' : 'TODAY\'S WINNER (আজকের বিজয়ী)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('yesterday')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'yesterday'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>{language === 'bn' ? 'গতকালের বিজয়ী (YESTERDAY\'S WINNER)' : 'YESTERDAY\'S WINNER (গতকালের বিজয়ী)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('archive')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'archive'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <span>{language === 'bn' ? 'আর্কাইভ ফলাফল (ARCHIVE)' : 'ARCHIVED RESULTS (আর্কাইভ)'}</span>
        </button>
      </div>

      {/* Tab Panels with Unified Showcase Banner Style */}
      <div>
        {activeTab === 'today' && todayWinner && (
          <TodayWinnerBanner
            debate={todayWinner}
            badgeLabel={language === 'bn' ? 'আজকের বিজয়ী (TODAY\'S WINNER)' : 'TODAY\'S WINNER (আজকের বিজয়ী)'}
          />
        )}

        {activeTab === 'yesterday' && yesterdayWinner && (
          <TodayWinnerBanner
            debate={yesterdayWinner}
            badgeLabel={language === 'bn' ? 'গতকালের বিজয়ী (YESTERDAY\'S WINNER)' : 'YESTERDAY\'S WINNER (গতকালের বিজয়ী)'}
          />
        )}

        {activeTab === 'archive' && (
          <div className="space-y-6">
            {archive.length > 0 ? (
              archive.map((debate) => (
                <TodayWinnerBanner
                  key={debate.id}
                  debate={debate}
                  badgeLabel={language === 'bn' ? 'আর্কাইভ ফলাফল (ARCHIVED RESULT)' : 'ARCHIVED RESULT (আর্কাইভ ফলাফল)'}
                />
              ))
            ) : (
              <div className="py-10 text-center text-slate-500 text-sm">
                {t('noResultsYet')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
