'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface LogoProps {
  variant?: 'sidebar' | 'mobile' | 'footer' | 'icon' | 'auth';
  showText?: boolean;
  className?: string;
  logoUrl?: string;
}

export default function Logo({
  variant = 'icon',
  showText = true,
  className = '',
  logoUrl = '/images/logo.jpg',
}: LogoProps) {
  const { language } = useLanguage();

  // Emblems are wrapped in a clean, subtle light frame with rounded corners
  // ensuring the green and red emblem, leaf motif, and typography remain sharp and legible in both light and dark mode.
  const emblemFrame = (
    <div
      className={`relative shrink-0 rounded-2xl bg-white p-1 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 ${
        variant === 'auth'
          ? 'w-16 h-16 shadow-md'
          : variant === 'sidebar'
          ? 'w-11 h-11'
          : variant === 'footer'
          ? 'w-12 h-12 shadow-md ring-1 ring-slate-800'
          : 'w-10 h-10'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl || '/images/logo.jpg'}
        alt="Debating Education Society in Bangladesh Logo"
        className="w-full h-full object-contain select-none"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon' || variant === 'auth' || !showText) {
    return <div className={`inline-flex items-center ${className}`}>{emblemFrame}</div>;
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 min-w-0 ${className}`}>
        {emblemFrame}
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate">
            {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education'}
          </span>
          <span className="text-[11px] font-bold text-theme-primary tracking-wide truncate">
            {language === 'bn' ? 'সোসাইটি ইন বাংলাদেশ' : 'Society in Bangladesh'}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
        {emblemFrame}
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate">
            {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education Society'}
          </span>
          <span className="text-[10px] font-bold text-theme-primary truncate">
            {language === 'bn' ? 'বাংলাদেশ চ্যাপ্টার' : 'in Bangladesh'}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 min-w-0 ${className}`}>
        {emblemFrame}
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-base leading-tight truncate">
            {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education Society'}
          </span>
          <span className="text-xs text-emerald-400 font-semibold truncate">
            {language === 'bn' ? 'বাংলাদেশ চ্যাপ্টার' : 'in Bangladesh'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {emblemFrame}
      <div className="flex flex-col">
        <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
          Debating Education Society
        </span>
        <span className="text-[11px] font-semibold text-theme-primary">
          in Bangladesh
        </span>
      </div>
    </div>
  );
}
