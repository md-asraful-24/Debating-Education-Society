'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Menu,
  X,
  Shield,
  MessageSquare,
  Calendar,
  Award,
  FileText,
  Info,
  Settings,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { t, language } = useLanguage();

  const navLinks = [
    { href: '/', label: t('navHome'), icon: null },
    { href: '/debates', label: t('navDebates'), icon: Calendar },
    { href: '/results', label: t('navResults'), icon: Award },
    { href: '/chat', label: t('navChat'), icon: MessageSquare },
    { href: '/cv-maker', label: t('navCvMaker'), icon: FileText },
    { href: '/about', label: t('navAbout'), icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white font-bold shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">ডি</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                {language === 'bn' ? 'ডিবেটিং এডুকেশন সোসাইটি' : 'Debating Education Society'}
              </span>
              <span className="text-[11px] font-semibold text-theme-primary tracking-wide">
                {language === 'bn' ? 'বাংলাদেশ চ্যাপ্টার' : 'in Bangladesh'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-theme-light text-theme-primary font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Panel Link: Strictly visible ONLY to authenticated admin users */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 border border-amber-500/30 ${
                  isActive('/admin')
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('navAdmin')}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/settings"
                  className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    isActive('/settings') ? 'text-theme-primary bg-theme-light' : ''
                  }`}
                  title={t('navSettings')}
                >
                  <Settings className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <UserCheck className="w-4 h-4 text-theme-primary" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title={t('navLogout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-theme-primary text-white hover:bg-theme-hover shadow-sm transition-all"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-theme-light text-theme-primary font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Admin Panel strictly for admins */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 text-white"
            >
              <Shield className="w-4 h-4" />
              <span>{t('navAdmin')}</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t('navSettings')}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navLogout')} ({user.name.split(' ')[0]})</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-center text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('navLogin')}</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-center text-sm font-semibold rounded-lg bg-theme-primary text-white"
                >
                  <span>{t('navRegister')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
