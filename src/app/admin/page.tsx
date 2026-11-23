'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import SliderManager from '@/components/Admin/SliderManager';
import UserManager from '@/components/Admin/UserManager';
import DebateManager from '@/components/Admin/DebateManager';
import ResultsManager from '@/components/Admin/ResultsManager';
import FooterEditor from '@/components/Admin/FooterEditor';
import ThemeSelector from '@/components/Admin/ThemeSelector';
import {
  Shield,
  Image as ImageIcon,
  Users,
  Calendar,
  Award,
  FileEdit,
  Palette,
  Lock,
  ArrowLeft,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    'sliders' | 'users' | 'debates' | 'footer' | 'themes'
  >('debates');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
        {t('loading')}
      </div>
    );
  }

  // Enforce server-side / client-side Role-Based Access Control (RBAC)
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'অননুমোদিত প্রবেশাধিকার (Restricted Access)' : 'Admin Authorization Required'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? 'এই নিয়ন্ত্রণ কেন্দ্রটি শুধুমাত্র ডিবেটিং এডুকেশন সোসাইটির স্বীকৃত প্রধান অ্যাডমিনদের জন্য সংরক্ষিত।'
              : 'This central administrative dashboard is strictly restricted to authenticated master administrators.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-theme-primary text-white hover:bg-theme-hover"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'debates', label: language === 'bn' ? 'বিতর্ক সূচি, গ্রুপ ও ফলাফল' : 'Debate Schedule, Groups & Results', icon: Calendar },
    { id: 'sliders', label: t('adminSliders'), icon: ImageIcon },
    { id: 'users', label: t('adminUsers'), icon: Users },
    { id: 'footer', label: t('adminFooter'), icon: FileEdit },
    { id: 'themes', label: t('adminThemes'), icon: Palette },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Master Administration Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('adminDashboard')}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ওয়েবসাইটের সমস্ত কনফিগারেশন, সদস্য, স্লাইডার, শিডিউল ও ডেটাবেজ ম্যানেজমেন্ট'
              : 'Full operational control over slides, debate groups, results, footer, and themes'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>Logged as: <strong className="font-mono text-emerald-600">{user?.email}</strong></span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${user?.role === 'super_admin' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                active
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4 opacity-80" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {activeTab === 'debates' && <DebateManager />}
        {activeTab === 'sliders' && <SliderManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'footer' && <FooterEditor />}
        {activeTab === 'themes' && <ThemeSelector />}
      </div>
    </div>
  );
}
