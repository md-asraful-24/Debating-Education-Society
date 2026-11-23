'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CVData, EducationItem } from '@/lib/types';
import CvTemplate from '@/components/CvTemplate';
import {
  FileText,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Edit3,
  Eye,
  Check,
  ArrowDown,
  Upload,
} from 'lucide-react';

const blankCvData: CVData = {
  photoUrl: '',
  name: '',
  contactNo: '',
  email: '',
  presentAddress: '',
  permanentAddress: '',
  careerObjective: '',
  personalAttributes: [],
  education: [
    {
      id: 'edu-1',
      qualification: '',
      group: '',
      institutionName: '',
      gpa: '',
      passingYear: '',
    },
  ],
  interestsAndHobbies: [],
  languageProficiency: [],
  personalDetails: {
    name: '',
    fathersName: '',
    mothersName: '',
    dateOfBirth: '',
    nationality: '',
    nidNo: '',
    religion: '',
    maritalStatus: '',
    sex: '',
    height: '',
    weight: '',
    bloodGroup: '',
  },
  declarationText:
    'I hereby declare that all the details mentioned above are my own and true to the best of my knowledge.',
  signatureName: '',
};

export default function CvMakerPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<CVData>(blankCvData);
  const [isGenerated, setIsGenerated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [newAttribute, setNewAttribute] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLang, setNewLang] = useState('');

  const generatedPreviewRef = useRef<HTMLDivElement>(null);

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Education Rows
  const addEducationRow = () => {
    const newRow: EducationItem = {
      id: `edu-${Date.now()}`,
      qualification: '',
      group: '',
      institutionName: '',
      gpa: '',
      passingYear: '',
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newRow] }));
  };

  const removeEducationRow = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  const updateEducationRow = (index: number, field: keyof EducationItem, val: string) => {
    setData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  // Personal Attributes
  const addPersonalAttribute = () => {
    if (!newAttribute.trim()) return;
    setData((prev) => ({
      ...prev,
      personalAttributes: [...prev.personalAttributes, newAttribute.trim()],
    }));
    setNewAttribute('');
  };

  const removePersonalAttribute = (index: number) => {
    setData((prev) => ({
      ...prev,
      personalAttributes: prev.personalAttributes.filter((_, idx) => idx !== index),
    }));
  };

  // Interests & Hobbies
  const addHobby = () => {
    if (!newHobby.trim()) return;
    setData((prev) => ({
      ...prev,
      interestsAndHobbies: [...prev.interestsAndHobbies, newHobby.trim()],
    }));
    setNewHobby('');
  };

  const removeHobby = (index: number) => {
    setData((prev) => ({
      ...prev,
      interestsAndHobbies: prev.interestsAndHobbies.filter((_, idx) => idx !== index),
    }));
  };

  // Languages
  const addLanguage = () => {
    if (!newLang.trim()) return;
    setData((prev) => ({
      ...prev,
      languageProficiency: [...prev.languageProficiency, newLang.trim()],
    }));
    setNewLang('');
  };

  const removeLanguage = (index: number) => {
    setData((prev) => ({
      ...prev,
      languageProficiency: prev.languageProficiency.filter((_, idx) => idx !== index),
    }));
  };

  // Submit and Auto-Generate 2-Page CV
  const handleSubmitAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);

    setTimeout(() => {
      generatedPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // PDF Export (Precise 2-Page A4)
  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const page1 = document.getElementById('cv-page-1');
      const page2 = document.getElementById('cv-page-2');

      if (!page1 || !page2) throw new Error('CV pages not found');

      // Create PDF in A4 format (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Render Page 1
      const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true, logging: false });
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      // Render Page 2
      pdf.addPage();
      const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true, logging: false });
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const cleanFileName = data.name.trim()
        ? `${data.name.trim().replace(/[^a-zA-Z0-9]/g, '_')}_CV_2Page.pdf`
        : 'My_Curriculum_Vitae.pdf';

      pdf.save(cleanFileName);
    } catch (err) {
      console.warn('Canvas export fallback to print dialog:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header */}
      <div className="no-print space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'স্ট্যান্ডার্ড ২-পৃষ্ঠা এ৪ সিভি মেকার' : 'Standard 2-Page A4 CV Builder'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('cvTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'bn'
            ? 'আপনার নিজের তথ্য পূরণ করুন এবং সাবমিট বাটনে ক্লিক করলেই ২-পৃষ্ঠার সম্পূর্ণ রেডি-টু-প্রিন্ট সিভি তৈরি হবে।'
            : 'Fill in your details below and click Submit to auto-generate a complete 2-page A4 reference CV.'}
        </p>
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmitAndGenerate} className="no-print space-y-8">
        {/* Section 1: Basic Contact & Header */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-theme-primary" />
            <span>১. নাম, যোগাযোগ ও ঠিকানা (Header & Contact Details)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name / পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                placeholder="Enter Full Name (e.g. MD Zahid Hasan)"
                value={data.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                    personalDetails: { ...data.personalDetails, name: e.target.value },
                    signatureName: data.signatureName || e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Number / ফোন নম্বর *
              </label>
              <input
                type="text"
                required
                placeholder="Enter Contact No (e.g. +8801873528395)"
                value={data.contactNo}
                onChange={(e) => setData({ ...data, contactNo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address / ইমেইল *
            </label>
            <input
              type="email"
              required
              placeholder="Enter Email (e.g. zahidmaxshahi@gmail.com)"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Present Address / বর্তমান ঠিকানা
              </label>
              <textarea
                rows={2}
                placeholder="Enter Present Address (e.g. Labsha, Satkhira Sadar, Satkhira)"
                value={data.presentAddress}
                onChange={(e) => setData({ ...data, presentAddress: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Permanent Address / স্থায়ী ঠিকানা
              </label>
              <textarea
                rows={2}
                placeholder="Enter Permanent Address (e.g. Home: Kakdanga, P.O: Hotatgonj-9410, Kalaroa, Satkhira)"
                value={data.permanentAddress}
                onChange={(e) => setData({ ...data, permanentAddress: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Passport Size Photo / ছবি আপলোড
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-theme-primary" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {data.photoUrl && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Photo selected</span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, photoUrl: '' })}
                    className="ml-2 text-red-500 hover:underline text-xs"
                  >
                    (Remove)
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Career Objective */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            ২. ক্যারিয়ার অবজেক্টিভ (Career Objective)
          </label>
          <textarea
            rows={3}
            placeholder="Enter your career objective..."
            value={data.careerObjective}
            onChange={(e) => setData({ ...data, careerObjective: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Section 3: Personal Attributes */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            ৩. ব্যক্তিগত গুণাবলী / দক্ষতা (Personal Attributes)
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter an attribute (e.g. Hard Working, MS Word, Communication)"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPersonalAttribute();
                }
              }}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addPersonalAttribute}
              className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {data.personalAttributes.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.personalAttributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span>• {attr}</span>
                  <button
                    type="button"
                    onClick={() => removePersonalAttribute(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Educational Qualifications Table */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                ৪. শিক্ষাগত যোগ্যতা (Educational Qualifications)
              </label>
              <span className="text-[11px] text-slate-500">
                Add rows for S.S.C, H.S.C, Graduation, etc.
              </span>
            </div>
            <button
              type="button"
              onClick={addEducationRow}
              className="px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-hover flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('cvAddRow')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Qualification</span>
                  <input
                    type="text"
                    placeholder="e.g. S.S.C"
                    value={edu.qualification}
                    onChange={(e) => updateEducationRow(idx, 'qualification', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Group / Major</span>
                  <input
                    type="text"
                    placeholder="e.g. Science / Arts"
                    value={edu.group}
                    onChange={(e) => updateEducationRow(idx, 'group', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Institution Name</span>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka High School"
                    value={edu.institutionName}
                    onChange={(e) => updateEducationRow(idx, 'institutionName', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">GPA</span>
                  <input
                    type="text"
                    placeholder="e.g. 5.00"
                    value={edu.gpa}
                    onChange={(e) => updateEducationRow(idx, 'gpa', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-end gap-1">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Year</span>
                    <input
                      type="text"
                      placeholder="e.g. 2022"
                      value={edu.passingYear}
                      onChange={(e) => updateEducationRow(idx, 'passingYear', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducationRow(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    title="Delete row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Interest & Hobby & Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Interest & Hobby */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              ৫. আগ্রহ ও শখ (Interest & Hobby)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter a hobby (e.g. Reading, Traveling)"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHobby();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addHobby}
                className="px-3 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-bold"
              >
                Add
              </button>
            </div>
            {data.interestsAndHobbies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.interestsAndHobbies.map((h, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs flex items-center gap-1.5"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHobby(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Language Proficiency */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              ৬. ভাষা দক্ষতা (Language Proficiency)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter language (e.g. English, Bengali)"
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLanguage();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="px-3 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-bold"
              >
                Add
              </button>
            </div>
            {data.languageProficiency.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.languageProficiency.map((l, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs flex items-center gap-1.5"
                  >
                    {l}
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Personal Details (Every field fully editable, bound to state, with placeholders) */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              ৭. ব্যক্তিগত বিবরণী (Personal Details — All Editable)
            </label>
            <span className="text-[11px] text-slate-500">
              Each input is fully bound and editable with no hardcoded pre-fill.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Father's Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Father&apos;s Name / পিতার নাম
              </label>
              <input
                type="text"
                placeholder="Enter Father's Name (e.g. MD Ziarul Islam)"
                value={data.personalDetails.fathersName}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, fathersName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mother&apos;s Name / মাতার নাম
              </label>
              <input
                type="text"
                placeholder="Enter Mother's Name (e.g. Sumchun Nahar)"
                value={data.personalDetails.mothersName}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, mothersName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Date of Birth / জন্ম তারিখ
              </label>
              <input
                type="text"
                placeholder="Enter Date of Birth (e.g. 01/12/2000)"
                value={data.personalDetails.dateOfBirth}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, dateOfBirth: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nationality / জাতীয়তা
              </label>
              <input
                type="text"
                placeholder="Enter Nationality (e.g. Bangladeshi)"
                value={data.personalDetails.nationality}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, nationality: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* NID No */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                NID No / জাতীয় পরিচয়পত্র নম্বর
              </label>
              <input
                type="text"
                placeholder="Enter NID No (e.g. 8713243999)"
                value={data.personalDetails.nidNo}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, nidNo: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Religion */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Religion / ধর্ম
              </label>
              <input
                type="text"
                placeholder="Enter Religion (e.g. Islam / Hinduism)"
                value={data.personalDetails.religion}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, religion: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Marital Status / বৈবাহিক অবস্থা
              </label>
              <input
                type="text"
                placeholder="Enter Marital Status (e.g. Unmarried / Married)"
                value={data.personalDetails.maritalStatus}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, maritalStatus: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Sex / লিঙ্গ
              </label>
              <input
                type="text"
                placeholder="Enter Sex (e.g. Male / Female)"
                value={data.personalDetails.sex}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, sex: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Height */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Height / উচ্চতা
              </label>
              <input
                type="text"
                placeholder="Enter Height (e.g. 5'7&quot;)"
                value={data.personalDetails.height}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, height: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Weight / ওজন
              </label>
              <input
                type="text"
                placeholder="Enter Weight (e.g. 65 kg)"
                value={data.personalDetails.weight}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, weight: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group / রক্তের গ্রুপ
              </label>
              <input
                type="text"
                placeholder="Enter Blood Group (e.g. A+ (ve) / B+ / O+)"
                value={data.personalDetails.bloodGroup}
                onChange={(e) =>
                  setData({
                    ...data,
                    personalDetails: { ...data.personalDetails, bloodGroup: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Signature Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Signature Name / স্বাক্ষরের নাম
              </label>
              <input
                type="text"
                placeholder="Enter Signature Name (e.g. MD Zahid Hasan)"
                value={data.signatureName}
                onChange={(e) => setData({ ...data, signatureName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 7: Declaration Text */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            ৮. অঙ্গীকারনামা (Declaration Box Text)
          </label>
          <textarea
            rows={2}
            value={data.declarationText}
            onChange={(e) => setData({ ...data, declarationText: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-theme-primary hover:bg-theme-hover text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{language === 'bn' ? 'সিভি তৈরি ও সাবমিট করুন (Submit & Auto-Generate 2-Page CV)' : 'Submit & Auto-Generate 2-Page CV'}</span>
            <ArrowDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>

      {/* ========================================================
          AUTO-GENERATED 2-PAGE CV PREVIEW & PDF DOWNLOAD SECTION
      ======================================================== */}
      {isGenerated && (
        <div ref={generatedPreviewRef} className="pt-8 space-y-6">
          {/* Action Header Banner */}
          <div className="no-print p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'bn' ? 'আপনার ২-পৃষ্ঠা এ৪ সিভি সফলভাবে প্রস্তুত হয়েছে!' : 'Your 2-Page A4 CV has been successfully generated!'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'bn'
                  ? 'নিচের বাটনে ক্লিক করে তাৎক্ষণিক ২-পৃষ্ঠার ক্লিন পিডিএফ ডাউনলোড অথবা প্রিন্ট করুন।'
                  : 'Click below to instantly download the clean 2-page A4 PDF or print directly.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{t('cvPrint')}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={exporting}
                className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-700/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? t('loading') : 'Download 2-Page A4 PDF'}</span>
              </button>
            </div>
          </div>

          {/* Complete 2-Page A4 Printable Document */}
          <div className="p-4 sm:p-8 bg-slate-200 dark:bg-slate-950/80 rounded-3xl border border-slate-300 dark:border-slate-800 overflow-x-auto">
            <CvTemplate data={data} />
          </div>

          {/* Bottom Action Area */}
          <div className="no-print flex items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={exporting}
              className="px-6 py-3 rounded-2xl bg-theme-primary hover:bg-theme-hover text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? t('loading') : 'Download Clean 2-Page A4 PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
