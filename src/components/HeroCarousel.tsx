'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SliderImage } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Trophy,
} from 'lucide-react';

interface HeroCarouselProps {
  initialSliders?: SliderImage[];
}

export default function HeroCarousel({ initialSliders }: HeroCarouselProps) {
  const { t, loc, language } = useLanguage();
  const [sliders, setSliders] = useState<SliderImage[]>(initialSliders || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-set duration to 15 seconds (15s) requirement
  const DEFAULT_SLIDE_DURATION_MS = 15000;
  const TICK_INTERVAL_MS = 100;

  useEffect(() => {
    if (!initialSliders || initialSliders.length === 0) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.sliders && data.sliders.length > 0) {
            setSliders(data.sliders);
          }
        })
        .catch((err) => console.error('Failed to load sliders:', err));
    }
  }, [initialSliders]);

  // 15-Second Auto Slide Timer with continuous smooth progress
  useEffect(() => {
    if (sliders.length <= 1) return;

    const currentSlide = sliders[currentIndex];
    const slideDuration = currentSlide?.durationSeconds ? currentSlide.durationSeconds * 1000 : DEFAULT_SLIDE_DURATION_MS;

    setProgress(0);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / slideDuration) * 100;
        if (next >= 100) {
          setCurrentIndex((idx) => (idx + 1) % sliders.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(progressTimer);
  }, [currentIndex, sliders]);

  if (sliders.length === 0) {
    return (
      <div className="relative h-[480px] bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold">{t('societyName')}</h1>
          <p className="text-slate-400">{t('heroSubtitle')}</p>
        </div>
      </div>
    );
  }

  const currentSlide = sliders[currentIndex] || sliders[0];
  const isFirstSlide = currentIndex === 0;
  const shouldShowOverlay = isFirstSlide || currentSlide.showOverlay;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    setProgress(0);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden bg-slate-950 group select-none flex flex-col justify-between">
      {/* Background Slides */}
      {sliders.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center transform transition-transform duration-[15000ms] ease-linear"
            style={{
              backgroundImage: `url(${slide.url})`,
              transform: idx === currentIndex ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80" />
        </div>
      ))}

      {/* ─── Hero Content Area: Clean, Grand Showcase (Exactly matching Image 2) ─── */}
      {shouldShowOverlay && (
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 z-10">
          <div className="max-w-4xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'bn' ? 'জাতীয় বিতর্ক ও শিক্ষা প্ল্যাটফর্ম' : 'National Debating & Education Society'}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              {isFirstSlide ? (
                <>
                  <span className="text-emerald-400">Debating Education Society</span>
                  <br />
                  <span className="text-slate-100">in Bangladesh</span>
                </>
              ) : (
                loc(currentSlide.title)
              )}
            </h1>

            {/* Slide Subtitle */}
            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-200 font-medium drop-shadow-md leading-relaxed">
              {loc(currentSlide.subtitle) || t('heroSubtitle')}
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/debates"
                className="px-6 py-3 rounded-xl bg-theme-primary text-white font-bold text-sm sm:text-base hover:bg-theme-hover transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('exploreDebates')}</span>
              </Link>
              <Link
                href="/results"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm sm:text-base hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-900/30 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Trophy className="w-4 h-4" />
                <span>{language === 'bn' ? 'আজকের বিজয়ী ফলাফল' : 'Today\'s Winner Results'}</span>
              </Link>
              <Link
                href="/chat"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>{t('joinCommunity')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Manual Slide Controls: Previous & Next */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 opacity-70 group-hover:opacity-100 transition-all focus:outline-hidden backdrop-blur-xs z-20"
        aria-label={t('prevSlide')}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 opacity-70 group-hover:opacity-100 transition-all focus:outline-hidden backdrop-blur-xs z-20"
        aria-label={t('nextSlide')}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ─── Bottom Bar: Clean Indicators without ticking seconds ─── */}
      <div className="relative z-20 px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Indicators */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {sliders.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Clean Slide Counter (No ticking seconds counter on homepage) */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs text-[11px] text-slate-300 font-bold">
          <span>{currentIndex + 1}</span>
          <span className="text-slate-500">/</span>
          <span>{sliders.length}</span>
        </div>
      </div>

      {/* Top smooth 15-second visual progress line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-theme-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
