"use client"; // Necessary if using hooks like useState or useEffect in the App Router

import { useTranslation } from 'next-i18next';


export default function HomePage() {
  const { t } = useTranslation('common');

  return (
    <main className="flex items-start min-h-screen p-8 bg-gray-100">
      <div className="space-y-6 text-black">
        <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        <p className="text-lg">Here are your options:</p>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>{t('editProfile')}</li>
          <li>{t('createCourses')}</li>
          <li>{t('contactUs')}</li>
        </ul>
      </div>
    </main>
  );
}