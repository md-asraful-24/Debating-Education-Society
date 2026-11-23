'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Debate, User, WinningTeamMember } from '@/lib/types';
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
  Award,
  Trophy,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronDown,
} from 'lucide-react';

export default function DebateManager() {
  const { t, loc, language } = useLanguage();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form States - Basics
  const [editingDebateId, setEditingDebateId] = useState<string | null>(null);
  const [topicBn, setTopicBn] = useState('');
  const [topicEn, setTopicEn] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/new');
  const [unlockMinutes, setUnlockMinutes] = useState(6);
  const [debateStatus, setDebateStatus] = useState<'scheduled' | 'live' | 'completed' | 'cancelled'>('scheduled');

  // Form States - Team A (Government / সরকারি দল)
  const [teamAName, setTeamAName] = useState('সরকারি দল (Team Alpha)');
  const [teamAMember1Name, setTeamAMember1Name] = useState('');
  const [teamAMember1Role, setTeamAMember1Role] = useState('প্রধানমন্ত্রী (Prime Minister)');
  const [teamAMember2Name, setTeamAMember2Name] = useState('');
  const [teamAMember2Role, setTeamAMember2Role] = useState('উপনেতা (Deputy Leader)');
  const [teamAMember3Name, setTeamAMember3Name] = useState('');
  const [teamAMember3Role, setTeamAMember3Role] = useState('সদস্য (Government Member)');

  // Form States - Team B (Opposition / বিরোধী দল)
  const [teamBName, setTeamBName] = useState('বিরোধী দল (Team Beta)');
  const [teamBMember1Name, setTeamBMember1Name] = useState('');
  const [teamBMember1Role, setTeamBMember1Role] = useState('বিরোধী দলীয় নেতা (Leader of Opposition)');
  const [teamBMember2Name, setTeamBMember2Name] = useState('');
  const [teamBMember2Role, setTeamBMember2Role] = useState('উপ-বিরোধী দলীয় নেতা (Deputy Leader)');
  const [teamBMember3Name, setTeamBMember3Name] = useState('');
  const [teamBMember3Role, setTeamBMember3Role] = useState('সদস্য (Opposition Member)');

  // Form States - Winner & Results ("jadolbijoihoba oikan taka jano bijoi dawaji")
  const [winnerChoice, setWinnerChoice] = useState<'none' | 'teamA' | 'teamB' | 'draw' | 'manual'>('none');
  const [winningTeamName, setWinningTeamName] = useState('');
  const [winningMember1Name, setWinningMember1Name] = useState('');
  const [winningMember1Role, setWinningMember1Role] = useState('প্রধানমন্ত্রী (Prime Minister)');
  const [winningMember2Name, setWinningMember2Name] = useState('');
  const [winningMember2Role, setWinningMember2Role] = useState('উপনেতা (Deputy Leader)');
  const [winningMember3Name, setWinningMember3Name] = useState('');
  const [winningMember3Role, setWinningMember3Role] = useState('সদস্য (Member)');
  const [bestDebater, setBestDebater] = useState('');
  const [scoreA, setScoreA] = useState(82.5);
  const [scoreB, setScoreB] = useState(80.0);
  const [judgeRemarksBn, setJudgeRemarksBn] = useState('');
  const [judgeRemarksEn, setJudgeRemarksEn] = useState('');

  // Quick Winner Modal for Debate in List
  const [quickResultDebate, setQuickResultDebate] = useState<Debate | null>(null);
  const [quickWinnerChoice, setQuickWinnerChoice] = useState<'teamA' | 'teamB' | 'draw' | 'manual'>('teamA');
  const [quickWinningTeamName, setQuickWinningTeamName] = useState('');
  const [quickMember1Name, setQuickMember1Name] = useState('');
  const [quickMember1Role, setQuickMember1Role] = useState('প্রধানমন্ত্রী (Prime Minister)');
  const [quickMember2Name, setQuickMember2Name] = useState('');
  const [quickMember2Role, setQuickMember2Role] = useState('উপনেতা (Deputy Leader)');
  const [quickMember3Name, setQuickMember3Name] = useState('');
  const [quickMember3Role, setQuickMember3Role] = useState('সদস্য (Member)');
  const [quickBestDebater, setQuickBestDebater] = useState('');
  const [quickScoreA, setQuickScoreA] = useState(82.5);
  const [quickScoreB, setQuickScoreB] = useState(80.0);
  const [quickRemarksBn, setQuickRemarksBn] = useState('');
  const [quickRemarksEn, setQuickRemarksEn] = useState('');

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

  // Handle Quick Auto-Fill Winner in Form
  const handleWinnerChoiceChange = (choice: 'none' | 'teamA' | 'teamB' | 'draw' | 'manual') => {
    setWinnerChoice(choice);
    if (choice === 'teamA') {
      setWinningTeamName(teamAName || 'সরকারি দল (Team Alpha)');
      setWinningMember1Name(teamAMember1Name);
      setWinningMember1Role(teamAMember1Role || 'প্রধানমন্ত্রী (Prime Minister)');
      setWinningMember2Name(teamAMember2Name);
      setWinningMember2Role(teamAMember2Role || 'উপনেতা (Deputy Leader)');
      setWinningMember3Name(teamAMember3Name);
      setWinningMember3Role(teamAMember3Role || 'সদস্য (Government Member)');
      if (teamAMember1Name) {
        setBestDebater(`${teamAMember1Name} (${teamAName || 'সরকারি দল'})`);
      }
      setDebateStatus('completed');
    } else if (choice === 'teamB') {
      setWinningTeamName(teamBName || 'বিরোধী দল (Team Beta)');
      setWinningMember1Name(teamBMember1Name);
      setWinningMember1Role(teamBMember1Role || 'বিরোধী দলীয় নেতা (Leader of Opposition)');
      setWinningMember2Name(teamBMember2Name);
      setWinningMember2Role(teamBMember2Role || 'উপ-বিরোধী দলীয় নেতা (Deputy Leader)');
      setWinningMember3Name(teamBMember3Name);
      setWinningMember3Role(teamBMember3Role || 'সদস্য (Opposition Member)');
      if (teamBMember1Name) {
        setBestDebater(`${teamBMember1Name} (${teamBName || 'বিরোধী দল'})`);
      }
      setDebateStatus('completed');
    } else if (choice === 'draw') {
      setWinningTeamName('অমিমাংসিত (Draw / Tied)');
      setWinningMember1Name('');
      setWinningMember2Name('');
      setWinningMember3Name('');
      setDebateStatus('completed');
    } else if (choice === 'manual') {
      if (!winningTeamName) setWinningTeamName('');
    } else {
      // none
      setWinningTeamName('');
      setWinningMember1Name('');
      setWinningMember2Name('');
      setWinningMember3Name('');
      setBestDebater('');
    }
  };

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

    // Team A
    setTeamAName(deb.teamA?.name || 'সরকারি দল (Team Alpha)');
    const aMems = deb.teamA?.members || [];
    setTeamAMember1Name(aMems[0]?.name || '');
    setTeamAMember1Role(aMems[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
    setTeamAMember2Name(aMems[1]?.name || '');
    setTeamAMember2Role(aMems[1]?.role || 'উপনেতা (Deputy Leader)');
    setTeamAMember3Name(aMems[2]?.name || '');
    setTeamAMember3Role(aMems[2]?.role || 'সদস্য (Government Member)');

    // Team B
    setTeamBName(deb.teamB?.name || 'বিরোধী দল (Team Beta)');
    const bMems = deb.teamB?.members || [];
    setTeamBMember1Name(bMems[0]?.name || '');
    setTeamBMember1Role(bMems[0]?.role || 'বিরোধী দলীয় নেতা (Leader of Opposition)');
    setTeamBMember2Name(bMems[1]?.name || '');
    setTeamBMember2Role(bMems[1]?.role || 'উপ-বিরোধী দলীয় নেতা (Deputy Leader)');
    setTeamBMember3Name(bMems[2]?.name || '');
    setTeamBMember3Role(bMems[2]?.role || 'সদস্য (Opposition Member)');

    // Winner / Result
    if (deb.result) {
      setWinnerChoice(
        deb.result.winnerTeam === 'teamA' || deb.result.winnerTeam === 'teamB' || deb.result.winnerTeam === 'draw'
          ? (deb.result.winnerTeam as 'teamA' | 'teamB' | 'draw')
          : 'manual'
      );
      setWinningTeamName(deb.result.winningTeamName || '');
      const winMems = deb.result.winningMembers || [];
      setWinningMember1Name(winMems[0]?.name || '');
      setWinningMember1Role(winMems[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
      setWinningMember2Name(winMems[1]?.name || '');
      setWinningMember2Role(winMems[1]?.role || 'উপনেতা (Deputy Leader)');
      setWinningMember3Name(winMems[2]?.name || '');
      setWinningMember3Role(winMems[2]?.role || 'সদস্য (Member)');
      setBestDebater(deb.result.bestDebater || '');
      setScoreA(deb.result.scoreA ?? 82.5);
      setScoreB(deb.result.scoreB ?? 80.0);
      setJudgeRemarksBn(deb.result.judgeRemarks?.bn || '');
      setJudgeRemarksEn(deb.result.judgeRemarks?.en || '');
    } else {
      setWinnerChoice('none');
      setWinningTeamName('');
      setWinningMember1Name('');
      setWinningMember2Name('');
      setWinningMember3Name('');
      setBestDebater('');
      setScoreA(82.5);
      setScoreB(80.0);
      setJudgeRemarksBn('');
      setJudgeRemarksEn('');
    }

    setErrorMsg(null);
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

    setTeamAName('সরকারি দল (Team Alpha)');
    setTeamAMember1Name('');
    setTeamAMember2Name('');
    setTeamAMember3Name('');

    setTeamBName('বিরোধী দল (Team Beta)');
    setTeamBMember1Name('');
    setTeamBMember2Name('');
    setTeamBMember3Name('');

    setWinnerChoice('none');
    setWinningTeamName('');
    setWinningMember1Name('');
    setWinningMember2Name('');
    setWinningMember3Name('');
    setBestDebater('');
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

  // Main Form Submit: Handles Topic, Schedule, Teams & Results in ONE go!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!topicBn.trim() || !topicEn.trim() || !scheduledAt) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে বাংলা ও ইংরেজি বিষয় এবং নির্ধারিত তারিখ ও সময় পূরণ করুন।' : 'Please fill in both Bengali & English motions and scheduled date.');
      return;
    }

    const teamAData = {
      name: teamAName.trim() || 'সরকারি দল (Team Alpha)',
      members: [
        { name: teamAMember1Name.trim(), role: teamAMember1Role.trim() },
        { name: teamAMember2Name.trim(), role: teamAMember2Role.trim() },
        { name: teamAMember3Name.trim(), role: teamAMember3Role.trim() },
      ].filter((m) => m.name.length > 0),
    };

    const teamBData = {
      name: teamBName.trim() || 'বিরোধী দল (Team Beta)',
      members: [
        { name: teamBMember1Name.trim(), role: teamBMember1Role.trim() },
        { name: teamBMember2Name.trim(), role: teamBMember2Role.trim() },
        { name: teamBMember3Name.trim(), role: teamBMember3Role.trim() },
      ].filter((m) => m.name.length > 0),
    };

    let resultData = null;
    if (winnerChoice !== 'none' || winningTeamName.trim()) {
      const winMembers: WinningTeamMember[] = [
        { name: winningMember1Name.trim(), role: winningMember1Role.trim() },
        { name: winningMember2Name.trim(), role: winningMember2Role.trim() },
        { name: winningMember3Name.trim(), role: winningMember3Role.trim() },
      ].filter((m) => m.name.length > 0);

      resultData = {
        winnerTeam: winnerChoice === 'none' ? 'custom' : winnerChoice,
        winningTeamName: winningTeamName.trim() || (winnerChoice === 'teamB' ? teamBData.name : teamAData.name),
        winningMembers: winMembers,
        bestDebater: bestDebater.trim(),
        scoreA: Number(scoreA) || 0,
        scoreB: Number(scoreB) || 0,
        publishedAt: new Date().toISOString(),
        judgeRemarks: { bn: judgeRemarksBn.trim(), en: judgeRemarksEn.trim() },
      };
    }

    const payload = {
      topic: { bn: topicBn.trim(), en: topicEn.trim() },
      scheduledAt: new Date(scheduledAt).toISOString(),
      durationMinutes: 60,
      meetLink: meetLink.trim(),
      unlockMinutesBefore: Number(unlockMinutes) || 6,
      status: resultData ? 'completed' : debateStatus,
      teamA: teamAData,
      teamB: teamBData,
      result: resultData,
    };

    if (editingDebateId) {
      // UPDATE EXISTING DEBATE (PUT)
      try {
        const res = await fetch('/api/debates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingDebateId, ...payload }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatusMsg(
            language === 'bn'
              ? 'বিতর্ক সূচি, গ্রুপ ও ফলাফল সফলভাবে আপডেট করা হয়েছে!'
              : 'Debate schedule, groups and results updated successfully!'
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
      try {
        const res = await fetch('/api/debates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          setStatusMsg(
            language === 'bn'
              ? 'নতুন বিতর্ক, গ্রুপ বিন্যাস ও ফলাফল সফলভাবে তৈরি করা হয়েছে!'
              : 'New debate, groups and results successfully scheduled!'
          );
          handleCancelEdit();
          fetchDebates();
          setTimeout(() => setStatusMsg(null), 3500);
        } else {
          setErrorMsg(data.error || 'Failed to schedule debate.');
        }
      } catch {
        setErrorMsg('Network error while scheduling debate.');
      }
    }
  };

  // Open Quick Winner Modal for a specific debate from the list below
  const openQuickResultModal = (deb: Debate) => {
    setQuickResultDebate(deb);
    const existing = deb.result;
    if (existing) {
      setQuickWinnerChoice(
        existing.winnerTeam === 'teamA' || existing.winnerTeam === 'teamB' || existing.winnerTeam === 'draw'
          ? (existing.winnerTeam as 'teamA' | 'teamB' | 'draw')
          : 'manual'
      );
      setQuickWinningTeamName(existing.winningTeamName || '');
      const mems = existing.winningMembers || [];
      setQuickMember1Name(mems[0]?.name || '');
      setQuickMember1Role(mems[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
      setQuickMember2Name(mems[1]?.name || '');
      setQuickMember2Role(mems[1]?.role || 'উপনেতা (Deputy Leader)');
      setQuickMember3Name(mems[2]?.name || '');
      setQuickMember3Role(mems[2]?.role || 'সদস্য (Member)');
      setQuickBestDebater(existing.bestDebater || '');
      setQuickScoreA(existing.scoreA ?? 82.5);
      setQuickScoreB(existing.scoreB ?? 80.0);
      setQuickRemarksBn(existing.judgeRemarks?.bn || '');
      setQuickRemarksEn(existing.judgeRemarks?.en || '');
    } else {
      // Default to Team A winner
      setQuickWinnerChoice('teamA');
      setQuickWinningTeamName(deb.teamA?.name || 'সরকারি দল (Team Alpha)');
      const aMems = deb.teamA?.members || [];
      setQuickMember1Name(aMems[0]?.name || '');
      setQuickMember1Role(aMems[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
      setQuickMember2Name(aMems[1]?.name || '');
      setQuickMember2Role(aMems[1]?.role || 'উপনেতা (Deputy Leader)');
      setQuickMember3Name(aMems[2]?.name || '');
      setQuickMember3Role(aMems[2]?.role || 'সদস্য (Government Member)');
      setQuickBestDebater(aMems[0]?.name ? `${aMems[0].name} (${deb.teamA?.name || 'সরকারি দল'})` : '');
      setQuickScoreA(82.5);
      setQuickScoreB(80.0);
      setQuickRemarksBn('');
      setQuickRemarksEn('');
    }
  };

  const handleQuickWinnerChoiceChange = (choice: 'teamA' | 'teamB' | 'draw' | 'manual') => {
    setQuickWinnerChoice(choice);
    if (!quickResultDebate) return;

    if (choice === 'teamA') {
      setQuickWinningTeamName(quickResultDebate.teamA?.name || 'সরকারি দল (Team Alpha)');
      const m = quickResultDebate.teamA?.members || [];
      setQuickMember1Name(m[0]?.name || '');
      setQuickMember1Role(m[0]?.role || 'প্রধানমন্ত্রী (Prime Minister)');
      setQuickMember2Name(m[1]?.name || '');
      setQuickMember2Role(m[1]?.role || 'উপনেতা (Deputy Leader)');
      setQuickMember3Name(m[2]?.name || '');
      setQuickMember3Role(m[2]?.role || 'সদস্য (Government Member)');
      if (m[0]?.name) setQuickBestDebater(`${m[0].name} (${quickResultDebate.teamA?.name || 'সরকারি দল'})`);
    } else if (choice === 'teamB') {
      setQuickWinningTeamName(quickResultDebate.teamB?.name || 'বিরোধী দল (Team Beta)');
      const m = quickResultDebate.teamB?.members || [];
      setQuickMember1Name(m[0]?.name || '');
      setQuickMember1Role(m[0]?.role || 'বিরোধী দলীয় নেতা (Leader of Opposition)');
      setQuickMember2Name(m[1]?.name || '');
      setQuickMember2Role(m[1]?.role || 'উপ-বিরোধী দলীয় নেতা (Deputy Leader)');
      setQuickMember3Name(m[2]?.name || '');
      setQuickMember3Role(m[2]?.role || 'সদস্য (Opposition Member)');
      if (m[0]?.name) setQuickBestDebater(`${m[0].name} (${quickResultDebate.teamB?.name || 'বিরোধী দল'})`);
    } else if (choice === 'draw') {
      setQuickWinningTeamName('অমিমাংসিত (Draw / Tied)');
      setQuickMember1Name('');
      setQuickMember2Name('');
      setQuickMember3Name('');
    }
  };

  const handleSaveQuickResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickResultDebate) return;

    const winMembers: WinningTeamMember[] = [
      { name: quickMember1Name.trim(), role: quickMember1Role.trim() },
      { name: quickMember2Name.trim(), role: quickMember2Role.trim() },
      { name: quickMember3Name.trim(), role: quickMember3Role.trim() },
    ].filter((m) => m.name.length > 0);

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debateId: quickResultDebate.id,
          result: {
            winnerTeam: quickWinnerChoice,
            winningTeamName: quickWinningTeamName.trim() || 'Champion Team',
            winningMembers: winMembers,
            bestDebater: quickBestDebater.trim(),
            scoreA: Number(quickScoreA) || 0,
            scoreB: Number(quickScoreB) || 0,
            judgeRemarks: { bn: quickRemarksBn.trim(), en: quickRemarksEn.trim() },
          },
        }),
      });

      if (res.ok) {
        setStatusMsg(language === 'bn' ? 'বিজয়ী ও ফলাফল সফলভাবে প্রকাশিত হয়েছে!' : 'Winner and results published successfully!');
        setQuickResultDebate(null);
        fetchDebates();
        setTimeout(() => setStatusMsg(null), 3500);
      } else {
        alert('Failed to publish result.');
      }
    } catch {
      alert('Network error while publishing result.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-theme-primary" />
          <span>{language === 'bn' ? 'বিতর্ক সূচি, গ্রুপ বিন্যাস ও ফলাফল' : 'Debate Schedule, Groups & Results'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'একই জায়গায় যাবতীয় তথ্য দিন: বিতর্ক শিডিউল, ২ দলের গ্রুপ বিন্যাস (সদস্য ও পদবী) এবং যে দল বিজয়ী হবে সরাসরি বিজয়ী ঘোষণা করুন।'
            : 'All-in-one management: Schedule debate, setup Team A & Team B members with roles, and declare winner right here.'}
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

      {/* Main Unified Form: Schedule + Groups + Winner */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {editingDebateId ? (
              <>
                <Edit3 className="w-4 h-4 text-blue-500" />
                <span>{language === 'bn' ? 'বিতর্ক সূচি, গ্রুপ ও ফলাফল সম্পাদনা (Edit)' : 'Edit Debate, Groups & Results'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>{language === 'bn' ? '+ নতুন বিতর্ক শিডিউল ও গ্রুপ বিন্যাস' : '+ Schedule New Debate & Groups'}</span>
              </>
            )}
          </h3>

          {editingDebateId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-600 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাতিল' : 'Cancel'}</span>
            </button>
          )}
        </div>

        {/* SECTION 1: TOPIC & SCHEDULE */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'বিতর্কের বিষয় / মোশন (বাংলা)' : 'Debate Motion (Bangla)'} *
              </label>
              <textarea
                value={topicBn}
                onChange={(e) => setTopicBn(e.target.value)}
                placeholder="এই সংসদ মনে করে যে..."
                rows={2}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'বিতর্কের বিষয় / মোশন (English)' : 'Debate Motion (English)'} *
              </label>
              <textarea
                value={topicEn}
                onChange={(e) => setTopicEn(e.target.value)}
                placeholder="This House believes that..."
                rows={2}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-theme-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'নির্ধারিত তারিখ ও সময়' : 'Scheduled Date & Time'} *
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'গুগল মিট লিঙ্ক' : 'Google Meet Link'}
              </label>
              <input
                type="url"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'টাইম-লক আনলক উইন্ডো' : 'Time-Lock Window'}
              </label>
              <select
                value={unlockMinutes}
                onChange={(e) => setUnlockMinutes(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-theme-primary"
              >
                <option value={5}>5 minutes before start</option>
                <option value={6}>6 minutes before start (Recommended)</option>
                <option value={7}>7 minutes before start</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: GROUP SETUP (গ্রুপ বিন্যাস - সরকারি ও বিরোধী দল) */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-theme-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {language === 'bn' ? 'গ্রুপ বিন্যাস (২ দলের সদস্য ও দায়িত্ব/পদবী)' : 'Group Assignments (Teams, Members & Roles)'}
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Team A / Government Team Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-950/60">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>দল ১ / সরকারি দল (Team A)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">৩ জন তার্কিক</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  দলের নাম (Team Name):
                </label>
                <input
                  type="text"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  placeholder="সরকারি দল (Team Alpha)"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              {/* 3 Members for Team A */}
              <div className="space-y-2 pt-1">
                {/* Member 1 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">১ম তার্কিক / প্রধানমন্ত্রী</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamAMember1Name}
                      onChange={(e) => setTeamAMember1Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamAMember1Role}
                      onChange={(e) => setTeamAMember1Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>

                {/* Member 2 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">২য় তার্কিক / উপনেতা</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamAMember2Name}
                      onChange={(e) => setTeamAMember2Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamAMember2Role}
                      onChange={(e) => setTeamAMember2Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>

                {/* Member 3 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">৩য় তার্কিক / সদস্য</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamAMember3Name}
                      onChange={(e) => setTeamAMember3Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamAMember3Role}
                      onChange={(e) => setTeamAMember3Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team B / Opposition Team Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100 dark:border-blue-950/60">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>দল ২ / বিরোধী দল (Team B)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">৩ জন তার্কিক</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  দলের নাম (Team Name):
                </label>
                <input
                  type="text"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  placeholder="বিরোধী দল (Team Beta)"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* 3 Members for Team B */}
              <div className="space-y-2 pt-1">
                {/* Member 1 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">১ম তার্কিক / বিরোধী দলীয় নেতা</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamBMember1Name}
                      onChange={(e) => setTeamBMember1Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamBMember1Role}
                      onChange={(e) => setTeamBMember1Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>

                {/* Member 2 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">২য় তার্কিক / উপ-বিরোধী দলীয় নেতা</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamBMember2Name}
                      onChange={(e) => setTeamBMember2Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamBMember2Role}
                      onChange={(e) => setTeamBMember2Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>

                {/* Member 3 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">৩য় তার্কিক / সদস্য</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamBMember3Name}
                      onChange={(e) => setTeamBMember3Name(e.target.value)}
                      placeholder="নাম (Name)"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={teamBMember3Role}
                      onChange={(e) => setTeamBMember3Role(e.target.value)}
                      placeholder="দায়িত্ব / পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WINNER & RESULTS (বিজয়ী দল নির্বাচন ও ফলাফল সরাসরি এখান থেকেই) */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {language === 'bn' ? 'বিজয়ী দল নির্বাচন ও ফলাফল (যে দল বিজয়ী হবে এখান থেকেই দেওয়া যাবে)' : 'Declare Winner & Publish Results'}
              </h4>
            </div>

            {/* Quick Winner Selection Buttons */}
            <div className="flex items-center flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleWinnerChoiceChange('none')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  winnerChoice === 'none'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                ফলাফল বাকি
              </button>

              <button
                type="button"
                onClick={() => handleWinnerChoiceChange('teamA')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 ${
                  winnerChoice === 'teamA'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>দল ১ বিজয়ী</span>
              </button>

              <button
                type="button"
                onClick={() => handleWinnerChoiceChange('teamB')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 ${
                  winnerChoice === 'teamB'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>দল ২ বিজয়ী</span>
              </button>

              <button
                type="button"
                onClick={() => handleWinnerChoiceChange('draw')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  winnerChoice === 'draw'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300'
                }`}
              >
                ড্র (Draw)
              </button>

              <button
                type="button"
                onClick={() => handleWinnerChoiceChange('manual')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  winnerChoice === 'manual'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300'
                }`}
              >
                ম্যানুয়াল বিজয়ী
              </button>
            </div>
          </div>

          {winnerChoice !== 'none' && (
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/15 border border-amber-200/80 dark:border-amber-800/40 space-y-4">
              {/* Winning Team Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  বিজয়ী দলের নাম (যেকোনো নাম সরাসরি টাইপ বা এডিট করতে পারেন):
                </label>
                <input
                  type="text"
                  value={winningTeamName}
                  onChange={(e) => setWinningTeamName(e.target.value)}
                  placeholder="সরকারি দল (Team Alpha) / বিজয়ী দলের নাম"
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-amber-500"
                />
              </div>

              {/* 3 Winning Members & Roles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>বিজয়ী দলের ৩ জন সদস্য ও দায়িত্ব/পদবী:</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">সদস্য ১ (Member 1)</span>
                    <input
                      type="text"
                      value={winningMember1Name}
                      onChange={(e) => setWinningMember1Name(e.target.value)}
                      placeholder="নাম"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      value={winningMember1Role}
                      onChange={(e) => setWinningMember1Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-500"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">সদস্য ২ (Member 2)</span>
                    <input
                      type="text"
                      value={winningMember2Name}
                      onChange={(e) => setWinningMember2Name(e.target.value)}
                      placeholder="নাম"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      value={winningMember2Role}
                      onChange={(e) => setWinningMember2Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-500"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">সদস্য ৩ (Member 3)</span>
                    <input
                      type="text"
                      value={winningMember3Name}
                      onChange={(e) => setWinningMember3Name(e.target.value)}
                      placeholder="নাম"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      value={winningMember3Role}
                      onChange={(e) => setWinningMember3Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Best Debater & Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সেরা বক্তা / তার্কিক (Best Speaker):</span>
                  </label>
                  <input
                    type="text"
                    value={bestDebater}
                    onChange={(e) => setBestDebater(e.target.value)}
                    placeholder="নাম ও দল/পদবী"
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দল ১ স্কোর (Team A Score):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={scoreA}
                    onChange={(e) => setScoreA(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দল ২ স্কোর (Team B Score):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={scoreB}
                    onChange={(e) => setScoreB(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    বিচারকের মন্তব্য (বাংলা):
                  </label>
                  <input
                    type="text"
                    value={judgeRemarksBn}
                    onChange={(e) => setJudgeRemarksBn(e.target.value)}
                    placeholder="বিচারকমণ্ডলীর সামগ্রিক বিশ্লেষণ..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Judge Remarks (English):
                  </label>
                  <input
                    type="text"
                    value={judgeRemarksEn}
                    onChange={(e) => setJudgeRemarksEn(e.target.value)}
                    placeholder="Adjudication notes..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">স্ট্যাটাস:</label>
            <select
              value={debateStatus}
              onChange={(e) => setDebateStatus(e.target.value as any)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-bold"
            >
              <option value="scheduled">Scheduled (শিডিউল)</option>
              <option value="live">Live (লাইভ)</option>
              <option value="completed">Completed (সম্পন্ন)</option>
              <option value="cancelled">Cancelled (বাতিল)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-theme-primary text-white hover:bg-theme-hover transition flex items-center gap-2 shadow-sm"
          >
            {editingDebateId ? (
              <>
                <Save className="w-4 h-4" />
                <span>{language === 'bn' ? 'সব পরিবর্তন সংরক্ষণ করুন' : 'Save All Changes'}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>{language === 'bn' ? 'শিডিউল ও গ্রুপ সংরক্ষণ করুন' : 'Publish Schedule & Groups'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* SECTION 4: SCHEDULED & CONCLUDED DEBATES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'bn'
              ? `তালিকাবদ্ধ ও সম্পন্ন বিতর্কসমূহ (${debates.length})`
              : `Scheduled & Concluded Debates (${debates.length})`}
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? 'ফলাফল দিতে 🏆 আইকনে ক্লিক করুন' : 'Click 🏆 to declare winner'}
          </span>
        </div>

        <div className="space-y-4">
          {debates.map((deb) => (
            <div
              key={deb.id}
              className={`p-5 rounded-2xl border transition-all ${
                editingDebateId === deb.id
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Debate Details */}
                <div className="space-y-2.5 flex-1">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      {loc(deb.topic)}
                    </h4>
                    {deb.topic.en && deb.topic.en !== loc(deb.topic) && (
                      <p className="text-xs text-slate-500 mt-0.5">{deb.topic.en}</p>
                    )}
                  </div>

                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-theme-primary" />
                      <span>{new Date(deb.scheduledAt).toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Unlock: {deb.unlockMinutesBefore || 6}m prior</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{deb.meetLink}</span>
                    </span>
                  </div>

                  {/* Groups View (Team A vs Team B) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30 text-xs space-y-1.5">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                        <span>{deb.teamA?.name || 'দল ১ (Team Alpha)'}</span>
                        <span className="text-[10px] font-normal opacity-75">সরকারি দল</span>
                      </div>
                      <ul className="space-y-0.5 pl-3 list-disc text-slate-600 dark:text-slate-300 text-[11px]">
                        {(deb.teamA?.members || []).map((m, idx) => (
                          <li key={idx}>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                            {m.role && <span className="text-slate-500 dark:text-slate-400"> — {m.role}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/30 text-xs space-y-1.5">
                      <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center justify-between">
                        <span>{deb.teamB?.name || 'দল ২ (Team Beta)'}</span>
                        <span className="text-[10px] font-normal opacity-75">বিরোধী দল</span>
                      </div>
                      <ul className="space-y-0.5 pl-3 list-disc text-slate-600 dark:text-slate-300 text-[11px]">
                        {(deb.teamB?.members || []).map((m, idx) => (
                          <li key={idx}>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                            {m.role && <span className="text-slate-500 dark:text-slate-400"> — {m.role}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Highlighted Result Badge if Published */}
                  {deb.result && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-900 dark:text-amber-200">
                            বিজয়ী: {deb.result.winningTeamName || (deb.result.winnerTeam === 'teamB' ? deb.teamB.name : deb.teamA.name)}
                          </span>
                          {deb.result.bestDebater && (
                            <span className="ml-2 text-slate-600 dark:text-slate-300 text-[11px]">
                              | সেরা তার্কিক: <strong className="text-emerald-600">{deb.result.bestDebater}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {deb.result.scoreA} : {deb.result.scoreB}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status & Action Buttons */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      deb.status === 'live'
                        ? 'bg-red-500 text-white animate-pulse'
                        : deb.status === 'completed'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {deb.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Quick Declare/Edit Winner Button */}
                    <button
                      type="button"
                      onClick={() => openQuickResultModal(deb)}
                      title="বিজয়ী নির্ধারণ ও ফলাফল প্রকাশ"
                      className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{deb.result ? 'ফলাফল এডিট' : 'বিজয়ী দিন'}</span>
                    </button>

                    {/* Full Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(deb)}
                      title="Edit all debate details"
                      className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition border border-slate-200 dark:border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteDebate(deb.id, loc(deb.topic))}
                      title="Delete debate session"
                      className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition border border-slate-200 dark:border-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {debates.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              এখনও কোনো বিতর্ক সেশন তৈরি করা হয়নি।
            </div>
          )}
        </div>
      </div>

      {/* QUICK WINNER MODAL */}
      {quickResultDebate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  বিজয়ী ঘোষণা ও ফলাফল প্রকাশ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickResultDebate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold">বিষয়: </span>
              {loc(quickResultDebate.topic)}
            </div>

            <form onSubmit={handleSaveQuickResult} className="space-y-4">
              {/* Winner Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  কোন দল বিজয়ী হয়েছে নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickWinnerChoiceChange('teamA')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      quickWinnerChoice === 'teamA'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                    }`}
                  >
                    🏆 দল ১ (সরকারি দল)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickWinnerChoiceChange('teamB')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      quickWinnerChoice === 'teamB'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-300'
                    }`}
                  >
                    🏆 দল ২ (বিরোধী দল)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickWinnerChoiceChange('draw')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      quickWinnerChoice === 'draw'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300'
                    }`}
                  >
                    🤝 অমিমাংসিত
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickWinnerChoiceChange('manual')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      quickWinnerChoice === 'manual'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-300'
                    }`}
                  >
                    ✍️ ম্যানুয়াল
                  </button>
                </div>
              </div>

              {/* Winning Team Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিজয়ী দলের নাম:
                </label>
                <input
                  type="text"
                  value={quickWinningTeamName}
                  onChange={(e) => setQuickWinningTeamName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  required
                />
              </div>

              {/* 3 Members */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  বিজয়ী দলের ৩ সদস্য ও দায়িত্ব:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
                    <input
                      type="text"
                      value={quickMember1Name}
                      onChange={(e) => setQuickMember1Name(e.target.value)}
                      placeholder="সদস্য ১"
                      className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={quickMember1Role}
                      onChange={(e) => setQuickMember1Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-[10px] p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500"
                    />
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
                    <input
                      type="text"
                      value={quickMember2Name}
                      onChange={(e) => setQuickMember2Name(e.target.value)}
                      placeholder="সদস্য ২"
                      className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={quickMember2Role}
                      onChange={(e) => setQuickMember2Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-[10px] p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500"
                    />
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
                    <input
                      type="text"
                      value={quickMember3Name}
                      onChange={(e) => setQuickMember3Name(e.target.value)}
                      placeholder="সদস্য ৩"
                      className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={quickMember3Role}
                      onChange={(e) => setQuickMember3Role(e.target.value)}
                      placeholder="পদবী"
                      className="w-full text-[10px] p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Best Debater & Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    সেরা তার্কিক (Best Debater):
                  </label>
                  <input
                    type="text"
                    value={quickBestDebater}
                    onChange={(e) => setQuickBestDebater(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    দল ১ স্কোর:
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={quickScoreA}
                    onChange={(e) => setQuickScoreA(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    দল ২ স্কোর:
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={quickScoreB}
                    onChange={(e) => setQuickScoreB(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickResultDebate(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>ফলাফল সংরক্ষণ ও প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
