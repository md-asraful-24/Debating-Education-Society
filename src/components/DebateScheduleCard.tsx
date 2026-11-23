'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Debate } from '@/lib/types';
import {
  Calendar,
  Clock,
  Lock,
  ExternalLink,
  Users,
  ShieldCheck,
  Video,
  AlertCircle,
} from 'lucide-react';

interface DebateScheduleCardProps {
  debate: Debate;
  onRefresh?: () => void;
}

export default function DebateScheduleCard({ debate }: DebateScheduleCardProps) {
  const { t, loc, language } = useLanguage();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [loadingMeet, setLoadingMeet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scheduledDate = new Date(debate.scheduledAt);
  const unlockMinutes = debate.unlockMinutesBefore || 6;

  // Calculate live countdown to unlock window
  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const scheduledTime = scheduledDate.getTime();
      const unlockTime = scheduledTime - unlockMinutes * 60 * 1000;
      const endTime = scheduledTime + (debate.durationMinutes || 60) * 60 * 1000 + 30 * 60 * 1000;

      if (now >= unlockTime && now <= endTime) {
        setIsUnlocked(true);
        setSecondsRemaining(0);
      } else if (now < unlockTime) {
        setIsUnlocked(false);
        setSecondsRemaining(Math.max(0, Math.floor((unlockTime - now) / 1000)));
      } else {
        setIsUnlocked(false);
        setSecondsRemaining(0);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [debate.scheduledAt, unlockMinutes, debate.durationMinutes]);

  const fetchMeetLink = async () => {
    setLoadingMeet(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/debates/${debate.id}/meet-link`);
      const data = await res.json();
      if (res.ok && data.meetLink) {
        setMeetLink(data.meetLink);
        window.open(data.meetLink, '_blank', 'noopener,noreferrer');
      } else {
        setErrorMessage(data.error || 'Meeting access locked.');
      }
    } catch {
      setErrorMessage('Failed to connect to debate session.');
    } finally {
      setLoadingMeet(false);
    }
  };

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  const formattedDate = scheduledDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = scheduledDate.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {debate.category ? loc(debate.category) : 'সংসদীয় বিতর্ক'}
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 font-mono font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        {/* Debate Topic */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-1 block">
            {t('debateTopic')}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {loc(debate.topic)}
          </h3>
        </div>

        {/* Assigned Teams (3 debaters per team requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Team A: Government */}
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                {debate.teamA.name || t('governmentTeam')}
              </span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-4 list-disc">
              {debate.teamA.members.map((m, idx) => (
                <li key={idx} className="font-medium">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Team B: Opposition */}
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                {debate.teamB.name || t('oppositionTeam')}
              </span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-4 list-disc">
              {debate.teamB.members.map((m, idx) => (
                <li key={idx} className="font-medium">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Judges / Adjudicators */}
        {debate.judges && debate.judges.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-theme-primary shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('judgesPanel')}:</span>
            <span className="truncate">
              {debate.judges.map((j) => `${j.name} (${j.role})`).join(', ')}
            </span>
          </div>
        )}

        {/* Time-Locked Join Google Meet Area */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {isUnlocked ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{language === 'bn' ? 'গুগল মিট রুম উন্মুক্ত হয়েছে!' : 'Google Meet Room is now unlocked!'}</span>
              </div>
              <button
                type="button"
                onClick={fetchMeetLink}
                disabled={loadingMeet}
                className="w-full py-2.5 px-4 rounded-xl bg-theme-primary hover:bg-theme-hover text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Video className="w-4 h-4" />
                <span>{loadingMeet ? t('loading') : t('meetUnlockedJoin')}</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('meetLocked')}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('timeLockNotice')}
              </p>
              {secondsRemaining > 0 && (
                <div className="pt-1 flex items-center justify-center gap-1 text-xs font-mono font-bold text-theme-primary">
                  <span>{t('meetUnlockCountdown')}:</span>
                  <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {formatCountdown(secondsRemaining)}
                  </span>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
