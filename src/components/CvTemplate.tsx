'use client';

import React from 'react';
import { CVData } from '@/lib/types';

interface CvTemplateProps {
  data: CVData;
}

export default function CvTemplate({ data }: CvTemplateProps) {
  const displayName = data.name.trim();
  const signatureDisplayName = (data.signatureName || data.name).trim();

  return (
    <div id="cv-printable-document" className="space-y-8 font-sans text-slate-900">
      {/* ========================================================
          PAGE 1 (A4 Dimension Layout)
          - Header & Contact Info + Passport Photo
          - CAREER OBJECTIVE
          - PERSONAL ATTRIBUTES
          - EDUCATIONAL QUALIFICATIONS
      ======================================================== */}
      <div
        id="cv-page-1"
        className="bg-white text-slate-900 p-8 sm:p-12 max-w-[800px] mx-auto shadow-2xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:p-0 flex flex-col justify-between"
        style={{ minHeight: '1120px' }}
      >
        <div className="space-y-6">
          {/* Top Header Section: Left Info, Right Photo */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1.5 flex-1">
              <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900">
                Curriculum Vitae
              </div>
              <div className="text-lg font-serif italic text-slate-700">of</div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-[#1e40af] tracking-wide uppercase">
                {displayName || <span className="text-slate-300 font-normal">___________________________</span>}
              </div>

              <div className="pt-2 space-y-1 text-xs sm:text-sm text-slate-800 font-medium">
                <div>
                  <span className="font-bold">Contact No : </span>
                  <span>{data.contactNo || <span className="text-slate-400 font-normal">___________________</span>}</span>
                </div>
                <div>
                  <span className="font-bold">Email: </span>
                  <span className="text-red-600 font-semibold underline underline-offset-2">
                    {data.email || <span className="text-slate-400 font-normal no-underline">___________________</span>}
                  </span>
                </div>
                <div>
                  <span className="font-bold underline">Present Address:</span>
                  <p className="mt-0.5 text-slate-700">
                    {data.presentAddress || <span className="text-slate-400 font-normal">_____________________________________</span>}
                  </p>
                </div>
                <div>
                  <span className="font-bold underline">Permanent Address:</span>
                  <p className="mt-0.5 text-slate-700">
                    {data.permanentAddress || <span className="text-slate-400 font-normal">_____________________________________</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Photo matching reference zahid vi.pdf */}
            <div className="shrink-0">
              <div className="w-32 h-40 sm:w-36 sm:h-44 border-2 border-slate-400 p-1 bg-white shadow-xs">
                {data.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.photoUrl}
                    alt="Profile Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-center p-2 text-xs font-semibold">
                    <span>Photo</span>
                    <span className="text-[10px] text-slate-400 mt-1">(Passport Size)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: CAREER OBJECTIVE */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              CAREER OBJECTIVE
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {data.careerObjective || (
                <span className="text-slate-400 italic">No career objective specified.</span>
              )}
            </p>
          </div>

          {/* Section 2: PERSONAL ATTRIBUTES */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              PERSONAL ATTRIBUTES
            </div>
            {data.personalAttributes && data.personalAttributes.filter((a) => a.trim()).length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6 font-medium">
                {data.personalAttributes
                  .filter((a) => a.trim())
                  .map((attr, idx) => (
                    <li key={idx} className="leading-snug">
                      {attr}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-400 italic pl-4">No attributes added.</p>
            )}
          </div>

          {/* Section 3: EDUCATIONAL QUALIFICATIONS (Table) */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              EDUCATIONAL QUALIFICATIONS
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <th className="border border-black p-2 text-center">Qualification</th>
                    <th className="border border-black p-2 text-center">Group</th>
                    <th className="border border-black p-2 text-center">Institution Name</th>
                    <th className="border border-black p-2 text-center">GPA</th>
                    <th className="border border-black p-2 text-center">Passing Year</th>
                  </tr>
                </thead>
                <tbody>
                  {data.education && data.education.length > 0 ? (
                    data.education.map((edu, idx) => (
                      <tr key={idx} className="text-center font-medium">
                        <td className="border border-black p-2 font-bold">{edu.qualification || '-'}</td>
                        <td className="border border-black p-2">{edu.group || '-'}</td>
                        <td className="border border-black p-2">{edu.institutionName || '-'}</td>
                        <td className="border border-black p-2">{edu.gpa || '-'}</td>
                        <td className="border border-black p-2 font-bold">{edu.passingYear || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center text-slate-400">
                      <td colSpan={5} className="border border-black p-3 italic">
                        No education records added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Page 1 Footer Note */}
        <div className="pt-4 text-right text-[10px] text-slate-400 font-mono">
          Page 1 of 2
        </div>
      </div>

      {/* Visual Page Break Separator (Hidden in print) */}
      <div className="no-print max-w-[800px] mx-auto flex items-center justify-center gap-3 py-2 text-xs font-bold text-slate-400">
        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1" />
        <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
          Page 2 Begins Below
        </span>
        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1" />
      </div>

      {/* ========================================================
          PAGE 2 (A4 Dimension Layout)
          - INTEREST & HOBBY
          - LANGUAGE PROFICIENCY
          - PERSONAL DETAILS
          - Declaration Box (Bordered directly below Personal Details)
          - Signature (Neatly on medium right side at bottom)
      ======================================================== */}
      <div
        id="cv-page-2"
        className="bg-white text-slate-900 p-8 sm:p-12 max-w-[800px] mx-auto shadow-2xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:p-0 print:break-before-page flex flex-col justify-between"
        style={{ minHeight: '1120px' }}
      >
        <div className="space-y-6">
          {/* Section 4: INTEREST & HOBBY */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              INTEREST & HOBBY
            </div>
            {data.interestsAndHobbies && data.interestsAndHobbies.filter((h) => h.trim()).length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6 font-medium">
                {data.interestsAndHobbies
                  .filter((h) => h.trim())
                  .map((hobby, idx) => (
                    <li key={idx} className="leading-snug">
                      {hobby}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-400 italic pl-4">No interests added.</p>
            )}
          </div>

          {/* Section 5: LANGUAGE PROFICIENCY */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              LANGUAGE PROFICIENCY
            </div>
            {data.languageProficiency && data.languageProficiency.filter((l) => l.trim()).length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6 font-medium">
                {data.languageProficiency
                  .filter((l) => l.trim())
                  .map((lang, idx) => (
                    <li key={idx} className="leading-snug">
                      {lang}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-400 italic pl-4">No language proficiencies added.</p>
            )}
          </div>

          {/* Section 6: PERSONAL DETAILS */}
          <div>
            <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
              PERSONAL DETAILS
            </div>
            <div className="mt-3 text-xs sm:text-sm text-slate-800 pl-4 space-y-1.5 font-medium">
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Name</span>
                <span>: {data.personalDetails?.name || data.name || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Father&apos;s Name</span>
                <span>: {data.personalDetails?.fathersName || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Mother&apos;s Name</span>
                <span>: {data.personalDetails?.mothersName || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Date of Birth</span>
                <span>: {data.personalDetails?.dateOfBirth || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Nationality</span>
                <span>: {data.personalDetails?.nationality || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• NID No</span>
                <span>: {data.personalDetails?.nidNo || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Religion</span>
                <span>: {data.personalDetails?.religion || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Marital Status</span>
                <span>: {data.personalDetails?.maritalStatus || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Sex</span>
                <span>: {data.personalDetails?.sex || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Height</span>
                <span>: {data.personalDetails?.height || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Weight</span>
                <span>: {data.personalDetails?.weight || '-'}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
                <span className="font-semibold">• Blood Group</span>
                <span>: {data.personalDetails?.bloodGroup || '-'}</span>
              </div>
            </div>
          </div>

          {/* Declaration Box (Bordered rectangle directly below Personal Details) */}
          <div className="mt-8 border-2 border-black p-3.5 text-center text-xs sm:text-sm font-serif text-slate-900 leading-relaxed">
            {data.declarationText ||
              'I hereby declare that all the details mentioned above are my own and true to the best of my knowledge.'}
          </div>
        </div>

        {/* Bottom Area: Signature Section (Neatly on medium right side) + Page 2 Footer Note */}
        <div className="mt-16 space-y-4">
          <div className="flex justify-end pr-4 sm:pr-8">
            <div className="text-center min-w-[220px] space-y-1">
              <div className="border-t border-black pt-1.5 font-bold text-xs sm:text-sm">
                Signature
              </div>
              <div className="text-xs sm:text-sm font-medium">
                ( {signatureDisplayName || <span className="text-slate-400 italic">Signature Name</span>} )
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 font-mono pt-2">
            Page 2 of 2
          </div>
        </div>
      </div>
    </div>
  );
}
