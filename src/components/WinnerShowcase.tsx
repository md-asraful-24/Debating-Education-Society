'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate, WinningTeamMember } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  User,
  Users,
  Shield,
  MessageSquareQuote,
  Crown,
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
          <div className="space-y-6">
            {archive.length > 0 ? (
              archive.map((debate) => (
                <WinnerCard key={debate.id} debate={debate} />
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

function WinnerCard({
  debate,
  badgeLabel,
  isHighlighted = false,
}: {
  debate: Debate;
  badgeLabel?: string;
  isHighlighted?: boolean;
}) {
  const { t, loc, language } = useLanguage();
  if (!debate.result) return null;

  const defaultWinnerTeamName =
    debate.result.winnerTeam === 'teamA'
      ? debate.teamA.name
      : debate.result.winnerTeam === 'teamB'
      ? debate.teamB.name
      : language === 'bn' ? 'অমিমাংসিত (Draw)' : 'Draw';

  const winningTeamName = debate.result.winningTeamName || defaultWinnerTeamName;

  // Resolve 3 winning members and their roles
  let members: WinningTeamMember[] = debate.result.winningMembers || [];
  if (members.length === 0) {
    const rawMembers =
      debate.result.winnerTeam === 'teamA'
        ? debate.teamA.members
        : debate.result.winnerTeam === 'teamB'
        ? debate.teamB.members
        : [];
    const defaultRoles = [
      language === 'bn' ? 'প্রধানমন্ত্রী / দলনেতা' : 'Prime Minister / Leader',
      language === 'bn' ? 'উপনেতা / উপ-দলনেতা' : 'Deputy Leader',
      language === 'bn' ? 'সদস্য / সমাপনী বক্তা' : 'Member / Whip',
    ];
    members = rawMembers.slice(0, 3).map((m, idx) => ({
      name: m.name,
      role: defaultRoles[idx] || (language === 'bn' ? 'সদস্য' : 'Member'),
    }));
  }

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
      className={`rounded-3xl transition-all overflow-hidden ${
        isHighlighted
          ? 'bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/40 shadow-xl'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      {/* Top Banner with Badge & Date */}
      {badgeLabel && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-white animate-bounce" />
            <span>{badgeLabel}</span>
          </div>
          <span className="text-xs font-bold opacity-95 bg-black/20 px-3 py-1 rounded-full">{dateStr}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-6">
        {/* Debate Topic */}
        <div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
            {t('debateTopic')}
          </span>
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {loc(debate.topic)}
          </h3>
          {debate.category && (
            <span className="inline-block mt-1 text-[11px] font-semibold text-theme-primary">
              • {loc(debate.category)}
            </span>
          )}
        </div>

        {/* ─── Structured Layout: Winning Team (Left) + Best Speaker Side Panel (Right) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2 COLUMNS: Winning Team Card + 3 Members & Specific Roles */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-slate-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900/80 p-5 sm:p-6 border border-amber-500/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-600/30">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      {t('winnerTeam')} / চ্যাম্পিয়ন দল
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {winningTeamName}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Total Scores */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-amber-500/30 shrink-0 self-start sm:self-auto shadow-xs">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Team A</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
                    {debate.result.scoreA}
                  </span>
                </div>
                <span className="text-amber-500 font-black text-sm">:</span>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Team B</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
                    {debate.result.scoreB}
                  </span>
                </div>
              </div>
            </div>

            {/* List of 3 Winning Team Members with Positions / Roles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-theme-primary" />
                  <span>
                    {language === 'bn' ? 'বিজয়ী দলের ৩ সদস্য ও অবস্থান/দায়িত্ব:' : 'Winning Team Members & Specific Positions:'}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  3 Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-2 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 ${
                        idx === 0
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : idx === 1
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {member.name || `Member ${idx + 1}`}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold tracking-tight border border-amber-200 dark:border-amber-800/50">
                        {member.role || (language === 'bn' ? 'সদস্য' : 'Debater')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Dedicated Side Panel Highlighting Best Speaker (সেরা বক্তা) */}
          <div className="lg:col-span-1 h-full rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900/80 p-5 sm:p-6 border-2 border-emerald-500/30 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সেরা বক্তা' : 'Best Speaker'}</span>
                </span>
                <Trophy className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                  {t('bestDebater')} / সেরা তার্কিক
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug mt-1 text-emerald-600 dark:text-emerald-400">
                  {debate.result.bestDebater || (language === 'bn' ? 'ঘোষিত হয়নি' : 'To be announced')}
                </div>
              </div>
            </div>

            {/* Adjudication Feedback Note / Remarks */}
            {debate.result.judgeRemarks && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <MessageSquareQuote className="w-3 h-3 text-slate-400" />
                  <span>{t('judgeFeedback')}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-4 leading-relaxed">
                  &ldquo;{loc(debate.result.judgeRemarks)}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
