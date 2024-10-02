import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt, faInfoCircle, faBook, faQuestionCircle,
  faExclamationTriangle, faBell,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatPrice, uppercase } from '@/lib/utils';
import { CustomModal as Modal } from "@/components/Modal"
import { useSession, signOut } from 'next-auth/react';
import { BudgetDetails, ErrorLog } from 'types';
import { getBudgetDetail, getErrorLogByTeam, logout } from 'features/data';

export const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ErrorLog[]>([]);
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
  const basePath=process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'
  const locale = router.locale;
  const { t } = useTranslation('common')

  const countErrors = errors.filter((error) => error.severity === 1).length || 0;
  const countWarnings = errors.filter((error) => error.severity !== 1).length || 0;
  const openModal = (severity: number) => {
    const filteredContent = errors.filter((error: any) => error.severity === severity);
    setModalContent(filteredContent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
  
  return (
    <aside className="w-1/6 bg-gray-100 border-r border-gray-300  text-gray-500">
      {/* Logo */}
      <div className="mb-4 text-center bg-white">
        <img src={`${basePath}/logo.svg`} alt="Logo" className="h-24 mx-auto" />
      </div>

      {/* User Information */}
      <div className="bg-gray-100 p-4 mb-4">
        <div>{t("COURSE")}: {session?.courseCode}</div>
        <div>{t("INDUSTRY")}: {session?.industryName}</div>
        <div>{t("TEAM")}: {session?.teamName}</div>
        <div>{t("USER")}: {session?.user.lastname} {session?.user.firstname} </div>
      </div>

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
      <div className='p-4 mb-4 cursor-pointer'>
        <div className="text-blue-500 p-2">
          {uppercase(t("DECISION_ROUND"))} {session?.activePeriod}
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


      {/* Modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} title={t("ERROR/WARNING_DETAILS")}
      >
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("TITLE")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("CONTENT")}
                </th>
              </tr>
            </thead>
            <tbody>
              {modalContent.map((item, index) => {
                const content = (locale === "fr") ? item.content_fr : item.content
                const title = (locale === "fr") ? item.title_fr : item.title
                const message = content.replace("<brand>", item.brand_name)
                return (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {title}
                    </td>
                    <td className="px-6 py-4">
                      {message}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Modal>



      {/* Financial Information */}
      {budget && <div className="mb-4">
        <div className="p-4 grid gap-2">
          <div className="flex items-center justify-between ">
            <div>{uppercase(t("AUTHORIZED_BUDGET"))}</div>
            <div className="ml-4">${formatPrice(budget?.budget)}</div>
          </div>
          {budget?.loans > 0 && <div className="flex items-center justify-between text-green-500 ">
            <div>{uppercase(t("LOANS"))}</div>
            <div className="ml-4">${formatPrice(budget?.loans)}</div>
          </div>}
          <div className="flex items-center justify-between">
            <div>{uppercase(t("EXPENSES"))}</div>
            <div className="ml-4">${formatPrice(budget?.expenses)}</div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-500">
            <div>{uppercase(t("DEVIATION"))}</div>
            <div className={`ml-4 ${(budget?.deviation < 0) ? "text-red-500" : ""}`}>${formatPrice(budget?.deviation)}</div>
          </div>
        </div>
      </div>}
    </aside>
  );
};



export default SideBar;