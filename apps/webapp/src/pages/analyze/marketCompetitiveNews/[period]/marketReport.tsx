import { Loading } from "@/components/Loading";
import { HeaderContainer, ParagraphContainer } from "@/components/container";
import { unitMsItems, valueMsItems } from "@/lib/constants";
import { getBrandData, getFeaturesData } from "features/analyzeSlices";
import { getMarketingMixData } from "features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useAuth } from "@/lib/providers/AuthProvider";
import { unitMsProps, valueMsProps } from "types";
import { formatPrice, getValueByBrand, lowercase, translateFeatures } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {  useEffect } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function MarketReport({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {

  const router = useRouter()
  const { period } = router.query as { period: string};
  const selectedPeriod = parseInt(period)
  const {participant} = useAuth();
  
  const dispatch = useAppDispatch();
  const {  industryID, firmID } = participant || {};
    const { t } = useTranslation('common')

  useEffect(() => {
    if (industryID) {
        dispatch(getBrandData({ industryID, firmID:0 }));
      dispatch(getFeaturesData());
    }
  }, [dispatch,industryID,firmID]);

  useEffect(() => {
    if (industryID) {
      dispatch(getMarketingMixData({ industryID, firmID:0,period:selectedPeriod }));
    }
  }, [dispatch,selectedPeriod,industryID]);


  const {data:brandData, loading:bloading} = useAppSelector((state) => state.analyze.brand);
  const {data:m2Data, loading:mloading} = useAppSelector((state) => state.decide.marketingMix);
  const {data:featuresData} = useAppSelector((state) => state.analyze.features);

  const features = translateFeatures(featuresData,locale)

  const selectedValueMsData = brandData.filter(row => row.period_id === selectedPeriod).map((row1) => {
    let temp:valueMsProps={
        name: '',
      market_share: 0,
      revenue: 0,
      variation: 0,
      brand_name: '',
      value_market_share: 0
    }
    valueMsItems.map(row2 =>{
            if(row2.field === `variation`){
             
              temp[row2.field]= (getValueByBrand(brandData,row1.brand_name,selectedPeriod,row2.id) - getValueByBrand(brandData,row1.brand_name,selectedPeriod-1,row2.id));
               }else{
              temp[row2.field]=getValueByBrand(brandData,row1.brand_name,selectedPeriod,row2.id)
               }
             })
    return temp })

    
const selectedUnitMsData = brandData.filter(row => row.period_id === selectedPeriod).map((row1) => {
    let temp:unitMsProps={
        name: '',
      market_share: 0,
      unit_sold: 0,
      variation: 0,
      brand_name: '',
      unit_market_share: 0
    }
    unitMsItems.map(row2 =>{
           if(row2.field === `variation`){
            temp[row2.field]= getValueByBrand(brandData,row1.brand_name,selectedPeriod,row2.id)
             - getValueByBrand(brandData,row1.brand_name,selectedPeriod-1,row2.id)
             }else{
            temp[row2.field]=getValueByBrand(brandData,row1.brand_name,selectedPeriod,row2.id)
             }
          })
    return temp })
    
    const title = t("MARKET_REPORT_-_PERIOD",{selectedPeriod})
   
    return (
        <>
        
          

        <div className="container mx-auto p-4">

        <HeaderContainer   title={title} content={`${t("THIS_REPORT_PROVIDES_GENERAL_INFORMATION_FOR_ALL_BRANDS_MARKETED_")} ${selectedPeriod}`} />

      <div className="p-1">
        <ParagraphContainer title= {t("BRAND_RETAIL_SALES_AND_VOLUME")} content={t("THIS_TWO_TABLE_BELOW_SHOWS_THE_MARKETED_BRANDS_RETAIL_SALES_(IN_T")} />
        
        <div className="grid grid-cols-2 gap-4 m-4">
          <div className="col">
          {bloading ? <Loading />:  
          <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col">Brand </th>
                  <th scope="col" className="px-2 py-1" align="center">{t("VALUE_SHARE")} </th>
                  <th scope="col" className="px-2 py-1" align="center">{t("RETAIL_SALES")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("VARIATION")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedValueMsData.sort((a,b)=>a.market_share - b.market_share).slice().sort((a, b) => b.revenue - a.revenue).map((entry,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td scope="row " className={`px-2 py-1 font-bold font-medium text-gray-900 whitespace-nowrap dark:text-white`}>
                      {entry.brand_name}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.value_market_share}%
                    </td>
                    <td className="px-2 py-1" align="center">
                      {formatPrice(entry.revenue)}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {formatPrice(entry.variation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </div>

           <div className="col">
           {bloading ? <Loading />:  
           <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col">{t("BRAND")} </th>
                  <th scope="col" align="center">{t("UNIT_SHARE")} </th>
                  <th scope="col" className="px-2 py-1" align="center">{t("VOLUME")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("VARIATION")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedUnitMsData.sort((a, b) => b.unit_market_share - a.unit_market_share).map((entry,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <td scope="row " className={`px-2 py-1 font-medium font-bold text-gray-900 whitespace-nowrap dark:text-white`}>
                      {entry.brand_name}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.unit_market_share}%
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.unit_sold}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.variation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> }
          </div>
        </div>
      </div>

      <div className="p-1">
        <ParagraphContainer title= {t("BRAND_CHARACTERISTICS")} content={`${t("THIS_TABLE_BELOW_LISTS_THE_PHYSICAL_ATTRIBUTES_OF_MARKETED_BRANDS")}.`} />

        <div className="row align-items-center p-4">

        {mloading ? <Loading />:  
           <div className="col">
            {features && (
              <>
              <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 font-bold">
                  <th scope="col" className="px-2 py-1">{t("BRAND_NAME")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("LAUNCHED_DATE")}</th>
                  {features.slice(0, 5).map((feature) => (
                    <th key={feature.id} scope="col" className="px-2 py-1" align="center">
                      {feature.abbrev}
                    </th>
                  ))}
                  <th scope="col" className="px-2 py-1" align="center">{t("PRICE")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("BASE_COST")}</th>
                  <th scope="col" className="px-2 py-1" align="center">{t("BASE_COST_%_OF_PRICE")}</th>
                </tr>
              </thead>
              <tbody>
                {m2Data.filter(m=>m.is_active === true).map((data) => (
                  <tr key={data.id}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <td className="px-2 py-1 font-medium font-bold text-gray-900 whitespace-nowrap dark:text-white">{data.brand_name}</td>
                    <td className="px-2 py-1" align="center">{data.project.available_period}</td>
                    {features.slice(0, 5).map((feature) => (
                      <td key={feature.id} className="px-2 py-1" align="center">{data.project[feature.surname]}</td>
                    ))}
                    <td className="px-2 py-1" align="center">{data.price}</td>
                    <td className="px-2 py-1" align="center">{data.project.base_cost}</td>
                    <td className="px-2 py-1" align="center">{((data.project.base_cost / data.price) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="f_annotation text-xs">
              {features?.map((feature) => (
                <span className="pr-5" key={feature.id}>
                  {feature.abbrev} ({feature.unit}): {t("FROM")} {feature.range_inf} {lowercase(t("TO"))} {feature.range_sup}.
                </span>
              ))}
            </span> 
            </>
            )}
          </div> 
         }
        </div>
      </div>
    </div>
        </>
      );
}

export default MarketReport;


export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

// MarketReport.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };