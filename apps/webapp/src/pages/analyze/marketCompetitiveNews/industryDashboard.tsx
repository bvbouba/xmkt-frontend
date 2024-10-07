
import { Table } from "@/components/Table";
import {  industryFinancialItems,industryMarketShareItems, unit } from "@/lib/constants";
import { brandProps, firmProps, industryDataProps, marketProps } from "types";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getValueByTeam } from "@/lib/utils";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { colorGrades, marketColors } from "@/lib/constants/colors";
import LineChart from "@/components/charts/LineChart";
import HorizontalBar from "@/components/charts/HorizontalBar";
import VerticalBar, { options } from "@/components/charts/VerticalBar";
import { useSession } from "next-auth/react";
import { getBrandData, getFirmData, getMarketsData } from "features/data";


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
}

function IndustryDashboard({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const { teamName, industryID, firmID, industryName } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [firmData,setFirmData] = useState<firmProps[]>()
  const [brandData,setBrandData] = useState<brandProps[]>()
  const [marketsData,setMarketsData] = useState<marketProps[]>([])
  const [loading,setLoading] = useState(true)
    const { t } = useTranslation('common')
  

  useEffect(() => {

    if (status === "authenticated" && firmID && industryID) {
     
      const loadData = async () => {
        setLoading(true)
        try {
          const response1 = await getFirmData({ industryID, firmID:0, token: session.accessToken });
          const response2 = await getBrandData({ industryID, firmID:0, token: session.accessToken });
          const response3 = await getMarketsData()
          setFirmData(response1)
          setBrandData(response2)
          setMarketsData(response3)
        } catch (error) {
          console.error('Error getting data:', error);
        } finally{
          setLoading(false)
        }
      }
      loadData()

    }
 
  }, [status,industryID,session?.accessToken]);

  if (status === "loading" || loading) {
    return <p>{t("LOADING...")}</p>;
  }

 const periods = Array.from(Array(selectedPeriod+1).keys())

  const industryData = firmData?.filter(row => row.period_id === selectedPeriod).map((row1) => {
                    let temp: industryDataProps = {
                        team_name: '', // Initialize with a default value or set the actual value
                        stockprice: 0, // Initialize with a default value or set the actual value
                        revenue: 0, // Initialize with a default value or set the actual value
                        net_contribution: 0, // Initialize with a default value or set the actual value
                        cum_nc: 0, // Initialize with a default value or set the actual value
                    };
                industryFinancialItems.map(row2 =>{
                    if(row2.numeric && row2.unit){
                        temp[row2.id]=(getValueByTeam(firmData,row1.team_name,selectedPeriod,row2.id)/row2.unit)
                    } else {
                        temp[row2.id]=getValueByTeam(firmData,row1.team_name,selectedPeriod,row2.id)
                    }})
                return temp })

        const industryChartData = {
    labels:periods.map((item) => `${(selectedPeriod < 4 ) ? t("PERIOD"): t("PER")} ${item}`) || [],
    datasets: firmData?.filter(row => row.period_id === selectedPeriod).map(
          (row,id) => ({
            data: periods.map(per => getValueByTeam(firmData,row.team_name,per,'stockprice')),
            label: row.team_name,
            lineTension: 0.1,
            pointRadius:  0 ,
            fill: false,
            datalabels: {
                display: false
              },
              backgroundColor: colorGrades[id][0],
        borderColor: colorGrades[id][0],
          })
            ) || []
          }


const byMarketChartData = {
    labels:periods.map((item) => `${(selectedPeriod < 4 ) ? t("PERIOD"): t("PER")} ${item}`),
    datasets: marketsData.map(
              (m,id) => ({
              data: periods.map(p => firmData?.filter(d => d.period_id === p
                    && d.market_id === m.id).reduce((a,c) => a+c.revenue,0)),
              label: m.name,
              lineTension: 0,
              pointRadius:0,
              fill: true,
              pointStyle: 'line',
              datalabels: {
                  display: false
                },
                backgroundColor: marketColors[id],
                borderColor: marketColors[id],
            })
              )}

const byFirmChartData = {
    labels:periods.map((item) => `${(selectedPeriod < 4 ) ? t("PERIOD"): t("PER")} ${item}`),
      datasets: firmData?.filter(row => row.period_id === selectedPeriod).map(
            (f,id) => ({
            data: periods.map(p => getValueByTeam(firmData,f.team_name,p,'revenue')),
            label: f.team_name,
            lineTension: 0,
            pointRadius:0,
            fill: true,
            pointStyle: 'line',
            datalabels: {
                display: false
              },
              backgroundColor: colorGrades[id][0],
        borderColor: colorGrades[id][0],
          })
            ) || []
          }

            
const marketShareChartData = {
     labels: industryMarketShareItems.map(row => row.label),
      datasets: firmData?.filter(f => f.period_id === selectedPeriod).map(
              (row,id) => ({
              data: industryMarketShareItems.map(row1 => getValueByTeam(firmData,row.team_name,selectedPeriod,row1.id)),
              label: row.team_name,
              fill: false,
              backgroundColor: colorGrades[id][0],
            borderColor: colorGrades[id][0],
            })
              ) || []
            }

const vSelected = brandData?.filter(row => row.period_id === selectedPeriod).sort((a, b) =>
                  b.unit_sold - a.unit_sold).slice(0,6)

const topSellingVolumeChartData = {
    labels:vSelected?.map(row => row.brand_name) || [],
    datasets: [{
            label: '',
            data: vSelected?.map(row => row.unit_sold) || [],
            borderWidth: 1,
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
        }]}

const rSelected = brandData?.filter(row => row.period_id === selectedPeriod).sort((a, b) =>
                  b.revenue - a.revenue).slice(0,6)

const topSellingRevenueChartData =  {
    labels:rSelected?.map(row => row.brand_name) || [],
datasets:[{
            label: '',
            data: rSelected?.map(row => Math.round(row.revenue/unit)) || [],
            borderWidth: 1,
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
        }]}
const title = t("INDUSTRY_DASHBOARD_-_FIRM", {teamName,selectedPeriod})

    return ( 
        <>
        
            
        <div className="">
        <div className="container mx-auto">
      <HeaderContainer title={title}/>

      <div className="p-1">
        <div className="grid grid-cols-2 gap-4">
            <ParagraphContainer title={t("STOCK_MARKET_PERIOD",{selectedPeriod})} />
          <div className="pl-4"><ParagraphContainer title={t("SHARE_PRICE_INDEX_EVOLUTION")} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-80">

          <div className="col pt-4 pr-4">
            {industryData && (
               <Table data={industryData}  headerless={true} items={industryFinancialItems} lookup="team_name" heads={[...new Set(industryData.map((entry) => entry.team_name))]}/>
            )}
            <span className="f_annotation  italic text-sm">
              {t("SPI:_SHARE_PRICE_INDEX,_REV:_REVENUES(MILLION_$),_NC:_NET_CONTRIB")},
              {t("CUM_NC_CUMULATIVE_NC_MILLION")}
            </span>
          </div>
        

          <GraphContainer>
          {(selectedPeriod !== 0) ? <LineChart data={industryChartData} title="" yGrid={true}  />
          :
          <Bar data={industryChartData} options={options({title:"",legend:true})}/> 
          }
          </GraphContainer>
       
        </div>
      </div>

      <div className="p-1">
        <div className="grid grid-cols-2 gap-4 ">
        <div className="pl-4"><ParagraphContainer title={t("INDUSTRY_RETAIL_SALES_-_BY_MARKET")} /></div>
        <div className="pl-4"><ParagraphContainer title={t("INDUSTRY_RETAIL_SALES_-_BY_FIRM")} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-80">

          <GraphContainer>
          {(selectedPeriod !== 0) ? <LineChart data={byMarketChartData} title="" yGrid={true} inThousand={true} stacked={true}/>
          :
          <Bar data={byMarketChartData} options={options({title:"",legend:true,inThousand:true})}/> 
          }
          </GraphContainer>

          <GraphContainer>
          {(selectedPeriod !== 0) ? <LineChart data={byFirmChartData} title="" yGrid={true} inThousand={true} stacked={true} />
          :
          <Bar data={byFirmChartData} options={options({title:"",legend:true, inThousand:true})}/> 
          }
          </GraphContainer>

        </div>
        <div className="grid grid-cols-2 ">
          <div className="col pl-4">
            <span className="f_annotation  italic text-sm">{t("IN_MILLION_$")}</span>
          </div>
          <div className="col pl-4">
            <span className="f_annotation  italic text-sm">{t("IN_MILLION_$")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 h-80">
        <div className="pl-4"><ParagraphContainer title={t("UNIT_AND_VALUE_MARKET_SHARES_-_TOTAL")} /></div>
        <div className="col">
        </div>

          <GraphContainer>
           <HorizontalBar data={marketShareChartData} title="" inPercent={true} stacked={true} />
          </GraphContainer>
         
         <div className="col"></div>
        </div>

      <div className="p-1">
        <div className="grid grid-cols-2 gap-4">
        <div className="pl-4"><ParagraphContainer title={t("TOP_SELLING_BRANDS-_VOLUME")} /></div>
        <div className="pl-4"> <ParagraphContainer title={t("TOP_SELLING_BRANDS_-_RETAIL_SALES")} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

          <VerticalBar data={topSellingVolumeChartData} title=""/>
        
          </GraphContainer>
          <GraphContainer>

          <VerticalBar data={topSellingRevenueChartData} title=""/>
          
          </GraphContainer>
        </div>
        <div className="grid grid-cols-2">
          <div className="col pl-4">
            <span className="f_annotation italic text-sm">{t("IN_THOUSANDS_OF_UNITS")}</span>
          </div>
          <div className="col pl-4">
            <span className="f_annotation italic text-sm">{t("IN_MILLION_$")}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
        </>
     );
}

export default IndustryDashboard;

