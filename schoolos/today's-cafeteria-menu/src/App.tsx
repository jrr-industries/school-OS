import React, { useState } from 'react';
import { SchoolOSHeader } from './components/SchoolOSHeader';
import { DashboardContainer } from './components/DashboardContainer';
import { defaultMenuData } from './data/mockData';
import { Role } from './types';

export default function App() {
  const [role, setRole] = useState<Role>('student');
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Construct current menu state based on isPublished
  const currentMenuData = {
    ...defaultMenuData,
    isPublished,
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <SchoolOSHeader
        role={role}
        setRole={setRole}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
      />
      <main className="flex-1">
        <DashboardContainer role={role} data={currentMenuData} />
      </main>
    </div>
  );
}
