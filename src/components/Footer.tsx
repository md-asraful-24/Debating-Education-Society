'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { SiteSettings } from '@/lib/types';
import {
  Mail,
  MapPin,
  Phone,
  BookOpen,
  Users,
  ShieldCheck,
  ExternalLink,
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
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Society Info & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-theme-primary flex items-center justify-center text-white font-bold shadow-md">
                ডি
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-tight">
                  {settings ? loc(settings.siteName) : t('societyName')}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {language === 'bn' ? 'বাংলাদেশ চ্যাপ্টার' : 'in Bangladesh'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings
                ? loc(settings.aboutContent)?.slice(0, 160) + '...'
                : t('tagline')}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>{t('aboutSociety')} & {t('conductPolicy')}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Column 2: Official Contact Info (Dynamic) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>{t('officialContact')}</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500 font-medium">{t('emailLabel')}:</span>
                  <a
                    href={`mailto:${settings?.officialGmail || 'debatingeducationsociety.bd@gmail.com'}`}
                    className="text-slate-200 hover:text-emerald-400 font-mono transition-colors"
                  >
                    {settings?.officialGmail || 'debatingeducationsociety.bd@gmail.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500 font-medium">{t('phoneLabel')}:</span>
                  <a
                    href={`tel:${settings?.phone || '+8801873528395'}`}
                    className="text-slate-200 hover:text-emerald-400 font-mono transition-colors"
                  >
                    {settings?.phone || '+880 1873-528395'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500 font-medium">{t('addressLabel')}:</span>
                  <span className="text-slate-300">
                    {settings ? loc(settings.address) : 'উত্তরা, ঢাকা-১২৩০, বাংলাদেশ'}
                  </span>
                </div>
              </li>
              {settings?.facebookUrl && (
                <li className="flex items-center gap-2.5 pt-1">
                  <svg className="w-4 h-4 fill-current text-blue-400 shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    {t('socialLabel')}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Debate Resources & Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{t('resourcesTitle')}</span>
            </h3>
            <div className="space-y-2">
              {settings?.debateResources?.slice(0, 3).map((res) => (
                <div key={res.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-xs text-emerald-400 hover:underline flex items-center justify-between"
                  >
                    <span>{loc(res.title)}</span>
                    <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {loc(res.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Current Leadership & Moderation List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{t('leadershipTitle')}</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {settings?.leadership?.map((leader) => (
                <li key={leader.id} className="flex flex-col border-b border-slate-900 pb-1.5">
                  <span className="text-slate-100 font-semibold">{leader.name}</span>
                  <span className="text-slate-400 text-[11px]">{loc(leader.role)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Bilingual Language Switcher Toggle */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center md:text-left">
            <p>{t('copyright')}</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Vercel Production Deployment Ready • Strict Gmail OTP Verification • Role-Based Access Control
            </p>
          </div>

          {/* Language Switcher Toggle at the bottom of the Footer (Requirement #2) */}
          <div>
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
