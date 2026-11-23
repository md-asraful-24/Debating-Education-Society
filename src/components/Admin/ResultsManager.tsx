'use client';

import React, { useState, useEffect } from 'react';
import { Debate, WinningTeamMember } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Trophy, CheckCircle, Users, Sparkles, UserCheck, Edit3 } from 'lucide-react';

export default function ResultsManager() {
  const { t, loc, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [selectedDebateId, setSelectedDebateId] = useState<string>('');
  
  // Winning Team Selection & Manual Input
  const [winnerTeamChoice, setWinnerTeamChoice] = useState<'teamA' | 'teamB' | 'manual' | 'draw'>('teamA');
  const [winningTeamName, setWinningTeamName] = useState('');
  
  // 3 Winning Team Members + Roles/Positions
  const [member1Name, setMember1Name] = useState('');
  const [member1Role, setMember1Role] = useState('প্রধানমন্ত্রী / দলনেতা (Prime Minister / Leader)');
  
  const [member2Name, setMember2Name] = useState('');
  const [member2Role, setMember2Role] = useState('উপনেতা / উপ-দলনেতা (Deputy Leader)');
  
  const [member3Name, setMember3Name] = useState('');
  const [member3Role, setMember3Role] = useState('সদস্য / সমাপনী বক্তা (Member / Whip)');
  
  // Best Debater / Best Speaker (Editable / Typeable)
  const [bestDebater, setBestDebater] = useState('');
  
  // Scores & Remarks
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
          populateFieldsFromDebate(data.debates[0], 'teamA');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  const populateFieldsFromDebate = (debate: Debate, choice: 'teamA' | 'teamB' | 'manual' | 'draw') => {
    if (choice === 'teamA') {
      setWinningTeamName(debate.teamA?.name || 'সরকারি দল (Team Alpha)');
      const m = debate.teamA?.members || [];
      setMember1Name(m[0]?.name || '');
      setMember1Role('প্রধানমন্ত্রী (Prime Minister)');
      setMember2Name(m[1]?.name || '');
      setMember2Role('উপনেতা (Deputy Leader)');
      setMember3Name(m[2]?.name || '');
      setMember3Role('সদস্য (Government Member)');
      if (m[0]?.name) {
        setBestDebater(`${m[0].name} (সরকারি দল - প্রধানমন্ত্রী)`);
      }
    } else if (choice === 'teamB') {
      setWinningTeamName(debate.teamB?.name || 'বিরোধী দল (Team Beta)');
      const m = debate.teamB?.members || [];
      setMember1Name(m[0]?.name || '');
      setMember1Role('বিরোধী দলীয় নেতা (Leader of Opposition)');
      setMember2Name(m[1]?.name || '');
      setMember2Role('উপ-বিরোধী দলীয় নেতা (Deputy Leader)');
      setMember3Name(m[2]?.name || '');
      setMember3Role('বিরোধী দলীয় সদস্য (Opposition Member)');
      if (m[0]?.name) {
        setBestDebater(`${m[0].name} (বিরোধী দলীয় নেতা)`);
      }
    } else if (choice === 'draw') {
      setWinningTeamName('অমিমাংসিত (Draw / Tied)');
      setMember1Name('');
      setMember2Name('');
      setMember3Name('');
    } else {
      // manual mode: keep what user typed or clear if empty
      if (!winningTeamName) {
        setWinningTeamName('');
      }
    }
  };

  const handleDebateSelect = (debateId: string) => {
    setSelectedDebateId(debateId);
    const d = debates.find((item) => item.id === debateId);
    if (d) {
      if (d.result) {
        // Load existing result
        setWinningTeamName(d.result.winningTeamName || (d.result.winnerTeam === 'teamB' ? d.teamB.name : d.teamA.name));
        setWinnerTeamChoice(
          d.result.winnerTeam === 'teamA' || d.result.winnerTeam === 'teamB' || d.result.winnerTeam === 'draw'
            ? (d.result.winnerTeam as 'teamA' | 'teamB' | 'draw')
            : 'manual'
        );
        const mems = d.result.winningMembers || [];
        setMember1Name(mems[0]?.name || '');
        setMember1Role(mems[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
        setMember2Name(mems[1]?.name || '');
        setMember2Role(mems[1]?.role || 'উপনেতা (Deputy Leader)');
        setMember3Name(mems[2]?.name || '');
        setMember3Role(mems[2]?.role || 'সদস্য (Team Member)');
        setBestDebater(d.result.bestDebater || '');
        setScoreA(d.result.scoreA ?? 82.5);
        setScoreB(d.result.scoreB ?? 80.0);
        setRemarksBn(d.result.judgeRemarks?.bn || '');
        setRemarksEn(d.result.judgeRemarks?.en || '');
      } else {
        populateFieldsFromDebate(d, winnerTeamChoice);
      }
    }
  };

  const handleChoiceChange = (choice: 'teamA' | 'teamB' | 'manual' | 'draw') => {
    setWinnerTeamChoice(choice);
    const currentDebate = debates.find((d) => d.id === selectedDebateId);
    if (currentDebate) {
      populateFieldsFromDebate(currentDebate, choice);
    }
  };

  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebateId) return;

    const currentDebate = debates.find((d) => d.id === selectedDebateId);
    const resolvedWinnerTeam =
      winnerTeamChoice === 'draw'
        ? 'draw'
        : winnerTeamChoice === 'teamA'
        ? 'teamA'
        : winnerTeamChoice === 'teamB'
        ? 'teamB'
        : 'custom';

    const members: WinningTeamMember[] = [
      { name: member1Name.trim(), role: member1Role.trim() },
      { name: member2Name.trim(), role: member2Role.trim() },
      { name: member3Name.trim(), role: member3Role.trim() },
    ].filter((m) => m.name.length > 0);

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debateId: selectedDebateId,
          result: {
            winnerTeam: resolvedWinnerTeam,
            winningTeamName: winningTeamName.trim() || currentDebate?.teamA.name || 'Champion Team',
            winningMembers: members,
            bestDebater: bestDebater.trim(),
            scoreA,
            scoreB,
            judgeRemarks: { bn: remarksBn.trim(), en: remarksEn.trim() },
          },
        }),
      });

      if (res.ok) {
        setStatusMsg(
          language === 'bn'
            ? 'ফলাফল, বিজয়ী দল ও সেরা বক্তা সফলভাবে প্রকাশিত হয়েছে!'
            : 'Result, winning team, 3 members, and best speaker published successfully!'
        );
        fetchDebates();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch {
      alert('Failed to publish result');
    }
  };

  const currentDebate = debates.find((d) => d.id === selectedDebateId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>{t('adminResults')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'ম্যানুয়াল বিজয়ী দল, ৩ জন সদস্যের দায়িত্ব/পদবী ও সেরা বক্তার বিবরণসহ ফলাফল প্রকাশ করুন'
            : 'Manually input winning team name, 3 team members with roles, and best speaker to publish'}
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handlePublishResult} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        {/* Debate Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            {language === 'bn' ? 'বিতর্ক অধিবেশন নির্বাচন করুন' : 'Select Debate Session'}
          </label>
          <select
            value={selectedDebateId}
            onChange={(e) => handleDebateSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
          >
            {debates.map((d) => (
              <option key={d.id} value={d.id}>
                {loc(d.topic)} ({new Date(d.scheduledAt).toLocaleDateString()}) - {d.status}
              </option>
            ))}
          </select>
        </div>

        {/* 1. Winning Team Name: Mode Selection + Manual Text Input */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{language === 'bn' ? 'বিজয়ী দল নির্বাচন ও ম্যানুয়াল নাম ইনপুট' : 'Winning Team Selection & Manual Name Input'}</span>
            </label>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleChoiceChange('teamA')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  winnerTeamChoice === 'teamA'
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Team A
              </button>
              <button
                type="button"
                onClick={() => handleChoiceChange('teamB')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  winnerTeamChoice === 'teamB'
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Team B
              </button>
              <button
                type="button"
                onClick={() => handleChoiceChange('manual')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 ${
                  winnerTeamChoice === 'manual'
                    ? 'bg-theme-primary text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Manual</span>
              </button>
              <button
                type="button"
                onClick={() => handleChoiceChange('draw')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  winnerTeamChoice === 'draw'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Draw
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block mb-1">
              {language === 'bn'
                ? 'বিজয়ী দলের নাম (যেকোনো নাম সরাসরি টাইপ বা এডিট করতে পারেন):'
                : 'Winning Team Name (Freely type or edit any team name):'}
            </span>
            <input
              type="text"
              required
              value={winningTeamName}
              onChange={(e) => setWinningTeamName(e.target.value)}
              placeholder="e.g. সরকারি দল (Team Alpha) অথবা ঢাকা বিশ্ববিদ্যালয় ডিবেটিং সোসাইটি"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 2. 3 Winning Team Members & Roles / Positions */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-theme-primary" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {language === 'bn'
                ? 'বিজয়ী দলের ৩ জন সদস্য ও দায়িত্ব/পদবী (ম্যানুয়াল ইনপুট)'
                : '3 Winning Team Members & Specific Roles/Positions (Manual Input)'}
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 -mt-2">
            {language === 'bn'
              ? 'সদস্যের নাম ও পদবী (যেমন: প্রধানমন্ত্রী, উপনেতা, সদস্য বা কাস্টম ভূমিকা) টাইপ করুন'
              : 'Enter each debater name and position (e.g. Prime Minister, Deputy Leader, Member, or custom position)'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Member 1 */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Member 1 / ১ম সদস্য
              </span>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Name / নাম</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MD Zahid Hasan"
                  value={member1Name}
                  onChange={(e) => setMember1Name(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Role / অবস্থান বা পদবী</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. প্রধানমন্ত্রী (Prime Minister)"
                  value={member1Role}
                  onChange={(e) => setMember1Role(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Member 2 */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Member 2 / ২য় সদস্য
              </span>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Name / নাম</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sadia Sultana"
                  value={member2Name}
                  onChange={(e) => setMember2Name(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Role / অবস্থান বা পদবী</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. উপনেতা (Deputy Leader)"
                  value={member2Role}
                  onChange={(e) => setMember2Role(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Member 3 */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Member 3 / ৩য় সদস্য
              </span>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Name / নাম</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arif Hossain"
                  value={member3Name}
                  onChange={(e) => setMember3Name(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Role / অবস্থান বা পদবী</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. সদস্য (Government Member)"
                  value={member3Role}
                  onChange={(e) => setMember3Role(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Best Debater / Best Speaker (Editable / Typeable) */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
          <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Best Speaker / সেরা বক্তা বা সেরা তার্কিক (Typeable / Editable)</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. MD Zahid Hasan (সরকারি দল - প্রধানমন্ত্রী)"
            value={bestDebater}
            onChange={(e) => setBestDebater(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
            {language === 'bn'
              ? 'সেরা বক্তার নাম ও দল/অবস্থান সরাসরি টাইপ করে আপডেট করুন'
              : 'Enter the Best Speaker name and team/role to prominently feature on results page'}
          </span>
        </div>

        {/* Scores */}
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

        {/* Remarks */}
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
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-95"
        >
          <Trophy className="w-4 h-4" />
          <span>{t('adminPublishResult')}</span>
        </button>
      </form>
    </div>
  );
}
