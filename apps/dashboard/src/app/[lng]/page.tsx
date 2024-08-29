"use client"; // Necessary if using hooks like useState or useEffect in the App Router

import { useSession } from 'next-auth/react';
import { useTranslation } from '../i18n'


export default  function HomePage({ params: { lng } }:{params: { lng: string };}) {
  const { t } =  useTranslation(lng)
  const { data: session } = useSession();
  
  return (
    <main className="flex items-start min-h-screen p-8 bg-gray-100">
      <div className="space-y-6 text-black">
        <h1 className="text-3xl font-bold">{t('welcome')} {session?.user?.name}</h1>
        <p className="text-lg">{t('here_are_your_options')}:</p>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>{t('edit_profile')}</li>
          <li>{t('manage_courses')}</li>
          <li>{t('contact_us')}</li>
        </ul>
      </div>
    </main>
  );
}