'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strictly validate Gmail domain
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setErrorMessage(
        language === 'bn'
          ? 'শুধুমাত্র বৈধ জিমেইল (@gmail.com) অ্যাকাউন্ট দিয়ে লগইন করা সম্ভব।'
          : 'Login is strictly restricted to valid @gmail.com accounts only.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        router.push('/');
      } else {
        setErrorMessage(data.error || 'Failed to login.');
      }
    } catch {
      setErrorMessage('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
            ডি
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('gmailOnlyNotice')}
          </p>
        </div>

        {/* Demo Admin & Debater Credentials Helper */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডেমো টেস্ট অ্যাকাউন্টসমূহ:' : 'Quick Testing Accounts:'}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] space-y-0.5">
            <div>• Admin: <span className="text-slate-800 dark:text-slate-200 font-bold">admin@gmail.com</span> / <span className="text-slate-800 dark:text-slate-200 font-bold">AdminPassword123!</span></div>
            <div>• Debater: <span className="text-slate-800 dark:text-slate-200 font-bold">zahidmaxshahi@gmail.com</span> / <span className="text-slate-800 dark:text-slate-200 font-bold">DebaterPassword123!</span></div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t('gmailAddress')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? t('loading') : t('navLogin')}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>{t('dontHaveAccount')}? </span>
          <Link href="/register" className="font-bold text-theme-primary hover:underline">
            {t('navRegister')}
          </Link>
        </div>
      </div>
    </div>
  );
}
