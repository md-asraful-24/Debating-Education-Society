'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Debate, User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calendar,
  Plus,
  Clock,
  Video,
  Users,
  CheckCircle,
  Edit3,
  Trash2,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';

export default function DebateManager() {
  const { t, loc, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Form States
  const [editingDebateId, setEditingDebateId] = useState<string | null>(null);
  const [topicBn, setTopicBn] = useState('');
  const [topicEn, setTopicEn] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/new');
  const [unlockMinutes, setUnlockMinutes] = useState(6);
  const [debateStatus, setDebateStatus] = useState<'scheduled' | 'live' | 'completed' | 'cancelled'>('scheduled');
  
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleStartEdit = (deb: Debate) => {
    setEditingDebateId(deb.id);
    setTopicBn(deb.topic.bn || '');
    setTopicEn(deb.topic.en || '');
    try {
      setScheduledAt(new Date(deb.scheduledAt).toISOString().slice(0, 16));
    } catch {
      setScheduledAt(deb.scheduledAt.slice(0, 16));
    }
    setMeetLink(deb.meetLink || 'https://meet.google.com/new');
    setUnlockMinutes(deb.unlockMinutesBefore || 6);
    setDebateStatus(deb.status || 'scheduled');
    setErrorMsg(null);

    // Scroll to form smoothly
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingDebateId(null);
    setTopicBn('');
    setTopicEn('');
    const future = new Date(Date.now() + 30 * 60 * 1000);
    setScheduledAt(future.toISOString().slice(0, 16));
    setMeetLink('https://meet.google.com/new');
    setUnlockMinutes(6);
    setDebateStatus('scheduled');
    setErrorMsg(null);
  };

  const handleDeleteDebate = async (id: string, topicText: string) => {
    const confirmDelete = window.confirm(
      language === 'bn'
        ? `আপনি কি নিশ্চিত যে এই বিতর্ক সেশনটি মুছে ফেলতে চান?\n"${topicText}"`
        : `Are you sure you want to delete this debate session?\n"${topicText}"`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/debates?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        setDebates((prev) => prev.filter((d) => d.id !== id));
        if (editingDebateId === id) {
          handleCancelEdit();
        }
        setStatusMsg(language === 'bn' ? 'বিতর্ক সেশন সফলভাবে মুছে ফেলা হয়েছে।' : 'Debate session deleted successfully.');
        setTimeout(() => setStatusMsg(null), 3500);
      } else {
        setErrorMsg(data.error || 'Failed to delete debate.');
      }
    } catch {
      setErrorMsg('Network error while deleting debate.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!topicBn.trim() || !topicEn.trim() || !scheduledAt) {
      setErrorMsg('Please fill in both Bengali & English motions and scheduled date.');
      return;
    }

    if (editingDebateId) {
      // UPDATE EXISTING DEBATE (PUT)
      try {
        const res = await fetch('/api/debates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingDebateId,
            topic: { bn: topicBn.trim(), en: topicEn.trim() },
            scheduledAt: new Date(scheduledAt).toISOString(),
            meetLink: meetLink.trim(),
            unlockMinutesBefore: Number(unlockMinutes) || 6,
            status: debateStatus,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatusMsg(
            language === 'bn'
              ? 'বিতর্ক সেশন সফলভাবে আপডেট করা হয়েছে!'
              : 'Debate session updated successfully!'
          );
          handleCancelEdit();
          fetchDebates();
          setTimeout(() => setStatusMsg(null), 3500);
        } else {
          setErrorMsg(data.error || 'Failed to update debate.');
        }
      } catch {
        setErrorMsg('Network error while updating debate.');
      }
    } else {
      // CREATE NEW DEBATE (POST)
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
          setStatusMsg(
            language === 'bn'
              ? 'নতুন বিতর্ক সফলভাবে শিডিউল করা হয়েছে!'
              : 'New debate successfully scheduled!'
          );
          setTopicBn('');
          setTopicEn('');
          fetchDebates();
          setTimeout(() => setStatusMsg(null), 3500);
        } else {
          setErrorMsg('Failed to schedule debate.');
        }
      } catch {
        setErrorMsg('Network error while scheduling debate.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-theme-primary" />
          <span>{t('adminDebates')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'বিতর্ক অধিবেশন তৈরি, এডিট, রিয়েল-টাইম মিট লিঙ্ক পরিবর্তন বা মুছে ফেলুন'
            : 'Schedule new debate sessions, edit motions/links, or delete completed/unwanted sessions'}
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─── Schedule / Edit Form ─── */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`p-6 rounded-2xl border space-y-4 transition-all shadow-xs ${
          editingDebateId
            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/80 ring-2 ring-amber-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            {editingDebateId ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 dark:text-amber-400">
                  {language === 'bn' ? 'বিতর্ক অধিবেশন এডিট করুন' : 'Edit Debate Session'}
                </span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-theme-primary" />
                <span>{language === 'bn' ? 'নতুন বিতর্ক শিডিউল করুন' : 'Schedule New Debate'}</span>
              </>
            )}
          </h3>

          {editingDebateId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাতিল' : 'Cancel Edit'}</span>
            </button>
          )}
        </div>

        {/* Motions (Bangla & English) */}
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Debate Motion (English)
            </label>
            <textarea
              required
              rows={2}
              placeholder="This House believes that.."
              value={topicEn}
              onChange={(e) => setTopicEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Date, Meet Link, Time-lock, and Status (when editing) */}
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Google Meet Link
            </label>
            <input
              type="url"
              required
              placeholder="https://meet.google.com/xyz-abcd-efg"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Time-Lock Window (5 to 7 mins before)
            </label>
            <select
              value={unlockMinutes}
              onChange={(e) => setUnlockMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={5}>5 minutes before start</option>
              <option value={6}>6 minutes before start (Recommended)</option>
              <option value={7}>7 minutes before start</option>
            </select>
          </div>
        </div>

        {/* Status Dropdown (only when editing) */}
        {editingDebateId && (
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Debate Status / অবস্থা
            </label>
            <select
              value={debateStatus}
              onChange={(e) => setDebateStatus(e.target.value as 'scheduled' | 'live' | 'completed' | 'cancelled')}
              className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="scheduled">Scheduled (নির্ধারিত / আসন্ন)</option>
              <option value="live">Live (চলমান)</option>
              <option value="completed">Completed (সম্পন্ন)</option>
              <option value="cancelled">Cancelled (বাতিল)</option>
            </select>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {editingDebateId ? (
            <>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-600/20 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover transition-all flex items-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'bn' ? 'শিডিউল প্রকাশ করুন' : 'Publish Schedule'}</span>
            </button>
          )}
        </div>
      </form>

      {/* ─── Existing Debates List with Edit & Delete Actions ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Scheduled & Concluded Debates ({debates.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? 'এডিট বা ডিলিট করতে অ্যাকশন বাটন ব্যবহার করুন' : 'Use actions to edit or delete any debate'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {debates.map((deb) => (
            <div
              key={deb.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                editingDebateId === deb.id ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="font-bold text-slate-900 dark:text-white block text-sm leading-snug">
                  {loc(deb.topic)}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 font-mono text-[11px]">
                  <span>{new Date(deb.scheduledAt).toLocaleString()}</span>
                  <span>• Unlock: {deb.unlockMinutesBefore || 6}m prior</span>
                  <span className="truncate max-w-xs">• Link: {deb.meetLink}</span>
                </div>
              </div>

              {/* Status Badge + Action Buttons (Edit & Delete) */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    deb.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : deb.status === 'live'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                      : deb.status === 'cancelled'
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {deb.status}
                </span>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleStartEdit(deb)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center gap-1"
                  title="Edit debate"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteDebate(deb.id, loc(deb.topic))}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold transition-colors flex items-center gap-1"
                  title="Delete debate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}

          {debates.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No debates scheduled yet. Use the form above to publish your first debate session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
