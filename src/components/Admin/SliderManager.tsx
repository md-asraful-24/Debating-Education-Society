'use client';

import React, { useState, useEffect } from 'react';
import { SliderImage } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Save, Check } from 'lucide-react';

export default function SliderManager() {
  const { t, loc, language } = useLanguage();
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSubtitleBn, setNewSubtitleBn] = useState('');
  const [newSubtitleEn, setNewSubtitleEn] = useState('');
  const [newShowOverlay, setNewShowOverlay] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/admin/sliders');
      const data = await res.json();
      if (data.sliders) setSliders(data.sliders);
    } catch (err) {
      console.error('Failed to load sliders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleToggleOverlay = async (slider: SliderImage) => {
    try {
      const res = await fetch('/api/admin/sliders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          slider: { id: slider.id, showOverlay: !slider.showOverlay },
        }),
      });
      if (res.ok) {
        setSliders((prev) =>
          prev.map((s) => (s.id === slider.id ? { ...s, showOverlay: !s.showOverlay } : s))
        );
      }
    } catch {
      alert('Failed to toggle overlay');
    }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      const res = await fetch('/api/admin/sliders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', slider: { id } }),
      });
      if (res.ok) {
        setSliders((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert('Failed to delete slider');
    }
  };

  const handleAddSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      const res = await fetch('/api/admin/sliders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          slider: {
            url: newUrl.trim(),
            title: { bn: newTitleBn.trim(), en: newTitleEn.trim() },
            subtitle: { bn: newSubtitleBn.trim(), en: newSubtitleEn.trim() },
            showOverlay: newShowOverlay,
          },
        }),
      });

      if (res.ok) {
        setSaveStatus('Slider image added successfully!');
        setNewUrl('');
        setNewTitleBn('');
        setNewTitleEn('');
        setNewSubtitleBn('');
        setNewSubtitleEn('');
        fetchSliders();
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      alert('Failed to add slider');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-theme-primary" />
            <span>{t('adminSliders')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'হোমপেজ ক্যারোসেল ইমেজ নিয়ন্ত্রণ ও প্রতি স্লাইডে লেখা দেখানোর টগল'
              : 'Manage hero slides and per-image text overlay visibility'}
          </p>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Sliders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sliders.map((s, idx) => (
          <div
            key={s.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
          >
            <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.url} alt={s.title.en} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Slide #{idx + 1} {idx === 0 ? '(First - Always Prominent)' : ''}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {loc(s.title) || '(No title text)'}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{loc(s.subtitle)}</p>
            </div>

            {/* Per-image overlay toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleOverlay(s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  s.showOverlay
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {s.showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{s.showOverlay ? 'Overlay Shown' : 'Overlay Hidden'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSlider(s.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                title="Delete Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Slider Form */}
      <form onSubmit={handleAddSlider} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-theme-primary" />
          <span>নতুন স্লাইড যোগ করুন (Add New Hero Slide)</span>
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Image URL
          </label>
          <input
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Title (Bangla)
            </label>
            <input
              type="text"
              value={newTitleBn}
              onChange={(e) => setNewTitleBn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={newTitleEn}
              onChange={(e) => setNewTitleEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Subtitle (Bangla)
            </label>
            <input
              type="text"
              value={newSubtitleBn}
              onChange={(e) => setNewSubtitleBn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={newSubtitleEn}
              onChange={(e) => setNewSubtitleEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showOverlayCheck"
            checked={newShowOverlay}
            onChange={(e) => setNewShowOverlay(e.target.checked)}
            className="rounded text-theme-primary focus:ring-emerald-500"
          />
          <label htmlFor="showOverlayCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            {t('adminToggleOverlay')}
          </label>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Slide</span>
        </button>
      </form>
    </div>
  );
}
