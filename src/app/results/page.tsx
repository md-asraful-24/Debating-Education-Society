'use client';

import React from 'react';
import WinnerShowcase from '@/components/WinnerShowcase';

export default function ResultsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <WinnerShowcase showTitle={true} />
    </div>
  );
}
