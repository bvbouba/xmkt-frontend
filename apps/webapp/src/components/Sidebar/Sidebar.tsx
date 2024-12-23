import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt, faInfoCircle, faBook, faQuestionCircle,
  faExclamationTriangle, faBell,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatPrice } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { BudgetDetails, ErrorLog } from 'types';
import { getBudgetDetail, getErrorLogByTeam, logout } from 'features/data';

export const SideBar: React.FC = () => {
  const router = useRouter()
  const [budget, setBudget] = useState<BudgetDetails>();
  const { data: session, status } = useSession()
  const [errors, setErrors] = useState<ErrorLog[]>([]);

  useEffect(()=>{
    if ( status === "authenticated" && session.teamID) {
      const fetchData = async () => {
        try {
          const budgetData = await getBudgetDetail({
            teamId: session.teamID,
            token: session.accessToken,
            period: session.activePeriod
          });
          setBudget(budgetData);

          const errorData = await getErrorLogByTeam({
            teamId: session.teamID,
            token: session.accessToken,
            period: session.activePeriod
          });
          setErrors(errorData);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData();
    }

  }, [status,session?.teamID,session?.accessToken,session?.activePeriod])
  
  const locale = router.locale;
  const { t } = useTranslation('common')

  const countErrors = errors.filter((error) => error.severity === 1).length || 0;
  const countWarnings = errors.filter((error) => error.severity !== 1).length || 0;
  
  const openModal = (severity: number) => {

    const url = `/${locale}/decide/errors/${severity}`;

    const newWindowFeatures = 'height=600,width=1200,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
    const newWindow = window.open(url, '_blank', newWindowFeatures);
    
    if (newWindow) {
      newWindow.focus();
    }
 
  };

  const handleClick = async() =>{
  if(status ==="authenticated"){
   try {
    await logout(session?.accessToken)
    signOut()
   } catch (error) {
     console.log("Couldn't logout")
   }
  }
  }
    
  const infoItems = [
    {title:t("COURSE"), value:session?.courseCode},
    {title:t("INDUSTRY"), value:session?.industryName},
    {title:t("TEAM"), value:session?.teamName},
  ]

  const newWindowFeatures = 'height=600,width=1200,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';



  return (
    <aside className="w-1/5 bg-gray-100 border-r border-gray-300  text-gray-500">
      {/* Logo */}
      <div className="mb-4 text-center bg-white">
        <img src={`/logo.svg`} alt="Logo" className="h-24 mx-auto" />
      </div>

      {/* User Information */}
      {session && <div className="bg-gray-100 p-4 mb-4">
        {
          infoItems.map((info,idx) =>
            <div key={idx}>
              <span className='uppercase'>{info.title}</span>: 
               <span className='font-bold'>{` ${info.value}`}</span>
              </div>
          )
        }
            <span className=''>
            {session?.user.lastname} {session?.user.firstname}
            </span>
      </div>}

      {/* Menu Icons */}
      <div className="grid grid-cols-4 p-2 gap-2 mb-4 bg-white">
        <div className="text-center">
      
            {session?.user && <button
              onClick={() => handleClick()}
            >
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="text-orange-500" />
              {t("LOGOUT")}
            </button>}

        </div>
        <div className="text-center">
          <FontAwesomeIcon icon={faInfoCircle} size="lg" className="text-green-500" />
          <div>{t("TEAM_INFO")}</div>
        </div>
        <div className="text-center">
          <FontAwesomeIcon icon={faBook} size="lg" className="text-pink-500" />
          <div>{t("MANUAL")}</div>
        </div>
        <div className="text-center">
          <FontAwesomeIcon icon={faQuestionCircle} size="lg" className="text-blue-500" />
          <div>{t("FAQ")}</div>
        </div>
      </div>

      {/* Decision Round Information */}
      <div className='mb-4 cursor-pointer'>
        <div className="text-blue-500 text-xl px-2 uppercase border-b border-gray-300">
          {t("DECISION_ROUND")} {session?.activePeriod}
        </div>

        {/* Errors Indicator */}
        {(countErrors > 0) && (<div className="flex items-center border-t border-b border-gray-300 p-2">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
          <div onClick={() => openModal(1)} className='text-green-600'>
            {t("ERRORS")}: <span className="font-bold">{countErrors}</span>
          </div>
        </div>)}

        {(countWarnings > 0) && (<div className="flex items-center border-b border-gray-300 p-2">
          <FontAwesomeIcon icon={faBell} className="text-yellow-500 mr-2" />
          <div onClick={() => openModal(2)} className='text-green-600'>
            {t("WARNINGS")}: <span className="font-bold">{countWarnings}</span>
          </div>
        </div>)}
      </div>


      {/* Financial Information */}
      {budget && <div className="mb-4">
        <div className="p-4 grid gap-2">
          <div className="flex items-center justify-between uppercase">
            <div>{t("AUTHORIZED_BUDGET")}</div>
            <div className="ml-4">${formatPrice(budget?.budget)}</div>
          </div>
          {budget?.loans > 0 && <div className="flex items-center justify-between text-green-500 uppercase">
            <div>{t("LOANS")}</div>
            <div className="ml-4">${formatPrice(budget?.loans)}</div>
          </div>}
          <div className="flex items-center justify-between uppercase">
            <div>{t("EXPENSES")}</div>
            <div className="ml-4">${formatPrice(budget?.expenses)}</div>
          </div>
          <div className="flex items-center font-bold justify-between border-t border-gray-500 uppercase">
            <div>{t("DEVIATION")}</div>
            <div className={`ml-4 ${(budget?.deviation < 0) ? "text-red-500" : ""}`}>${formatPrice(budget?.deviation)}</div>
          </div>
        </div>
      </div>}
    </aside>
  );
};



export default SideBar;