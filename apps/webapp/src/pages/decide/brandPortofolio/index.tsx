import { Layout } from "@/components/Layout";
import { ButtonNext } from "@/components/button";
import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { brandPortofolioProps, decideStatusProps, marketProps } from "types";
import { fetchBrands, fetchDecisionStatus, getMarketsData } from "features/data";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function BrandPortofolio({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const paths = usePaths(); // Assuming `usePaths` is a custom hook
const { t } = useTranslation('common');
const { data: session, status } = useSession(); // Getting session data from next-auth

const industryID = session?.industryID;
const firmID = session?.firmID;
const activePeriod = session?.activePeriod;

const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
const [brands, setBrands] = useState<brandPortofolioProps[]>([]);
const [markets, setMarkets] = useState<marketProps[]>([]);
const [loading, setLoading] = useState(true);

// Fetch Decision Status
useEffect(() => {
  if (status === "authenticated" && industryID) {
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
}, [status,industryID,session?.accessToken]);

const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);

// Fetch Brands and Markets
useEffect(() => {
  if (status === "authenticated" && firmID && industryID) {
    const fetchBrandAndMarketData = async () => {
      setLoading(true);
      try {
        const response1 = await fetchBrands({ industryID, firmID, token: session.accessToken });
        const response2 = await getMarketsData();
        
        setBrands(response1);
        setMarkets(response2);
      } catch (error) {
        console.error("Error fetching brands and markets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandAndMarketData();
  }
}, [status,firmID,industryID,session?.accessToken]);



if (status==="loading" && loading) {
  return <p>{t("LOADING...")}</p>;
}

      // if(isDecisionInProgress) return<> Decision is in Progress</>
    return ( 
        <>
        
        <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">{t("BRAND_PORTFOLIO_-_DECISION")}</h1>
      <div className="mb-4">
        <p className="text-sm">{t("CLICK_ON_A_NAME_TO_MODIFY_OR_WITHDRAW_THIS_BRAND_OR_TO_UNDO_YOUR_")}</p>
      </div>

      <div className="mb-8">
      <table className="table-auto w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-s-lg"></th>
                  <th scope="col" className="px-6 py-3">{t("MARKET")}</th>
                    <th scope="col" className="px-6 py-3">{t("LAUNCHED_IN")}</th>
                    <th scope="col" className="px-6 py-3">{t("ROLE_IN_PORTOFOLIO")}</th>
                    <th scope="col" className="px-6 py-3">{t("PORTOFOLIO_OPERATION")}</th>
                    <th className="px-6 py-3 rounded-e-lg">{t("BASE_PROJECT_PERIOD", {period:(activePeriod || 0)-1})}</th>
                    <th className="px-6 py-3 rounded-e-lg">{t("BASE_PROJECT_PERIOD", {period:activePeriod})}</th>
                </tr>
              </thead>
              <tbody>
                {brands?.map((entry, index) => (
                  <tr key={index} 
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                      <th scope="row" 
                      className='px-6 py-4 font-medium text-blue-900 whitespace-nowrap dark:text-white text-center'>
                       <Link href={paths.decide.brandPortofolio.brand.update._brand_id(entry.id).$url()}>
                        <button
                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                        >{entry.name}</button>
                        </Link>
                      </th>
                      <td className='px-6 py-4 text-center'>
                       {entry.market_name}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.since}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.role}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {(locale==="fr")?entry.operation_fr:entry.operation}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.last_project_name}
                      </td>
                      <td className='px-6 py-4 text-center'>
                       {entry.project_name}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>

  

      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4">
       <div> <p className="text-sm">{t("CLICK_ON_THE_BUTTON_BELOW_TO_LAUNCH_A_NEW_PRODUCT")}</p></div>
          {markets.map((entry, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <Link href={paths.decide.brandPortofolio.brand.add._market_id(entry.id).$url()}>
               <ButtonNext>
               {t("LAUNCH_A_NEW_BRAND", {name:entry.name})}</ButtonNext>
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
        </>
     );
}

export default BrandPortofolio;

BrandPortofolio.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  