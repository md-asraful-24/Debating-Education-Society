'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Home,
  Calendar,
  Award,
  MessageSquare,
  FileText,
  Info,
  Settings,
  Shield,
  LogIn,
  LogOut,
  UserPlus,
  UserCheck,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { t, language } = useLanguage();

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/debates', label: t('navDebates'), icon: Calendar },
    { href: '/results', label: t('navResults'), icon: Award },
    { href: '/chat', label: t('navChat'), icon: MessageSquare },
    { href: '/cv-maker', label: t('navCvMaker'), icon: FileText },
    { href: '/about', label: t('navAbout'), icon: Info },
    { href: '/settings', label: t('navSettings'), icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isSettingsActive = pathname.startsWith('/settings');

  // Sidebar Inner Content Component (Reused in desktop and mobile drawer)
  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Section: Society Branding & Language Switcher */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-theme-primary flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
              ডি
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate">
                {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education'}
              </span>
              <span className="text-[11px] font-bold text-theme-primary tracking-wide truncate">
                {language === 'bn' ? 'সোসাইটি ইন বাংলাদেশ' : 'Society in Bangladesh'}
              </span>
            </div>
          </Link>

          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Language Switcher Banner inside Sidebar */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {language === 'bn' ? 'ভাষা / Language:' : 'Language:'}
          </span>
          <LanguageSwitcher />
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
            {language === 'bn' ? 'মেনু নেভিগেশন' : 'Navigation Menu'}
          </span>

          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-theme-primary text-white shadow-md shadow-emerald-700/20 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />}
                </Link>

                {/* Sub-item: Clear Back Button inside Settings per Requirement #4 */}
                {item.href === '/settings' && isSettingsActive && (
                  <div className="pl-4 pr-1 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        router.back();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-theme-primary" />
                      <span>{language === 'bn' ? 'পূর্বের পেজে ফিরুন (Back)' : 'Back to previous view'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Role-Restricted Admin Panel Link: Strictly visible ONLY to authenticated admin users */}
          {isAdmin && (
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-3 block mb-1">
                {language === 'bn' ? 'প্রশাসন নিয়ন্ত্রণ' : 'Administration'}
              </span>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  isActive('/admin')
                    ? 'bg-amber-500 text-white shadow-md border-amber-600'
                    : 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Shield className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="truncate">{t('navAdmin')}</span>
                </div>
                <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                  Admin
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section: User Profile or Login/Register */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {user ? (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-theme-primary text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {user.email}
                </div>
              </div>
              {user.role === 'admin' && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase shrink-0">
                  Admin
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                title={t('navSettings')}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t('navSettings')}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="py-1.5 px-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-[11px] font-semibold hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
                title={t('navLogout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('navLogout')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-theme-primary" />
              <span>{t('navLogin')}</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('navRegister')}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Top Header Bar: Cleanly adapted to mobile viewport width with 0 overflow */}
      <header className="md:hidden sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-700/20">
            ডি
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
              {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education Society'}
            </span>
            <span className="text-[10px] font-bold text-theme-primary">
              {language === 'bn' ? 'বাংলাদেশ চ্যাপ্টার' : 'in Bangladesh'}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Mobile Drawer / Off-Canvas Slide-Over (zero horizontal overflow) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Drawer */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 border-r border-slate-200 dark:border-slate-800">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 3. Desktop & Tablet Fixed/Sticky Left Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:sticky md:top-0 md:h-screen md:shrink-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
}
