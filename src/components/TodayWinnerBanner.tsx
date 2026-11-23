'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate, WinningTeamMember } from '@/lib/types';
import {
  Trophy,
  Sparkles,
  Users,
  Crown,
  Calendar,
  MessageSquareQuote,
  Flame,
} from 'lucide-react';

interface TodayWinnerBannerProps {
  debate: Debate;
  badgeLabel?: string;
  isHeroMode?: boolean;
}

export default function TodayWinnerBanner({
  debate,
  badgeLabel,
  isHeroMode = false,
}: TodayWinnerBannerProps) {
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
      language === 'bn' ? 'উপনেতা / সহ-অবস্থান' : 'Deputy Leader',
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

  const displayBadge =
    badgeLabel ||
    (language === 'bn'
      ? 'আজকের বিজয়ী (TODAY\'S WINNER)'
      : 'TODAY\'S WINNER (আজকের বিজয়ী)');

  return (
    <div
      className={`w-full rounded-3xl transition-all overflow-hidden border shadow-2xl ${
        isHeroMode
          ? 'bg-slate-950/90 backdrop-blur-xl border-amber-500/40 ring-1 ring-white/10 text-left'
          : 'bg-gradient-to-br from-amber-500/10 via-white to-slate-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950 border-amber-500/40'
      }`}
    >
      {/* ─── Top Header Banner: "আজকের বিজয়ী (TODAY'S WINNER)" ─── */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white px-5 sm:px-7 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-white animate-bounce" />
          <span>{displayBadge}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold opacity-95 bg-black/25 px-3 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateStr}</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Debate Topic / Motion Heading */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
            {language === 'bn' ? 'বিতর্কের বিষয় / মোশন' : 'Debate Motion / Topic'}
          </span>
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {loc(debate.topic)}
          </h3>
          {debate.category && (
            <span className="inline-block text-[11px] font-semibold text-theme-primary">
              • {loc(debate.category)}
            </span>
          )}
        </div>

        {/* ─── Main Showcase Grid: Winning Team (2 Cols) + Best Debater (1 Col) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          
          {/* LEFT 2 COLUMNS: Winning Team Block with 3 Members & Roles Below It */}
          <div className="lg:col-span-2 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
            {/* Winning Team Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-600/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    {language === 'bn' ? 'বিজয়ী দল (WINNING TEAM)' : 'WINNING TEAM (বিজয়ী দল)'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight truncate">
                    {winningTeamName}
                  </h4>
                </div>
              </div>

              {/* Total Scores */}
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-amber-500/30 shrink-0 self-start sm:self-auto shadow-xs">
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

            {/* List 3 Team Members & Roles Directly Below */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-theme-primary" />
                  <span>
                    {language === 'bn'
                      ? 'বিজয়ী দলের ৩ সদস্য ও পদবী (3 Team Members & Roles):'
                      : 'Winning Team Members & Roles (৩ সদস্য ও পদবী):'}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  3 Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-2 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 ${
                          idx === 0
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                            : idx === 1
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {member.name || `Member ${idx + 1}`}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold tracking-tight border border-amber-200 dark:border-amber-800/50">
                        {member.role || (language === 'bn' ? 'সদস্য' : 'Debater')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Dedicated Side Panel Highlighting Best Debater (সেরা তার্কিক) */}
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900/90 p-5 sm:p-6 border-2 border-emerald-500/40 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সেরা তার্কিক (BEST DEBATER)' : 'BEST DEBATER (সেরা তার্কিক)'}</span>
                </span>
                <Trophy className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="pt-2 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                  {language === 'bn' ? 'সেরা বক্তা ও তার্কিক' : 'Champion Orator'}
                </span>
                <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-snug">
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
                <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 leading-relaxed">
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
