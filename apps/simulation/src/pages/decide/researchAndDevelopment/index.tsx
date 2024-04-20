import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { SuccessMessage } from "@/components/ToastMessages";
import { ButtonNext } from "@/components/button";
import { getMarketsData, getProjectData } from "@/lib/features/analyzeSlices";
import { fetchDecisionStatus } from "@/lib/features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function ResearchAndDevelopment({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
   const paths = usePaths()
  const dispatch = useAppDispatch();
  const {participant} = useAuth()
  const {industryID, firmID,activePeriod } =
    participant || {};
    const { t } = useTranslation('common')
    
    useEffect(() => {
      if(industryID){
      dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
      }
    }, [dispatch,industryID]);
    
    const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
    const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
    
  
    useEffect(() => {
        // Dispatch actions to get firm and brand data when the component mounts
        if (firmID && industryID && activePeriod) {
          dispatch(getProjectData({ industryID, firmID, period:activePeriod }));
          dispatch(getMarketsData());
        }
      }, [dispatch,firmID, industryID, activePeriod]);
    

      const {data:projects} = useAppSelector((state) => state.analyze.projects);
      const {data:markets} = useAppSelector((state) => state.analyze.markets);
      const {success:rsuccess} = useAppSelector((state) => state.decide.queryResult);

      // if(isDecisionInProgress) return<> Decision is in Progress</>
return ( <>
         
         {rsuccess && <SuccessMessage message={t("ADDED_SUCCESSFULLY")} />}
         <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">{t("RESEARCH_&_DEVELOPMENT_-_OVERVIEW")}</h1>
      <div className="mb-8">
        {(projects.going?.length) ? (
          <>
            <p className="mb-4">
             {t("_YOUR_CURRENT_R&D_DECISIONS_ARE_SUMMARIZED_BELOW._CLICK_ON_A_NAME")}
            </p>
            <table className="table-auto w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-s-lg"></th>
                  <th scope="col" className="px-6 py-3">{t("MARKET")}</th>
                    <th scope="col" className="px-6 py-3">{t("LAUNCHED_IN")}</th>
                    <th scope="col" className="px-6 py-3">{t("OBJECTIVE")}</th>
                    <th scope="col" className="px-6 py-3">{t("BUDGET_REQUIRED_FOR_COMPLETION")}</th>
                    <th className="px-6 py-3 rounded-e-lg">{t("BUDGET_ALLOCATED_THIS_PERIOD")}</th>
                </tr>
              </thead>
              <tbody>
                {projects.going?.map((entry, index) => (
                  <tr key={index} 
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                      <th scope="row" 
                      className='px-6 py-4 font-medium text-blue-900 whitespace-nowrap dark:text-white text-center'>
                       <Link href={paths.decide.researchAndDevelopment.project.update._project_id(entry.id).$url()}>
                        <button
                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                        >{entry.name}</button>
                        </Link>
                      </th>
                      <td className='px-6 py-4 text-center'>
                       {entry.market_name}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.creation_period}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.objective}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.budget_required_for_completion}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.allocated_budget_for_current_period}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>{t("YOUR_R&D_DECISIONS_ARE_CURRENTLY_EMTPY.")}</p>
        )}
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4">
          {markets.map((entry, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <Link href={paths.decide.researchAndDevelopment.project.add._market_id(entry.id).$url()}>
               <ButtonNext>
               {t("START_A_NEW_PROJECT",{name:entry.name})}</ButtonNext>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div>
   <Link href={paths.decide.$url()}> <button 
   className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
   > {t("DECISION_HOME")} </button></Link>
  </div>
    </div>
    </> );
}

export default ResearchAndDevelopment;

ResearchAndDevelopment.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  