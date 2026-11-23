'use client';

import React from 'react';
import { CVData } from '@/lib/types';

interface CvTemplateProps {
  data: CVData;
}

export default function CvTemplate({ data }: CvTemplateProps) {
  return (
    <div
      id="cv-printable-document"
      className="bg-white text-slate-900 p-8 sm:p-12 max-w-[800px] mx-auto shadow-xl rounded-sm border border-slate-200 print:border-none print:shadow-none print:p-0 font-sans"
      style={{ minHeight: '1050px' }}
    >
      {/* Top Header Section: Left Info, Right Photo */}
      <div className="flex items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
        <div className="space-y-1.5 flex-1">
          <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900">
            Curriculum Vitae
          </div>
          <div className="text-lg font-serif italic text-slate-700">of</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-[#1e40af] tracking-wide uppercase">
            {data.name || 'MD ZAHID HASAN .'}
          </div>

          <div className="pt-2 space-y-1 text-xs sm:text-sm text-slate-800 font-medium">
            <div>
              <span className="font-bold">Contact No : </span>
              <span>{data.contactNo || '+8801873528395 .'}</span>
            </div>
            <div>
              <span className="font-bold">Email: </span>
              <span className="text-red-600 font-semibold underline underline-offset-2">
                {data.email || 'zahidmaxshahi@gmail.com .'}
              </span>
            </div>
            <div>
              <span className="font-bold underline">Present Address:</span>
              <p className="mt-0.5 text-slate-700">
                {data.presentAddress || 'Labsha, Satkhira Sadar, Satkhira .'}
              </p>
            </div>
            <div>
              <span className="font-bold underline">Permanent Address:</span>
              <p className="mt-0.5 text-slate-700">
                {data.permanentAddress || 'Home:Kakdanga, Village/Road: Bagadanga, P.O:Hotatgonj-9410, Kalaroa, Satkhira.'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Photo matching zahid vi.pdf */}
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
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                Photo (Passport)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 1: CAREER OBJECTIVE */}
      <div className="mt-6">
        <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
          CAREER OBJECTIVE
        </div>
        <p className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
          {data.careerObjective ||
            'To obtain a job working in a challenging environment to use conceptual & technical know-how takes an organization in current millennium.'}
        </p>
      </div>

      {/* Section 2: PERSONAL ATTRIBUTES */}
      <div className="mt-6">
        <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
          PERSONAL ATTRIBUTES
        </div>
        <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6">
          {data.personalAttributes && data.personalAttributes.length > 0 ? (
            data.personalAttributes.map((attr, idx) => (
              <li key={idx} className="leading-snug">
                {attr}
              </li>
            ))
          ) : (
            <>
              <li>Hard Working .</li>
              <li>Vibe coder .</li>
              <li>MS Word .</li>
              <li>Excel .</li>
              <li>Computer Fundamentals .</li>
              <li>Communication .</li>
              <li>Ability to learn quickly and implement efficiently .</li>
              <li>Ability to work independently and in a team .</li>
              <li>Working within tie and under pressure .</li>
              <li>Outsourcing .</li>
            </>
          )}
        </ul>
      </div>

      {/* Section 3: EDUCATIONAL QUALIFICATIONS (Table) */}
      <div className="mt-6">
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
                    <td className="border border-black p-2 font-bold">{edu.qualification}</td>
                    <td className="border border-black p-2">{edu.group}</td>
                    <td className="border border-black p-2">{edu.institutionName}</td>
                    <td className="border border-black p-2">{edu.gpa}</td>
                    <td className="border border-black p-2 font-bold">{edu.passingYear}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="text-center font-medium">
                    <td className="border border-black p-2 font-bold">S.S.C</td>
                    <td className="border border-black p-2">Commerce</td>
                    <td className="border border-black p-2">Bhadiali High School</td>
                    <td className="border border-black p-2">4.60</td>
                    <td className="border border-black p-2 font-bold">2015</td>
                  </tr>
                  <tr className="text-center font-medium">
                    <td className="border border-black p-2 font-bold">H.S.C</td>
                    <td className="border border-black p-2">Humanities</td>
                    <td className="border border-black p-2">Kalaroa Govt. College</td>
                    <td className="border border-black p-2">3.50</td>
                    <td className="border border-black p-2 font-bold">2018</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page break opportunity for print */}
      <div className="print:break-before-page mt-6">
        {/* Section 4: INTEREST & HOBBY */}
        <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
          INTEREST & HOBBY
        </div>
        <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6">
          {data.interestsAndHobbies && data.interestsAndHobbies.length > 0 ? (
            data.interestsAndHobbies.map((hobby, idx) => (
              <li key={idx} className="leading-snug">
                {hobby}
              </li>
            ))
          ) : (
            <>
              <li>Reading News Paper & Book .</li>
              <li>Creative writing.</li>
              <li>Traveling .</li>
              <li>I love to teach.</li>
            </>
          )}
        </ul>
      </div>

      {/* Section 5: LANGUAGE PROFICIENCY */}
      <div className="mt-6">
        <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
          LANGUAGE PROFICIENCY
        </div>
        <ul className="mt-3 space-y-1 text-xs sm:text-sm text-slate-800 list-disc pl-6">
          {data.languageProficiency && data.languageProficiency.length > 0 ? (
            data.languageProficiency.map((lang, idx) => (
              <li key={idx} className="leading-snug">
                {lang}
              </li>
            ))
          ) : (
            <li>Proficiency in English, Bengali (Reading, Writing, Speaking).</li>
          )}
        </ul>
      </div>

      {/* Section 6: PERSONAL DETAILS */}
      <div className="mt-6">
        <div className="bg-[#b9d5ec] text-slate-900 font-bold text-center py-1.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-serif">
          PERSONAL DETAILS
        </div>
        <div className="mt-3 text-xs sm:text-sm text-slate-800 pl-4 space-y-1 font-medium">
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Name</span>
            <span>: {data.personalDetails?.name || 'MD Zahid Hasan .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Father&apos;s Name</span>
            <span>: {data.personalDetails?.fathersName || 'MD Ziarul Islam .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Mother&apos;s Name</span>
            <span>: {data.personalDetails?.mothersName || 'Sumchun Nahar.'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Date of Birth</span>
            <span>: {data.personalDetails?.dateOfBirth || '01/12/2000 .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Nationality</span>
            <span>: {data.personalDetails?.nationality || 'Bangladeshi .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• NID No</span>
            <span>: {data.personalDetails?.nidNo || '8713243999 .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Religion</span>
            <span>: {data.personalDetails?.religion || 'Islam .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Marital Status</span>
            <span>: {data.personalDetails?.maritalStatus || 'Married .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Sex</span>
            <span>: {data.personalDetails?.sex || 'Male .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Height</span>
            <span>: {data.personalDetails?.height || "5'5.5\" ."}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Weight</span>
            <span>: {data.personalDetails?.weight || '56 kg .'}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-2">
            <span className="font-semibold">• Blood Group</span>
            <span>: {data.personalDetails?.bloodGroup || 'A+ (ve) .'}</span>
          </div>
        </div>
      </div>

      {/* Declaration Box */}
      <div className="mt-8 border-2 border-black p-3 text-center text-xs sm:text-sm font-serif text-slate-900">
        {data.declarationText ||
          'I hereby declare that all the details mentioned above are my own and true to the best of my knowledge.'}
      </div>

      {/* Signature Section */}
      <div className="mt-12 flex justify-end">
        <div className="text-center w-64 space-y-1">
          <div className="border-t border-black pt-1 font-bold text-xs sm:text-sm">
            Signature
          </div>
          <div className="text-xs sm:text-sm font-medium">
            ( {data.signatureName || data.name || 'MD Zahid Hasan'} )
          </div>
        </div>
      </div>
    </div>
  );
}
