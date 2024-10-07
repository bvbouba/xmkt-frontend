
import { brandFinancialChartItems, firmFinancialChartItems, transformConstants } from "@/lib/constants";
import { useEffect, useState } from "react";
import { unit } from "@/lib/constants";
import { Table } from "@/components/Table";
import { Loading } from "@/components/Loading";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { categoryColors, colorGrades } from "@/lib/constants/colors";
import { getValueByPeriod } from "@/lib/utils";
import { useRouter } from "next/router";
import MultiAxisLine from "@/components/charts/MultiAxisLine";
import LineChart from "@/components/charts/LineChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { Bar } from "react-chartjs-2";
import { options } from "@/components/charts/VerticalBar";
import { useSession } from "next-auth/react";
import { brandProps, firmProps } from "@/lib/type";
import { getBrandData, getFirmData } from "features/data";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function FinancialReportPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const { teamName, industryID, firmID,  } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [firmData,setFirmData] = useState<firmProps[]>([])
  const [brandData,setBrandData] = useState<brandProps[]>([])
  const [loading,setLoading] = useState(true)
  
    const { t } = useTranslation('common')

    useEffect(() => {
        // Dispatch actions to get firm and brand data when the component mounts
        if (status === "authenticated" && firmID && industryID) {

          const loadData = async () => {
            setLoading(true)
          try {
            const response1 = await getFirmData({ industryID, firmID, token: session.accessToken });
            const response2 = await getBrandData({ industryID, firmID,token: session.accessToken });
            setFirmData(response1)
            setBrandData(response2)
          } catch (error) {
            console.error('Error getting data:', error);
          }finally{
            setLoading(false)
          }
          }
          loadData()
        }
      }, [status,firmID,industryID,session?.accessToken]);
    
      if (status === "loading" || loading) {
        return <p>{t("LOADING...")}</p>;
      }

      let firmColors:string[] = []; // Default color array
      if (typeof firmID === 'number') {
        const colorIndex = firmID - 1; // Assuming firmID starts from 1
        firmColors = colorGrades[colorIndex] || []; // Get the color array based on firmID
      }
      
      const periods = Array.from(Array(selectedPeriod+1).keys())

      const filteredFirmData = firmData.filter(item => item.period_id <= selectedPeriod )
      const profitData = {
        labels:periods.map((item) => `${(selectedPeriod < 4 ) ? t("PERIOD"): t("PER")} ${item}`),
        datasets: firmFinancialChartItems.map(
        (row,id) => ({
          data: periods.map(row1 => {
                if (row.percent === false) return getValueByPeriod(filteredFirmData,row1,row.id)/unit
                return getValueByPeriod(filteredFirmData,row1,row.id)
              }),
          label: row.label,
          lineTension: 0,
          pointRadius: 0,
          fill: false,
          yAxisID: (row.axis=== 1) ? 'y' : 'y1',
          pointStyle: 'line',
          datalabels: {
              display: (selectedPeriod === 0 )? true : row.display
            },
            borderColor: categoryColors[id],
            backgroundColor: categoryColors[id],

        }))}

       
        const costData = {
            labels:periods.map((item) => `${(selectedPeriod < 4 ) ? t("PERIOD"): t("PER")} ${item}`),
            datasets: brandFinancialChartItems.map(
            (row,id) => ({
              data: periods.map(row1 => getValueByPeriod(filteredFirmData,row1,row.id)),
              label: row.label,
              lineTension: 0,
              pointRadius: 0,
              fill: false,
              pointStyle: 'line',
              datalabels: {
                  display: (selectedPeriod === 0 )? true : false
                },
                borderColor: categoryColors[id],
                backgroundColor: categoryColors[id],

            })
          )}

          const revenueData = {
            labels:brandData.filter(row => row.period_id === selectedPeriod).map(
                row => row.brand_name),
            datasets:[{
            data: brandData.filter(row => row.period_id === selectedPeriod).map(
                   row => row.revenue),
            borderWidth: 1,
            backgroundColor: firmColors,
            borderColor: firmColors
          }]}

         const contributionData = {
            labels:brandData.filter(row => row.period_id === selectedPeriod).map(
                row => row.brand_name),
            datasets:[{
            data: brandData.filter(row => row.period_id === selectedPeriod).map(
                   row => row.contribution),
            borderWidth: 1,
            backgroundColor: firmColors,
            borderColor: firmColors
          }]}

    const title = t("FINANCIAL_REPORT_-_FIRM",{teamName,selectedPeriod})




    const filteredBrandData = brandData.filter(b=> b.period_id == selectedPeriod)
    return (
        <>
        
        <div className="">
        <div className="container mx-auto">
        <HeaderContainer title={title} content={t("THE_FINANCIAL_REPORT_OF_FIRM",{teamName,selectedPeriod})} />
     <ParagraphContainer title={t("COMPANY_PROFIT_&_LOSS_STATEMENT")} content={t("THE_TABLE_BELOW_SHOWS_THE_EVOLUTION_OF_FIRM", {teamName,selectedPeriod})} />
    
      <div className="p-5">
      
      <Table data={filteredFirmData} items={transformConstants(locale).firmFinancialItems} lookup="period_id" heads={[...new Set(filteredFirmData.map((entry) => entry.period_id))]}/>
       
      </div>
      <div className="p-1">
        <div className="grid grid-cols-2 gap-4 h-80">
          
 
          <GraphContainer>
           {(selectedPeriod !== 0) ? <MultiAxisLine data={profitData} title={t("REVENUE_EBT_EVOLUTION")} max={Math.max(...profitData.datasets[0].data) * 1.2} />
          :
           <Bar data={profitData} options={options({title:t("REVENUE_EBT_EVOLUTION"),legend:true,percent:true,yAxisDisplay:false,y1AxisDisplay:false, })}/> 
          }
          </GraphContainer>

          <GraphContainer>
          {(selectedPeriod !== 0) ? <LineChart data={costData} title={t("COST_EVOLUTION_BY_CATEGORY_(%_Revenue)")} inPercent={true} />
          :
          <Bar data={costData} options={options({title:t("COST_EVOLUTION_BY_CATEGORY"),legend:true,percent:true,yAxisDisplay:false})}/> 
          }
          </GraphContainer>
        </div>
      </div>
     
      <ParagraphContainer title={t("BRAND_CONTRIBUTION")} content={t("THE_TABLE_BELOW_SHOWS_A_COMPARISON_OF_THE_NET_CONTRIBUTION_GENERATED_BY_THE_BRANDS_MARKETED_BY_FIRM",{teamName,selectedPeriod})} />

      <div className="p-5">

      <Table data={filteredBrandData} items={transformConstants(locale).brandFinancialItems} lookup="brand_name" heads={[...new Set(filteredBrandData.map((entry) => entry["brand_name"]))]}/>
    
      </div>

      <div className="p-1">
        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>
  
           <DoughnutChart data={revenueData}  title={t("REVENUES")} inPercent={true}/>
          
          </GraphContainer>
          <GraphContainer>
    
          <DoughnutChart data={contributionData} title={t("CONTRIBUTION_AFTER_MARKETING")} inPercent={true} />
         
          </GraphContainer>
        </div>
      </div>
        </div>
      </div>
        </>
     );
}

export default FinancialReportPage;

