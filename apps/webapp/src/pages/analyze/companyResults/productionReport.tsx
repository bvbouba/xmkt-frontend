
import {  productionItems, transformConstants } from "@/lib/constants";
import { getValueByBrand } from "@/lib/utils";
import {  useEffect, useState } from "react";

import { Table } from "@/components/Table";
import {  GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import GroupedBar from "@/components/charts/GroupedBar";
import { useSession } from "next-auth/react";
import { getBrandResultByFirm } from "features/data";
import { brandProps } from "types";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";
import { colors } from "@/lib/constants/colors";


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function ProductionReportPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const { teamName, industryID, firmID,  } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [brandData,setBrandData] = useState<brandProps[]>([])
  const [loading,setLoading] = useState(true)

    const { t } = useTranslation('common')


    useEffect(() => {

      if (status === "authenticated"  && firmID && industryID) {
        const loadData = async () => {
          setLoading(true)
        try {
          const response = await getBrandResultByFirm({ industryID, firmID,token: session.accessToken, period:selectedPeriod });
           setBrandData(response)
        } catch (error) {
          console.error('Error getting data:', error);
        } finally{
          setLoading(false)
        }
        }
        loadData()
        }
      }, [status,firmID,industryID,session?.accessToken]);

      if (status === "loading" || loading) {
        return <Loading />;
      }



        const productionData = {
            labels: brandData.map(
                row1 => row1.brand_name),
            datasets: productionItems.map(
                    (row,id) => ({
                        label: row.label,
                        data: brandData.filter(row1 => row1.period_id === selectedPeriod).map(
                                row2 =>  getValueByBrand(brandData,row2.brand_name,selectedPeriod,row.id)),
                        backgroundColor: colors[id],
                        borderColor: "white"
                              })
                    )}


      
    return (
        <>
                 <Title pageTitle={t("PRODUCTION_REPORT")} period={selectedPeriod} />
        <div>
        <div className="container mx-auto">
          
      <HeaderContainer title={t("PRODUCTION_REPORT")} period={selectedPeriod} teamName={teamName} content={`${t("THE_REPORT_BELOW_PROVIDES_WITH_INFORMATION_ON_PRODUCTION_LEVELS_A")} ${selectedPeriod}.`}/>

 
      <ParagraphContainer title={t("SALES,_PRODUCTION_&_INVENTORY")} content={t("THE_CHART_BELOW_SHOWS_THE_UNITS_SOLD", {selectedPeriod})}/>

      <div className='grid grid-cols-1 gap-4 h-80'>
        <GraphContainer>

          <GroupedBar data={productionData} title="" legendPos="right" yGrid={true} />
      
              </GraphContainer>
        </div>

        <div className="pl-5">  <ParagraphContainer content={t("THE_TABLE_BELOW_PROVIDES_YOU_WITH_ADDITIONAL_DETAILS", {selectedPeriod})}/></div>

      <div className="p-5">

      <Table data={brandData} items={transformConstants(locale).inventoryItems} lookup="brand_name" heads={[...new Set(brandData.map((entry) => entry.brand_name))]}/>
      
      </div>
        <ParagraphContainer title={t("_UNIT_COST,_COGS_AND_INVENTORY_HOLDING_COST")} 
        content={t("THE_TABLE_BELOW_SHOWS_THE_TRANSFER_COST_FOR_EACH_OF_YOUR_MARKETED")}/>
       <div className="pl-5"> <ParagraphContainer content= {t("COGS_IS_EQUAL_TO_UNIT_SOLD_X_UNIT_TRANSFER")}/></div>

      <div className="p-5">

      <Table data={brandData} items={transformConstants(locale).costItems} lookup="brand_name" heads={[...new Set(brandData.map((entry) => entry.brand_name))]}/>
       
      </div>
    </div>
    </div>
        </>
      );
}

export default ProductionReportPage;

