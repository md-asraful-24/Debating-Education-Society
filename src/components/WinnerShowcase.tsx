'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface WinnerShowcaseProps {
  showTitle?: boolean;
}

export default function WinnerShowcase({ showTitle = true }: WinnerShowcaseProps) {
  const { t, loc, language } = useLanguage();
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

  const getWinnerTeamName = (debate: Debate) => {
    if (!debate.result) return '';
    if (debate.result.winnerTeam === 'teamA') return debate.teamA.name;
    if (debate.result.winnerTeam === 'teamB') return debate.teamB.name;
    return language === 'bn' ? 'অমিমাংসিত (Draw)' : 'Draw';
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
          <span>{t('todayWinner')}</span>
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
          <span>{t('yesterdayWinner')}</span>
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
          <span>{t('resultsArchive')}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'today' && todayWinner && (
          <WinnerCard debate={todayWinner} badgeLabel={t('todayWinner')} isHighlighted />
        )}

        {activeTab === 'yesterday' && yesterdayWinner && (
          <WinnerCard debate={yesterdayWinner} badgeLabel={t('yesterdayWinner')} />
        )}

        {activeTab === 'archive' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archive.length > 0 ? (
              archive.map((debate) => (
                <WinnerCard key={debate.id} debate={debate} isCompact />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-slate-500 text-sm">
                {t('noResultsYet')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WinnerCard({
  debate,
  badgeLabel,
  isHighlighted = false,
  isCompact = false,
}: {
  debate: Debate;
  badgeLabel?: string;
  isHighlighted?: boolean;
  isCompact?: boolean;
}) {
  const { t, loc, language } = useLanguage();
  if (!debate.result) return null;

  const winnerTeamName =
    debate.result.winnerTeam === 'teamA'
      ? debate.teamA.name
      : debate.result.winnerTeam === 'teamB'
      ? debate.teamB.name
      : 'Draw';

  const dateStr = new Date(debate.scheduledAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <div
      className={`rounded-2xl transition-all overflow-hidden ${
        isHighlighted
          ? 'bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/40 shadow-xl'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      {badgeLabel && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-white animate-bounce" />
            <span>{badgeLabel}</span>
          </div>
          <span className="text-xs font-semibold opacity-90">{dateStr}</span>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            {t('debateTopic')}
          </span>
          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {loc(debate.topic)}
          </h3>
        </div>

        {/* Winner Announcement Banner */}
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>{t('winnerTeam')}</span>
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {winnerTeamName}
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-amber-500/20">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-bold block">Team A</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                {debate.result.scoreA}
              </span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-bold block">Team B</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                {debate.result.scoreB}
              </span>
            </div>
          </div>
        </div>

        {/* Best Debater */}
        {debate.result.bestDebater && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                {t('bestDebater')}
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {debate.result.bestDebater}
              </span>
            </div>
          </div>
        )}

        {/* Judge Remarks */}
        {debate.result.judgeRemarks && (
          <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-semibold not-italic block text-slate-800 dark:text-slate-200 mb-0.5">
              {t('judgeFeedback')}:
            </span>
            &ldquo;{loc(debate.result.judgeRemarks)}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
