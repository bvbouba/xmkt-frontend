import { HeaderContainer, ParagraphContainer } from "@/components/container";
import { unitMsItems, valueMsItems } from "@/lib/constants";

import { brandProps, featureProps, firmProps, markertingMixProps, unitMsProps, valueMsProps } from "types";
import { formatPrice, getValueByBrand, lowercase, translateFeatures } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {  useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getBrandResultByFirm, getFeaturesData, getMarketingMixData } from "features/data";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function MarketReport({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const {  industryID, firmID,  } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [brandData,setBrandData] = useState<brandProps[]>()
  const [featuresData,setGetfeaturesData] = useState<featureProps[]>([])
  const [m2Data,setM2Data] = useState<markertingMixProps[]>([])

  const [loading,setLoading] = useState(true)
  
  const { t } = useTranslation('common')

  useEffect(() => {
    if (status === "authenticated" && firmID && industryID) {
     
      const loadData = async () => {
        setLoading(true)
        try {
          const response1 = await getBrandResultByFirm({ industryID, firmID:0, token: session.accessToken });
          const response2 = await getMarketingMixData({ industryID, firmID:0,period:selectedPeriod , token: session.accessToken,fields:"is_active,brand_name,price,project" });
          const response3 = await getFeaturesData()
          setBrandData(response1)
          setM2Data(response2)
          setGetfeaturesData(response3)
        } catch (error) {
          console.error('Error getting data:', error);
        } finally{
          setLoading(false)
        }
      }
      loadData()
    }
  },[status,industryID,session?.accessToken,selectedPeriod])


  if (status === "loading" || loading) {
    return <Loading />;
  }

  const features = translateFeatures(featuresData,locale)

  const selectedValueMsData = brandData?.filter(row => row.period_id === selectedPeriod).map((row1) => {
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

    
const selectedUnitMsData = brandData?.filter(row => row.period_id === selectedPeriod).map((row1) => {
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
    
   
    return (
        <>
        
        <Title pageTitle={t("MARKET_REPORT")} period={selectedPeriod} />      

        <div className="container mx-auto p-4">

        <HeaderContainer   title={t("MARKET_REPORT")} period={selectedPeriod} content={`${t("THIS_REPORT_PROVIDES_GENERAL_INFORMATION_FOR_ALL_BRANDS_MARKETED_")} ${selectedPeriod}`} />

      <div className="p-1">
        <ParagraphContainer title= {t("BRAND_RETAIL_SALES_AND_VOLUME")} content={t("THIS_TWO_TABLE_BELOW_SHOWS_THE_MARKETED_BRANDS_RETAIL_SALES_(IN_T")} />
        
        <div className="grid grid-cols-2 gap-4 m-4">
          <div className="col">
          
          <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-1 border">{t("BRAND")} </th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("VALUE_SHARE")} </th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("RETAIL_SALES")}</th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("VARIATION")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedValueMsData?.sort((a,b)=>a.market_share - b.market_share).slice().sort((a, b) => b.revenue - a.revenue).map((entry,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td scope="row " className={`px-2 py-1 border font-bold font-medium text-gray-900 whitespace-nowrap dark:text-white`}>
                      {entry.brand_name}
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {entry.value_market_share}%
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {formatPrice(entry.revenue)}
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {formatPrice(entry.variation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           <div className="col">

           <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-1 border">{t("BRAND")} </th>
                  <th scope="col" align="center">{t("UNIT_SHARE")} </th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("VOLUME")}</th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("VARIATION")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedUnitMsData?.sort((a, b) => b.unit_market_share - a.unit_market_share).map((entry,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <td scope="row " className={`px-2 py-1 border font-medium font-bold text-gray-900 whitespace-nowrap dark:text-white`}>
                      {entry.brand_name}
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {entry.unit_market_share}%
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {entry.unit_sold}
                    </td>
                    <td className="px-2 py-1 border" align="center">
                      {entry.variation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 
          </div>
        </div>
      </div>

      <div className="p-1">
        <ParagraphContainer title= {t("BRAND_CHARACTERISTICS")} content={`${t("THIS_TABLE_BELOW_LISTS_THE_PHYSICAL_ATTRIBUTES_OF_MARKETED_BRANDS")}.`} />

        <div className="row align-items-center p-4">

           <div className="col">
            {features && (
              <>
              <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 font-bold">
                  <th scope="col" className="px-2 py-1 border">{t("BRAND")}</th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("LAUNCHED_DATE")}</th>
                  {features.slice(0, 5).map((feature) => (
                    <th key={feature.id} scope="col" className="px-2 py-1 border" align="center">
                      {feature.abbrev}
                    </th>
                  ))}
                  <th scope="col" className="px-2 py-1 border" align="center">{t("PRICE")}</th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("BASE_COST")}</th>
                  <th scope="col" className="px-2 py-1 border" align="center">{t("BASE_COST_%_OF_PRICE")}</th>
                </tr>
              </thead>
              <tbody>
                {m2Data.filter(m=>m.is_active === true).map((data) => (
                  <tr key={data.id}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <td className="px-2 py-1 border font-medium font-bold text-gray-900 whitespace-nowrap dark:text-white">{data.brand_name}</td>
                    <td className="px-2 py-1 border" align="center">{data.project.available_period}</td>
                    {features.slice(0, 5).map((feature) => (
                      <td key={feature.id} className="px-2 py-1 border" align="center">{data.project[feature.surname]}</td>
                    ))}
                    <td className="px-2 py-1 border" align="center">{data.price}</td>
                    <td className="px-2 py-1 border" align="center">{data.project.base_cost}</td>
                    <td className="px-2 py-1 border" align="center">{((data.project.base_cost / data.price) * 100).toFixed(0)}%</td>
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
         
        </div>
      </div>
    </div>
        </>
      );
}

export default MarketReport;


