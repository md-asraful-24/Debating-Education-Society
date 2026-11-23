'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CVData, EducationItem } from '@/lib/types';
import CvTemplate from '@/components/CvTemplate';
import {
  FileText,
  Download,
  Printer,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3,
} from 'lucide-react';

const initialCvData: CVData = {
  photoUrl: '',
  name: 'MD ZAHID HASAN .',
  contactNo: '+8801873528395 .',
  email: 'zahidmaxshahi@gmail.com .',
  presentAddress: 'Labsha, Satkhira Sadar, Satkhira .',
  permanentAddress: 'Home:Kakdanga, Village/Road: Bagadanga, P.O:Hotatgonj-9410, Kalaroa, Satkhira.',
  careerObjective:
    'To obtain a job working in a challenging environment to use conceptual & technical know-how takes an organization in current millennium.',
  personalAttributes: [
    'Hard Working .',
    'Vibe coder .',
    'MS Word .',
    'Excel .',
    'Computer Fundamentals .',
    'Communication .',
    'Ability to learn quickly and implement efficiently .',
    'Ability to work independently and in a team .',
    'Working within tie and under pressure .',
    'Outsourcing .',
  ],
  education: [
    {
      id: 'edu-1',
      qualification: 'S.S.C',
      group: 'Commerce',
      institutionName: 'Bhadiali High School',
      gpa: '4.60',
      passingYear: '2015',
    },
    {
      id: 'edu-2',
      qualification: 'H.S.C',
      group: 'Humanities',
      institutionName: 'Kalaroa Govt. College',
      gpa: '3.50',
      passingYear: '2018',
    },
  ],
  interestsAndHobbies: [
    'Reading News Paper & Book .',
    'Creative writing.',
    'Traveling .',
    'I love to teach.',
  ],
  languageProficiency: [
    'Proficiency in English, Bengali (Reading, Writing, Speaking).',
  ],
  personalDetails: {
    name: 'MD Zahid Hasan .',
    fathersName: 'MD Ziarul Islam .',
    mothersName: 'Sumchun Nahar.',
    dateOfBirth: '01/12/2000 .',
    nationality: 'Bangladeshi .',
    nidNo: '8713243999 .',
    religion: 'Islam .',
    maritalStatus: 'Married .',
    sex: 'Male .',
    height: "5'5.5\" .",
    weight: '56 kg .',
    bloodGroup: 'A+ (ve) .',
  },
  declarationText:
    'I hereby declare that all the details mentioned above are my own and true to the best of my knowledge.',
  signatureName: 'MD Zahid Hasan',
};

export default function CvMakerPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<CVData>(initialCvData);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [exporting, setExporting] = useState(false);

  // Photo upload handler
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

  // Add education row
  const addEducationRow = () => {
    const newRow: EducationItem = {
      id: `edu-${Date.now()}`,
      qualification: 'B.Sc / Degree',
      group: 'Science / Arts',
      institutionName: 'National University',
      gpa: '3.50',
      passingYear: '2022',
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

  // Export clean PDF
  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      // Dynamic import to support client-side html2pdf / jspdf
      const html2pdf = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('cv-printable-document');
      if (!element) throw new Error('CV element not found');

      const canvas = await html2pdf(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${data.name.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.warn('Canvas export fallback to browser print dialog:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme-primary text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'স্ট্যান্ডার্ড সিভি জেনারেটর' : 'Standard Reference CV Format'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('cvTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('cvSubtitle')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="hidden lg:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'split' ? 'bg-white dark:bg-slate-900 shadow-xs text-theme-primary' : 'text-slate-500'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'edit' ? 'bg-white dark:bg-slate-900 shadow-xs text-theme-primary' : 'text-slate-500'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 inline mr-1" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'preview' ? 'bg-white dark:bg-slate-900 shadow-xs text-theme-primary' : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t('cvPrint')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={exporting}
            className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? t('loading') : t('cvDownloadPdf')}</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor (Visible in split & edit modes) */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`space-y-6 no-print ${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            {/* Basic Info & Photo */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-theme-primary" />
                <span>ব্যক্তিগত ও যোগাযোগ তথ্য (Header & Contact)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('cvName')}
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('cvContactNo')}
                  </label>
                  <input
                    type="text"
                    value={data.contactNo}
                    onChange={(e) => setData({ ...data, contactNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('cvEmail')}
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('cvPresentAddress')}
                </label>
                <textarea
                  rows={2}
                  value={data.presentAddress}
                  onChange={(e) => setData({ ...data, presentAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('cvPermanentAddress')}
                </label>
                <textarea
                  rows={2}
                  value={data.permanentAddress}
                  onChange={(e) => setData({ ...data, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Photo Upload */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('cvUploadPhoto')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-theme-light file:text-theme-primary hover:file:opacity-80"
                  />
                  {data.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, photoUrl: '' })}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Career Objective */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t('cvCareerObjective')}
              </label>
              <textarea
                rows={3}
                value={data.careerObjective}
                onChange={(e) => setData({ ...data, careerObjective: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Educational Qualifications Table Editor */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('cvEducationalQualifications')}
                </label>
                <button
                  type="button"
                  onClick={addEducationRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-theme-primary text-white hover:bg-theme-hover flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('cvAddRow')}</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-2 relative"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">Qualification</span>
                      <input
                        type="text"
                        value={edu.qualification}
                        onChange={(e) => updateEducationRow(idx, 'qualification', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">Group</span>
                      <input
                        type="text"
                        value={edu.group}
                        onChange={(e) => updateEducationRow(idx, 'group', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <span className="text-[10px] text-slate-500 font-bold block">Institution</span>
                      <input
                        type="text"
                        value={edu.institutionName}
                        onChange={(e) => updateEducationRow(idx, 'institutionName', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">GPA</span>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducationRow(idx, 'gpa', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </div>
                    <div className="flex items-end gap-1">
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-500 font-bold block">Year</span>
                        <input
                          type="text"
                          value={edu.passingYear}
                          onChange={(e) => updateEducationRow(idx, 'passingYear', e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducationRow(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t('cvPersonalDetails')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvFathersName')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.fathersName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, fathersName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvMothersName')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.mothersName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, mothersName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvDateOfBirth')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.dateOfBirth}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, dateOfBirth: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvNationality')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.nationality}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, nationality: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvNidNo')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.nidNo}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, nidNo: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvReligion')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.religion}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, religion: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvMaritalStatus')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.maritalStatus}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, maritalStatus: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvSex')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.sex}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, sex: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvHeight')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.height}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, height: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvWeight')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.weight}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, weight: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('cvBloodGroup')}</span>
                  <input
                    type="text"
                    value={data.personalDetails?.bloodGroup}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalDetails: { ...data.personalDetails, bloodGroup: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Printable Preview (Visible in split & preview modes) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`overflow-x-auto ${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            <div className="sticky top-20">
              <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-t-xl text-center text-xs font-bold text-slate-600 dark:text-slate-300 no-print">
                {t('cvLivePreview')} (100% Matching zahid vi.pdf)
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 p-2 sm:p-4 rounded-b-xl overflow-x-auto shadow-inner">
                <CvTemplate data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
