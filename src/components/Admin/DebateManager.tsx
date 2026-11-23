'use client';

import React, { useState, useEffect } from 'react';
import { Debate, User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Plus, Clock, Video, Users, CheckCircle } from 'lucide-react';

export default function DebateManager() {
  const { t, loc, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topicBn, setTopicBn] = useState('');
  const [topicEn, setTopicEn] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/new');
  const [unlockMinutes, setUnlockMinutes] = useState(6);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchDebates = async () => {
    try {
      const res = await fetch('/api/debates');
      const data = await res.json();
      if (data.debates) setDebates(data.debates);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDebates();
    fetchUsers();

    // Default datetime 30 mins from now formatted for datetime-local
    const future = new Date(Date.now() + 30 * 60 * 1000);
    setScheduledAt(future.toISOString().slice(0, 16));
  }, []);

  const handleCreateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicBn || !topicEn || !scheduledAt) return;

    // Pick 3 members for team A and 3 for team B from users
    const teamAMembers = users.filter((u) => u.teamId === 'team-a').slice(0, 3);
    const teamBMembers = users.filter((u) => u.teamId === 'team-b').slice(0, 3);
    const judges = users.filter((u) => u.role === 'admin' || u.role === 'moderator').slice(0, 2);

    try {
      const res = await fetch('/api/debates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: { bn: topicBn.trim(), en: topicEn.trim() },
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes: 60,
          meetLink: meetLink.trim(),
          unlockMinutesBefore: Number(unlockMinutes) || 6,
          teamA: {
            name: 'সরকারি দল (Team Alpha)',
            members: teamAMembers.map((m) => ({ userId: m.id, name: m.name, email: m.email })),
          },
          teamB: {
            name: 'বিরোধী দল (Team Beta)',
            members: teamBMembers.map((m) => ({ userId: m.id, name: m.name, email: m.email })),
          },
          judges: judges.map((j) => ({
            userId: j.id,
            name: j.name,
            email: j.email,
            role: j.panelRole || 'chairperson',
          })),
        }),
      });

      if (res.ok) {
        setStatusMsg('New debate successfully scheduled!');
        setTopicBn('');
        setTopicEn('');
        fetchDebates();
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Failed to schedule debate');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-theme-primary" />
          <span>{t('adminDebates')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'নতুন বিতর্ক সেশন শিডিউল, গুগল মিট লিঙ্ক ও ৫-৭ মিনিট পূর্বের টাইম-লক উইন্ডো নির্ধারণ'
            : 'Schedule debates, set Google Meet links, and configure the 5-7 min unlock window'}
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Schedule Form */}
      <form onSubmit={handleCreateDebate} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-theme-primary" />
          <span>{t('adminAddDebate')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Debate Motion (Bangla)
            </label>
            <textarea
              required
              rows={2}
              placeholder="এই সংসদ মনে করে যে..."
              value={topicBn}
              onChange={(e) => setTopicBn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Debate Motion (English)
            </label>
            <textarea
              required
              rows={2}
              placeholder="This House believes that..."
              value={topicEn}
              onChange={(e) => setTopicEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Google Meet Link
            </label>
            <input
              type="url"
              required
              placeholder="https://meet.google.com/..."
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Time-Lock Window (5 to 7 mins before)
            </label>
            <select
              value={unlockMinutes}
              onChange={(e) => setUnlockMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value={5}>5 minutes before start</option>
              <option value={6}>6 minutes before start (Recommended)</option>
              <option value={7}>7 minutes before start</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>Publish Schedule</span>
        </button>
      </form>

      {/* Existing Debates List */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Scheduled & Concluded Debates ({debates.length})
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {debates.map((deb) => (
            <div key={deb.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {loc(deb.topic)}
                </span>
                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span>{new Date(deb.scheduledAt).toLocaleString()}</span>
                  <span>• Unlock: {deb.unlockMinutesBefore || 6}m prior</span>
                  <span>• Link: {deb.meetLink}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  deb.status === 'completed'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {deb.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
