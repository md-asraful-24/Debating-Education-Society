'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import {
  Mail,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    // Strictly validate Gmail domain
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setErrorMessage(
        language === 'bn'
          ? 'নিবন্ধন শুধুমাত্র বৈধ জিমেইল (@gmail.com) অ্যাকাউন্ট দিয়ে সম্ভব।'
          : 'Registration is strictly limited to valid @gmail.com accounts only.'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        language === 'bn'
          ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep('otp');
        setInfoMessage(t('otpSentNotice'));
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        }
      } else {
        setErrorMessage(data.error || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        router.push('/');
      } else {
        setErrorMessage(data.error || 'OTP verification failed.');
      }
    } catch {
      setErrorMessage('Network error during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="auth" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {step === 'form' ? t('registerTitle') : t('enterOtp')}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'form' ? t('gmailOnlyNotice') : `Gmail: ${email}`}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Dev OTP Helper Banner */}
        {devOtp && step === 'otp' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'টেস্ট মোড ওটিপি কোড:' : 'Development Test OTP Code:'}</span>
            </div>
            <p className="font-mono text-base font-black text-amber-900 dark:text-amber-200 tracking-widest text-center py-1">
              {devOtp}
            </p>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 text-center">
              (Gmail SMTP credentials are ready to plug in via .env)
            </p>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('gmailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="username@gmail.com"
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
              <KeyRound className="w-4 h-4" />
              <span>{loading ? t('loading') : t('navRegister')}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 text-center">
                {t('enterOtp')}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="XXXXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full tracking-[8px] text-center font-mono font-bold text-2xl py-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-500 block text-center mt-1">
                {language === 'bn' ? 'মেয়াদ ৫ মিনিট' : 'Expires in 5 minutes'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? t('loading') : t('verifyAndRegister')}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              {language === 'bn' ? 'ইমেইল পরিবর্তন করতে ফিরে যান' : 'Back to change email'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>{t('alreadyHaveAccount')}? </span>
          <Link href="/login" className="font-bold text-theme-primary hover:underline">
            {t('navLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
