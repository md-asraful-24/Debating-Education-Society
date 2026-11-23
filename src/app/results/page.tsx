'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Debate, WinningTeamMember } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Calendar,
  Users,
  Flame,
  MessageSquareQuote,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function ResultsPage() {
  const { t, loc, language } = useLanguage();
  const [todayWinner, setTodayWinner] = useState<Debate | null>(null);
  const [yesterdayWinner, setYesterdayWinner] = useState<Debate | null>(null);
  const [archive, setArchive] = useState<Debate[]>([]);
  const [allCompleted, setAllCompleted] = useState<Debate[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'yesterday' | 'archive'>('today');

  useEffect(() => {
    fetch('/api/debates/results')
      .then((res) => res.json())
      .then((data) => {
        if (data.todayWinner) setTodayWinner(data.todayWinner);
        if (data.yesterdayWinner) setYesterdayWinner(data.yesterdayWinner);
        if (data.archive) setArchive(data.archive);
        if (data.allCompleted) setAllCompleted(data.allCompleted);

        // Confetti celebration on initial load
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
      })
      .catch((err) => console.error('Failed to load results:', err));
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Resolve current active debate based on tab
  const activeDebate: Debate | null =
    activeTab === 'today'
      ? todayWinner || (allCompleted.length > 0 ? allCompleted[0] : null)
      : activeTab === 'yesterday'
      ? yesterdayWinner || (allCompleted.length > 1 ? allCompleted[1] : null)
      : null;

  const defaultWinnerTeamName = activeDebate
    ? activeDebate.result?.winnerTeam === 'teamA'
      ? activeDebate.teamA.name
      : activeDebate.result?.winnerTeam === 'teamB'
      ? activeDebate.teamB.name
      : language === 'bn' ? 'অমিমাংসিত (Draw)' : 'Draw'
    : '';

  const winningTeamName = activeDebate?.result?.winningTeamName || defaultWinnerTeamName;

  // Resolve 3 winning members and roles
  let members: WinningTeamMember[] = activeDebate?.result?.winningMembers || [];
  if (activeDebate && members.length === 0) {
    const rawMembers =
      activeDebate.result?.winnerTeam === 'teamA'
        ? activeDebate.teamA.members
        : activeDebate.result?.winnerTeam === 'teamB'
        ? activeDebate.teamB.members
        : [];
    const defaultRoles = [
      language === 'bn' ? 'প্রধানমন্ত্রী / দলনেতা' : 'Prime Minister / Leader',
      language === 'bn' ? 'উপনেতা / সহ-অবস্থান' : 'Deputy Leader',
      language === 'bn' ? 'সদস্য / সমাপনী বক্তা' : 'Member / Whip',
    ];
    members = rawMembers.slice(0, 3).map((m, idx) => ({
      name: m.name,
      role: defaultRoles[idx] || (language === 'bn' ? 'সদস্য' : 'Debater'),
    }));
  }

  const dateStr = activeDebate
    ? new Date(activeDebate.scheduledAt).toLocaleDateString(
        language === 'bn' ? 'bn-BD' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )
    : '';

  return (
    <div className="space-y-12 pb-20">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. HERO-STYLE GRAND BANNER HEADER (Exactly matching the user screenshot)
          Dark auditorium background, atmospheric lighting, grand typography
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[460px] sm:min-h-[520px] overflow-hidden bg-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-8 py-16 select-none">
        {/* Background Auditorium Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Cinematic Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/90" />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {/* Top Pill Badge (matching image pill style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>
              {activeTab === 'today'
                ? language === 'bn'
                  ? 'জাতীয় বিতর্ক চ্যাম্পিয়নশিপ • আজকের বিজয়ী'
                  : 'National Debate Championship • TODAY\'S WINNER'
                : activeTab === 'yesterday'
                ? language === 'bn'
                  ? 'জাতীয় বিতর্ক চ্যাম্পিয়নশিপ • গতকালের বিজয়ী'
                  : 'National Debate Championship • YESTERDAY\'S WINNER'
                : language === 'bn'
                ? 'জাতীয় বিতর্ক চ্যাম্পিয়নশিপ • ফলাফল ও বিজয়ী মঞ্চ'
                : 'National Debate Championship • Results & Champions'}
            </span>
          </div>

          {/* Huge Grand Title (Two-tone: Emerald Green + Crisp White, exactly like screenshot) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-xl leading-tight">
            <span className="text-emerald-400 block">
              {language === 'bn' ? 'বিজয়ী দল (WINNING TEAM)' : 'WINNING CHAMPION TEAM'}
            </span>
            <span className="text-white block mt-2">
              {winningTeamName || (language === 'bn' ? 'ফলাফল প্রক্রিয়াধীন' : 'Results Pending')}
            </span>
          </h1>

          {/* Subtitle: Debate Motion / Topic */}
          {activeDebate?.topic && (
            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-200 font-medium drop-shadow-md leading-relaxed">
              <span className="text-amber-400 font-bold">
                {language === 'bn' ? 'মোশন / বিষয়: ' : 'Motion: '}
              </span>
              &ldquo;{loc(activeDebate.topic)}&rdquo;
            </p>
          )}

          {/* Quick Score & Date Tags */}
          {activeDebate?.result && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-4 py-1.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono backdrop-blur-md flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Score: {activeDebate.result.scoreA} : {activeDebate.result.scoreB}
                </span>
              </div>

              {dateStr && (
                <div className="px-4 py-1.5 rounded-xl bg-black/40 border border-white/20 text-slate-300 text-xs font-bold backdrop-blur-md flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dateStr}</span>
                </div>
              )}

              {activeDebate.category && (
                <div className="px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
                  {loc(activeDebate.category)}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. MAIN RESULTS CONTENT & WINNER DETAILS SHOWCASE
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Tabs: Today's Winner | Yesterday's Winner | Archive */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-lg mx-auto border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab('today');
              triggerCelebration();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>{language === 'bn' ? 'আজকের বিজয়ী' : 'Today\'s Winner'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('yesterday');
              triggerCelebration();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'yesterday'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-300" />
            <span>{language === 'bn' ? 'গতকালের বিজয়ী' : 'Yesterday\'s Winner'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'archive'
                ? 'bg-theme-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-300" />
            <span>{language === 'bn' ? 'ফলাফল আর্কাইভ' : 'Results Archive'}</span>
          </button>
        </div>

        {/* ─── TAB 1 & 2: Winner Showcase (Today / Yesterday) ─── */}
        {activeTab !== 'archive' && activeDebate && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* LEFT 2 COLUMNS: Winning Team & 3 Members with Specific Roles Directly Below */}
            <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              
              {/* Winning Team Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/30">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      {language === 'bn' ? 'বিজয়ী দল (WINNING TEAM)' : 'WINNING TEAM'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      {winningTeamName}
                    </h3>
                  </div>
                </div>

                {/* Score Tag */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto shadow-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Team A</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {activeDebate.result?.scoreA}
                    </span>
                  </div>
                  <span className="text-amber-500 font-black text-base">:</span>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Team B</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {activeDebate.result?.scoreB}
                    </span>
                  </div>
                </div>
              </div>

              {/* Directly Below: 3 Team Members & Roles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-theme-primary" />
                    <span>
                      {language === 'bn'
                        ? 'বিজয়ী দলের ৩ সদস্য ও পদবী/দায়িত্ব:'
                        : 'Winning Team Members & Specific Positions:'}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    3 Members
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs ${
                            idx === 0
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                              : idx === 1
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {member.name || `Member ${idx + 1}`}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px] font-bold tracking-tight border border-amber-200 dark:border-amber-800/60">
                          {member.role || (language === 'bn' ? 'সদস্য' : 'Debater')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT 1 COLUMN: Dedicated Side Panel Highlighting Best Debater (সেরা তার্কিক) */}
            <div className="lg:col-span-1 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900/90 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সেরা তার্কিক (BEST DEBATER)' : 'BEST DEBATER'}</span>
                  </span>
                  <Trophy className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                    {language === 'bn' ? 'সেরা বক্তা ও তার্কিক' : 'Champion Orator'}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-snug">
                    {activeDebate.result?.bestDebater || (language === 'bn' ? 'ঘোষিত হয়নি' : 'To be announced')}
                  </div>
                </div>
              </div>

              {/* Adjudicator Remarks / Judge Quote */}
              {activeDebate.result?.judgeRemarks && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-theme-primary" />
                    <span>{t('judgeFeedback')}</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed bg-white/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    &ldquo;{loc(activeDebate.result.judgeRemarks)}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: Archive Results List ─── */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'পূর্ববর্তী বিতর্ক ফলাফল আর্কাইভ' : 'Previous Debate Results Archive'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'সকল সম্পন্ন হওয়া জাতীয় ও আন্তঃবিশ্ববিদ্যালয় বিতর্ক সেশনের ফলাফল'
                  : 'Historical results of all concluded national debates and tournaments'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {archive.length > 0 ? (
                archive.map((deb) => (
                  <div
                    key={deb.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                      <span>{new Date(deb.scheduledAt).toLocaleDateString()}</span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {loc(deb.topic)}
                    </h4>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block">
                          Winner Team
                        </span>
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {deb.result?.winningTeamName ||
                            (deb.result?.winnerTeam === 'teamA' ? deb.teamA.name : deb.teamB.name)}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl">
                        {deb.result?.scoreA} : {deb.result?.scoreB}
                      </div>
                    </div>

                    {deb.result?.bestDebater && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Best Speaker: <strong>{deb.result.bestDebater}</strong></span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                  {t('noResultsYet')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
