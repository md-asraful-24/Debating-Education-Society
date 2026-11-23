'use client';

import React, { useState, useEffect } from 'react';
import { Debate } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Trophy, CheckCircle, Save } from 'lucide-react';

export default function ResultsManager() {
  const { t, loc, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [selectedDebateId, setSelectedDebateId] = useState<string>('');
  const [winnerTeam, setWinnerTeam] = useState<'teamA' | 'teamB' | 'draw'>('teamA');
  const [bestDebater, setBestDebater] = useState('');
  const [scoreA, setScoreA] = useState(82.5);
  const [scoreB, setScoreB] = useState(80.0);
  const [remarksBn, setRemarksBn] = useState('');
  const [remarksEn, setRemarksEn] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchDebates = async () => {
    try {
      const res = await fetch('/api/debates');
      const data = await res.json();
      if (data.debates) {
        setDebates(data.debates);
        if (data.debates.length > 0 && !selectedDebateId) {
          setSelectedDebateId(data.debates[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebateId) return;

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debateId: selectedDebateId,
          result: {
            winnerTeam,
            bestDebater: bestDebater.trim(),
            scoreA,
            scoreB,
            judgeRemarks: { bn: remarksBn.trim(), en: remarksEn.trim() },
          },
        }),
      });

      if (res.ok) {
        setStatusMsg('Result and winner published successfully!');
        fetchDebates();
        setTimeout(() => setStatusMsg(null), 3500);
      }
    } catch {
      alert('Failed to publish result');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>{t('adminResults')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'বিচারকদের রায় ও স্কোরশিট প্রকাশ — হোমপেজ ও ফলাফল সেকশনে তাৎক্ষণিক বিজয়ী হাইলাইটস যুক্ত হবে'
            : 'Record and publish debate scores, winner teams, and adjudicator feedback'}
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handlePublishResult} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Select Debate Session
          </label>
          <select
            value={selectedDebateId}
            onChange={(e) => setSelectedDebateId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
          >
            {debates.map((d) => (
              <option key={d.id} value={d.id}>
                {loc(d.topic)} ({new Date(d.scheduledAt).toLocaleDateString()}) - {d.status}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Winning Team / বিজয়ী দল
            </label>
            <select
              value={winnerTeam}
              onChange={(e) => setWinnerTeam(e.target.value as 'teamA' | 'teamB' | 'draw')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="teamA">Team Alpha (সরকারি দল - Government)</option>
              <option value="teamB">Team Beta (বিরোধী দল - Opposition)</option>
              <option value="draw">অমিমাংসিত (Draw / Tied)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Best Debater / সেরা তার্কিক
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MD Zahid Hasan (সরকারি দল - প্রধানমন্ত্রী)"
              value={bestDebater}
              onChange={(e) => setBestDebater(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Team A Total Score
            </label>
            <input
              type="number"
              step="0.1"
              value={scoreA}
              onChange={(e) => setScoreA(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Team B Total Score
            </label>
            <input
              type="number"
              step="0.1"
              value={scoreB}
              onChange={(e) => setScoreB(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Judge Remarks (Bangla)
            </label>
            <textarea
              rows={2}
              placeholder="বিচারকমণ্ডলীর সামগ্রিক বিশ্লেষণ..."
              value={remarksBn}
              onChange={(e) => setRemarksBn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Judge Remarks (English)
            </label>
            <textarea
              rows={2}
              placeholder="Adjudication notes..."
              value={remarksEn}
              onChange={(e) => setRemarksEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-600/20"
        >
          <Trophy className="w-4 h-4" />
          <span>{t('adminPublishResult')}</span>
        </button>
      </form>
    </div>
  );
}
