'use client';

import React from 'react';
import ChatRoom from '@/components/ChatRoom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { MessageSquare, Lock, LogIn } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme-primary text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('chatTitle')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {language === 'bn' ? 'বিতর্ক ফোরাম ও দলীয় গ্রুপ চ্যাট' : 'Communication Center & Forum'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {t('chatSubtitle')}
        </p>
      </div>

      {user ? (
        <ChatRoom />
      ) : (
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {language === 'bn' ? 'চ্যাটরুমে প্রবেশ করতে লগইন করুন' : 'Authentication Required for Chat'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ডিবেটিং এডুকেশন সোসাইটির সার্বজনীন চ্যাট এবং প্রাইভেট টিম গ্রুপে বার্তা পাঠাতে আপনার নিবন্ধিত জিমেইল দিয়ে লগইন করুন।'
              : 'Sign in with your verified Gmail account to participate in universal debate discussions and assigned team rooms.'}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-md shadow-emerald-700/20 hover:bg-theme-hover transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('navLogin')}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
