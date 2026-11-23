'use client';

import React, { useState, useEffect } from 'react';
import { SiteSettings, LeadershipMember } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { FileEdit, Save, Plus, Trash2, CheckCircle, Users, ImageIcon } from 'lucide-react';

export default function FooterEditor() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setStatusMsg('Footer & About settings successfully updated!');
        setTimeout(() => setStatusMsg(null), 3500);
      } else {
        alert('Failed to save settings');
      }
    } catch {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const addLeadershipMember = () => {
    if (!settings) return;
    const newMember: LeadershipMember = {
      id: `lead-${Date.now()}`,
      name: 'New Officer Name',
      role: { bn: 'যুগ্ম সাধারণ সম্পাদক', en: 'Joint General Secretary' },
      email: 'officer@gmail.com',
      phone: '+8801...',
      order: (settings.leadership?.length || 0) + 1,
    };
    setSettings({
      ...settings,
      leadership: [...(settings.leadership || []), newMember],
    });
  };

  const removeLeadershipMember = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      leadership: settings.leadership.filter((l) => l.id !== id),
    });
  };

  if (!settings) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-theme-primary" />
          <span>{t('adminFooter')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'কোড পরিবর্তন না করেই ফুটার, নেতৃত্ব প্যানেল, যোগাযোগ তথ্য ও আচরণবিধি ডাটাবেজে আপডেট করুন'
            : 'Update Footer contact details, leadership list, and conduct rules dynamically in database'}
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Logo URL Configuration */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-theme-primary" />
          <span>{language === 'bn' ? 'Logo Image Settings' : 'Logo Image Settings'}</span>
        </h3>
        <p className="text-[11px] text-slate-500">
          {language === 'bn'
            ? 'Change the logo shown across Sidebar, Footer, mobile header, and Login/Register pages. Default: /images/logo.jpg'
            : 'Change the logo shown across Sidebar, Footer, mobile header, and Login/Register pages. Default: /images/logo.jpg'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Logo Image URL / Path
            </label>
            <input
              type="text"
              value={settings.logoUrl || '/images/logo.jpg'}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="/images/logo.jpg"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Place image in public folder (e.g. /images/logo.jpg) or provide a full URL
            </span>
          </div>
          <div className="shrink-0">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">Preview</span>
            <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logoUrl || '/images/logo.jpg'}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Official Contact Details */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          অফিসিয়াল যোগাযোগ ক্ষেত্র (Dedicated Contact Fields)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Official Gmail (@gmail.com)
            </label>
            <input
              type="email"
              value={settings.officialGmail}
              onChange={(e) => setSettings({ ...settings, officialGmail: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Facebook Page Link
            </label>
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Physical Address (Bangla)
            </label>
            <input
              type="text"
              value={settings.address.bn}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  address: { ...settings.address, bn: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Physical Address (English)
            </label>
            <input
              type="text"
              value={settings.address.en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  address: { ...settings.address, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Leadership & Moderator List */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-theme-primary" />
              <span>{t('leadershipTitle')}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'নেতৃত্ব পরিবর্তনের সাথে সাথে নাম ও পদবী ডায়নামিকলি আপডেট হয়' : 'Dynamically update leadership roles as administration changes'}
            </p>
          </div>
          <button
            type="button"
            onClick={addLeadershipMember}
            className="px-3 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Leader</span>
          </button>
        </div>

        <div className="space-y-3">
          {settings.leadership?.map((leader, idx) => (
            <div
              key={leader.id || idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
            >
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Officer Name</span>
                <input
                  type="text"
                  value={leader.name}
                  onChange={(e) => {
                    const updated = [...settings.leadership];
                    updated[idx].name = e.target.value;
                    setSettings({ ...settings, leadership: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Role (Bangla)</span>
                <input
                  type="text"
                  value={leader.role.bn}
                  onChange={(e) => {
                    const updated = [...settings.leadership];
                    updated[idx].role.bn = e.target.value;
                    setSettings({ ...settings, leadership: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Role (English)</span>
                <input
                  type="text"
                  value={leader.role.en}
                  onChange={(e) => {
                    const updated = [...settings.leadership];
                    updated[idx].role.en = e.target.value;
                    setSettings({ ...settings, leadership: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-bold block">Email</span>
                  <input
                    type="email"
                    value={leader.email || ''}
                    onChange={(e) => {
                      const updated = [...settings.leadership];
                      updated[idx].email = e.target.value;
                      setSettings({ ...settings, leadership: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLeadershipMember(leader.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded mt-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About & Conduct Content */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          আমাদের সম্পর্কে ও আচরণবিধি কন্টেন্ট (About & Anti-Harassment Rules)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              About Description (Bangla)
            </label>
            <textarea
              rows={4}
              value={settings.aboutContent.bn}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutContent: { ...settings.aboutContent, bn: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              About Description (English)
            </label>
            <textarea
              rows={4}
              value={settings.aboutContent.en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutContent: { ...settings.aboutContent, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-red-600 block mb-1">
              Strict Conduct & Anti-Harassment Rules (Bangla)
            </label>
            <textarea
              rows={4}
              value={settings.conductRules.bn}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  conductRules: { ...settings.conductRules, bn: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-red-600 block mb-1">
              Strict Conduct & Anti-Harassment Rules (English)
            </label>
            <textarea
              rows={4}
              value={settings.conductRules.en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  conductRules: { ...settings.conductRules, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? t('loading') : t('save')}</span>
      </button>
    </form>
  );
}
