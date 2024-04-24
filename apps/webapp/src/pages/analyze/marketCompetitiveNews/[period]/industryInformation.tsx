import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { HeaderContainer, ParagraphContainer } from "@/components/container";
import { getIndustryInfoData } from "@/lib/features/analyzeSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getEconomicData } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
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

function IndustryInformation({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const { period } = router.query as { period: string};
  const selectedPeriod = parseInt(period)
  const {participant} = useAuth();
  const dispatch = useAppDispatch();
  const {industryID, firmID, } = participant || {};
    const { t } = useTranslation('common')


  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (firmID && industryID) {
      dispatch(getIndustryInfoData({ industryID}));
    }
  }, [dispatch,firmID,industryID]);

  const {data:industryInfo, loading} = useAppSelector((state) => state.analyze.industryInfo);

  const selectedIndustryInfo = industryInfo.filter(row => row.period_id===selectedPeriod).map(
                    row1 => ({
                    id:row1.id,
                    label: (locale === "fr") ? row1.label.name_fr : row1.label.name,
                    desc: (locale === "fr") ? row1.label.desc_fr : row1.label.desc,
                    current: getEconomicData(industryInfo,selectedPeriod,row1.economic_id,`value`,row1.label.desc),
                    next: getEconomicData(industryInfo,selectedPeriod+1,row1.economic_id,`value`,row1.label.desc)
                    })
                )
   
                const title = t("INDUSTRY_INFORMATION_-_PERIOD",{selectedPeriod})

    return ( 
    <>
    
        
    <div className="container mx-auto p-4">
      <HeaderContainer title={title} content={t("THIS_REPORT_PROVIDES_ECONOMIC_DATA_FOR_THE_CURRENT_PERIOD_AS_WELL")} />

      <ParagraphContainer title={t("ECONOMIC_VARIABLES")} />

        <div className="col pt-4">
        {loading ? <Loading />: 
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col"> </th>
                  <th scope="col" align="center"> {t("DESCRIPTION")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("CURRENT_PERIOD_VALUE")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("NEXT_PERIOD_ESTIMATION")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedIndustryInfo.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <td scope="row " className={`px-2 py-1 font-medium font-bold text-gray-900 whitespace-nowrap dark:text-white`}>
                      {entry.label}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.desc}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.current}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.next}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </div>
    </> );
}

export default IndustryInformation;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

// IndustryInformation.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };
  