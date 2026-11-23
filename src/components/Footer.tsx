'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import { SiteSettings } from '@/lib/types';
import {
  Mail,
  MapPin,
  Phone,
  BookOpen,
  Users,
  ExternalLink,
  Heart,
  Shield,
  Gavel,
  Crown,
} from 'lucide-react';

export default function Footer() {
  const { t, loc, language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error('Failed to load footer settings:', err));
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-300 border-t border-slate-800/60">
      {/* Top decorative accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* ─── Main Footer Body ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ─── Top Row: Brand + Mission ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10 pb-8 border-b border-slate-800/50">
          <Logo variant="footer" logoUrl={settings?.logoUrl} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              {settings
                ? loc(settings.aboutContent)?.slice(0, 200) + '...'
                : t('tagline')}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('aboutSociety')} & {t('conductPolicy')}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Card Grid: 2×2 on desktop, stacked on mobile ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Card 1: Official Contact */}
          <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-sm p-5 space-y-4 hover:border-emerald-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('officialContact')}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                    {t('emailLabel')}
                  </span>
                  <a
                    href={`mailto:${settings?.officialGmail || 'debatingeducationsociety.bd@gmail.com'}`}
                    className="text-xs text-slate-200 hover:text-emerald-400 font-mono transition-colors break-all leading-relaxed"
                  >
                    {settings?.officialGmail || 'debatingeducationsociety.bd@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                    {t('phoneLabel')}
                  </span>
                  <a
                    href={`tel:${settings?.phone || '+8801873528395'}`}
                    className="text-xs text-slate-200 hover:text-emerald-400 font-mono transition-colors"
                  >
                    {settings?.phone || '+880 1873-528395'}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                    {t('addressLabel')}
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed">
                    {settings ? loc(settings.address) : 'উত্তরা, ঢাকা-১২৩০, বাংলাদেশ'}
                  </span>
                </div>
              </div>

              {/* Facebook */}
              {settings?.facebookUrl && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>{t('socialLabel')}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Debate Resources & Guidelines */}
          <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-sm p-5 space-y-4 hover:border-emerald-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('resourcesTitle')}
              </h3>
            </div>

            <div className="space-y-2.5">
              {settings?.debateResources?.slice(0, 4).map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50 hover:border-violet-800/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Gavel className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-emerald-400 group-hover/link:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span className="truncate">{loc(res.title)}</span>
                      <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {loc(res.description)}
                    </p>
                  </div>
                </a>
              ))}

              {(!settings?.debateResources || settings.debateResources.length === 0) && (
                <div className="p-4 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center">
                  <BookOpen className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'ডিবেট রিসোর্স শীঘ্রই যোগ হবে'
                      : 'Debate resources coming soon'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Current Admins & Moderators */}
          <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-sm p-5 space-y-4 hover:border-emerald-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('leadershipTitle')}
              </h3>
            </div>

            <div className="space-y-2">
              {settings?.leadership?.map((leader, idx) => (
                <div
                  key={leader.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/50"
                >
                  {/* Avatar badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white ${
                    idx === 0
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                      : idx === 1
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : idx === 2
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-br from-slate-500 to-slate-600'
                  }`}>
                    {leader.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-100 block truncate leading-tight">
                      {leader.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate leading-relaxed">
                      {loc(leader.role)}
                    </span>
                  </div>
                  {idx === 0 && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 opacity-70" />
                  )}
                </div>
              ))}

              {(!settings?.leadership || settings.leadership.length === 0) && (
                <div className="p-4 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center">
                  <Users className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'নেতৃত্ব তালিকা শীঘ্রই আপডেট হবে'
                      : 'Leadership list will be updated soon'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Quick Links & Platform Info */}
          <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-sm p-5 space-y-4 hover:border-emerald-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
              </h3>
            </div>

            <nav className="space-y-1.5">
              {[
                { href: '/debates', label: language === 'bn' ? 'ডিবেট শিডিউল' : 'Debate Schedule', icon: Gavel },
                { href: '/results', label: language === 'bn' ? 'ফলাফল ও বিজয়ী' : 'Results & Winners', icon: Crown },
                { href: '/chat', label: language === 'bn' ? 'যোগাযোগ কেন্দ্র' : 'Communication Center', icon: Users },
                { href: '/cv-maker', label: language === 'bn' ? 'সিভি তৈরি করুন' : 'CV Maker', icon: BookOpen },
                { href: '/about', label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', icon: Shield },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  <link.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Platform badges */}
            <div className="pt-3 border-t border-slate-800/50 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {['Gmail OTP', 'RBAC', 'Bilingual'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'Vercel প্রডাকশন ডিপ্লয়মেন্ট রেডি'
                  : 'Vercel Production Deployment Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar: Copyright + Language Switcher ─── */}
      <div className="border-t border-slate-800/50 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-xs text-slate-500 text-center sm:text-left">
              <Heart className="w-3.5 h-3.5 text-red-400/60 shrink-0" />
              <span>{t('copyright')}</span>
            </div>

            {/* Language Switcher at the very bottom */}
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
