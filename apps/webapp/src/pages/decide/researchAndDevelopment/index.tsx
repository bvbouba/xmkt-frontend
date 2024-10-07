import { Layout } from "@/components/Layout";
import { ButtonNext } from "@/components/button";
import usePaths from "@/lib/paths";
import { decideStatusProps } from "@/lib/type";
import { fetchDecisionStatus, getMarketsData, getProjectData } from "features/data";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { marketProps, rndProjectProps } from "types";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function ResearchAndDevelopment({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const paths = usePaths();
  const { data: session, status } = useSession();
  const { industryID, firmID, activePeriod } = session || {};
  const { t } = useTranslation('common');
  
  const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
  const [projects, setProjects] = useState<rndProjectProps>();
  const [markets, setMarkets] = useState<marketProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch decision status when industryID is available
  useEffect(() => {
    if (status === 'authenticated' && industryID) {
      const fetchDecisionStatusData = async () => {
        try {
          const data = await fetchDecisionStatus({ industryID, token: session.accessToken });
          setDecisionStatus(data);
        } catch (error) {
          console.error('Error fetching decision status:', error);
        }
      };
      fetchDecisionStatusData();
    }
  }, [status, industryID,session?.accessToken]);
  
  const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
  
  // Fetch project and market data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && firmID && industryID && activePeriod) {
        setLoading(true);
        try {
          const projectData = await getProjectData({ industryID, firmID, period: activePeriod, token: session.accessToken });
          setProjects(projectData);
          const marketsData = await getMarketsData();
          setMarkets(marketsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [status,firmID,industryID,activePeriod,session?.accessToken]);

  if (status==="loading" && loading) {
    return <p>{`${t("loading")}...`}</p>;
  }

return ( <>
         
         <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">{t("RESEARCH_&_DEVELOPMENT_-_OVERVIEW")}</h1>
      <div className="mb-8">
        {(projects?.going?.length) ? (
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
  