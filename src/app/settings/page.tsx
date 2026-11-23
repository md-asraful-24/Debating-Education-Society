'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।'
          : 'New password and confirmation password do not match.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'New password must be at least 6 characters long.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(t('passwordChangedSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.error || 'Failed to update password.');
      }
    } catch {
      setErrorMessage('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Requirement 4: Clear Back Button inside settings views to return easily */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 text-theme-primary group-hover:-translate-x-1 transition-transform" />
          <span>{t('back')}</span>
        </button>

        <Link
          href="/"
          className="text-xs font-semibold text-theme-primary hover:underline"
        >
          {t('backToHome')}
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <KeyRound className="w-7 h-7 text-theme-primary" />
          <span>{t('settingsTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'bn'
            ? 'পাসওয়ার্ড পরিবর্তন ও ব্যক্তিগত তথ্য ব্যবস্থাপনা'
            : 'Manage security credentials and profile information'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            {language === 'bn' ? 'প্রোফাইল পরিচিতি' : 'Account Details'}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">{user?.name || 'Guest User'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{user?.email || 'Not logged in'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-theme-primary" />
              <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                {user?.role || 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('changePassword')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার অ্যাকাউন্টের সুরক্ষার জন্য শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।'
                : 'Keep your account secure with a strong password.'}
            </p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('newPassword')}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? t('loading') : t('save')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
