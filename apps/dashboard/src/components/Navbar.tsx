"use client"; // Add this at the top to make it a Client Component

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n';
import { signOut, useSession } from 'next-auth/react';

export const Sidebar =  ({lng}:{lng:string}) => {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const { t } =  useTranslation(lng, 'sidebar')
  const { data: session } = useSession();
  const navLinks = [
    { id: 0, title: t('home'), path: `/${lng}/` },
    { id: 1, title: t('profile'), path: `/${lng}/profile` },
    { id: 2, title: t('course'), path: `/${lng}/course` },
    { id: 4, title: t('contact_us'), path:`/${lng}/contact` },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (id: number) => {
    setActive(id);
  };

  return (
    <div className={`relative flex flex-col h-screen bg-blue-500 ${open ? 'w-64' : 'w-20'} transition-width duration-300`}>
      <div className="flex items-center justify-between h-20 bg-blue-600 px-4">
        <div className={`flex items-center ${!open && 'hidden'}`}>
          <span className="text-white text-lg font-semibold">SIMUPROF</span>
        </div>

        <button
          onClick={handleDrawerToggle}
          className="text-white p-2 rounded hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={open ? faArrowLeft : faArrowRight} />
        </button>
      </div>

      <ul className="flex-1 mt-4">
        {navLinks.map((link) => (
          <li
            key={link.id}
            onClick={() => handleMenuItemClick(link.id)}
            className={`cursor-pointer py-3 px-4 flex items-center ${
              active === link.id
                ? 'bg-blue-300'
                : 'hover:bg-blue-700 bg-blue-500'
            } transition-colors duration-200`}
          >
            <Link href={link.path}>
              <span className={`text-white text-sm ${!open && 'hidden'}`}>{link.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-4 w-full px-4">
        <form
        action={async () => {
          await signOut({
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          });
        }}
        >
        {session?.user && <button
          onClick={()=>console.log("log out")}
          className="text-white p-2 rounded hover:bg-blue-700 w-full text-left flex items-center justify-start"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span className={`text-sm ${!open && 'hidden'}`}>{t("logout")}</span>
        </button>}
        </form>
      </div>
    </div>
  );
};


export default Sidebar;
