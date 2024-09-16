import { Layout } from "@/components/Layout";
import { fetchDecisionStatus, getMarketingMixData } from "features/decideSlices";
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


function MarketingMix({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
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
      const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 1);
      
    
    useEffect(() => {
      // Dispatch actions to get firm and brand data when the component mounts
      if (firmID && industryID && activePeriod ) {
        dispatch(getMarketingMixData({ industryID, firmID,period:activePeriod }));
      }
    }, [dispatch,firmID, industryID, activePeriod]);
 
    const {data} = useAppSelector((state) => state.decide.marketingMix);
    const selectedData = data.filter(entry => entry.is_active === true)
    // if(isDecisionInProgress) return<> Decision is in Progress</>
    return ( 
        <>
        
        <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">{t("MARKETING_MIX_DECISIONS_-_OVERVIEW")}</h1>
      <div className="mb-4">
        <p className="text-sm">{t("YOUR_MARKETING_MIX_DECISIONS_ARE_SUMMARIZED_IN_THE_TABLE_BELOW._C")}</p>
      </div>

      <div className="mb-8">
      <table className="table-auto w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-s-lg"></th>
                  <th scope="col" className="px-6 py-3">{t("MARKET")}</th>
                    <th scope="col" className="px-6 py-3">{t("LAUNCHED_IN")}</th>
                    <th scope="col" className="px-6 py-3">{t("ROLE_IN_PORTOFOLIO")}</th>
                    <th scope="col" className="px-6 py-3">{t("PRODUCTION_PLANNING")}</th>
                    <th className="px-6 py-3">{t("PRICE")} </th>
                    <th className="px-6 py-3 rounded-e-lg">{t("ADVERTISING")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedData?.map((entry) => (
                  <tr key={entry.id} 
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                      <th scope="row" 
                      className='px-6 py-4 font-medium text-blue-900 whitespace-nowrap dark:text-white text-center'>
                       <Link href={paths.decide.marketingMix._id(entry.id).$url()}>
                        <button
                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                        >{entry.brand_name}</button>
                        </Link>
                      </th>
                      <td className='px-6 py-4 text-center'>
                       {entry.market_name}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.launched_period}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.role}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.production}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.price}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.advertising}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>


      <div>
   <Link href={paths.decide.$url()}> <button 
   className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
   > {t("DECISION_HOME")} </button></Link>
  </div>
    </div>
        </>
     );
}

export default MarketingMix;

MarketingMix.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  