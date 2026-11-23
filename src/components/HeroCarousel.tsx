'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SliderImage, Debate } from '@/lib/types';
import TodayWinnerBanner from './TodayWinnerBanner';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Trophy,
  Sparkles,
  Info,
} from 'lucide-react';

interface HeroCarouselProps {
  initialSliders?: SliderImage[];
}

export default function HeroCarousel({ initialSliders }: HeroCarouselProps) {
  const { t, loc, language } = useLanguage();
  const [sliders, setSliders] = useState<SliderImage[]>(initialSliders || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [todayWinner, setTodayWinner] = useState<Debate | null>(null);
  const [heroView, setHeroView] = useState<'winner' | 'overview'>('winner');

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

    // Fetch latest completed results for Hero Showcase
    fetch('/api/debates/results')
      .then((res) => res.json())
      .then((data) => {
        if (data.todayWinner) {
          setTodayWinner(data.todayWinner);
          setHeroView('winner');
        } else if (data.yesterdayWinner) {
          setTodayWinner(data.yesterdayWinner);
          setHeroView('winner');
        } else if (data.allCompleted && data.allCompleted.length > 0) {
          setTodayWinner(data.allCompleted[0]);
          setHeroView('winner');
        } else {
          setHeroView('overview');
        }
      })
      .catch((err) => console.error('Failed to load winner for hero banner:', err));
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
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] overflow-hidden bg-slate-950 group select-none flex flex-col justify-between">
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/85" />
        </div>
      ))}

      {/* ─── Hero Content Area ─── */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero Top Switcher Pills: TODAY'S WINNER vs SOCIETY OVERVIEW */}
        {todayWinner && (
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 mb-6 shadow-lg">
            <button
              type="button"
              onClick={() => setHeroView('winner')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                heroView === 'winner'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আজকের বিজয়ী (TODAY\'S WINNER)' : 'TODAY\'S WINNER'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHeroView('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                heroView === 'overview'
                  ? 'bg-theme-primary text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সোসাইটি পরিচিতি' : 'About Society'}</span>
            </button>
          </div>
        )}

        {/* VIEW 1: TODAY'S WINNER Banner Showcase Prominently Inside Hero Section */}
        {heroView === 'winner' && todayWinner ? (
          <div className="max-w-5xl w-full mx-auto animate-in fade-in zoom-in-95 duration-500">
            <TodayWinnerBanner
              debate={todayWinner}
              badgeLabel={language === 'bn' ? 'আজকের বিজয়ী (TODAY\'S WINNER)' : 'TODAY\'S WINNER (আজকের বিজয়ী)'}
              isHeroMode={true}
            />
          </div>
        ) : (
          /* VIEW 2: Society Event & Mission Banner Showcase */
          shouldShowOverlay && (
            <div className="max-w-4xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
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
                  href="/chat"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Users className="w-4 h-4" />
                  <span>{t('joinCommunity')}</span>
                </Link>
              </div>
            </div>
          )
        )}
      </div>

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
