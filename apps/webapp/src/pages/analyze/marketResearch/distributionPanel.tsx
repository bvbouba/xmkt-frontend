
import {  getValueByBrandChannel } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TableSimple, columnProps } from "@/components/Table/Table";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { channelColors } from "@/lib/constants/colors";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useSession } from "next-auth/react";
import { channelProps, distributionCoverageProps, marketResearchProps, salesProps } from "types";
import { fetchMarketResearchChoices, getChannelsData, getDistributionCoverageData, getSalesData } from "features/data";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function DistributionPanel({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {

  const { data: session, status } = useSession();
  const { industryID, firmID } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0;
  
  const [sales, setSales] = useState<salesProps[]>([]);
  const [distributionCoverage, setDistributionCoverage] = useState<distributionCoverageProps[]>([]);
  const [channels, setChannels] = useState<channelProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { t } = useTranslation('common');
  
  useEffect(() => {
    if (status === "authenticated" && firmID && industryID) {
      const loadData = async () => {
        setLoading(true);
        try {
          // Fetch data concurrently
          const [ salesResponse, distributionCoverageResponse, channelsResponse] = await Promise.all([
            getSalesData({ industryID, period: selectedPeriod, token: session.accessToken }),
            getDistributionCoverageData({ industryID, period: selectedPeriod, token: session.accessToken }),
            getChannelsData()
          ]);
  
          // Set the data in the state
          setSales(salesResponse);
          setDistributionCoverage(distributionCoverageResponse);
          setChannels(channelsResponse);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }
  }, [status]);
  if (status === "loading" || loading) {
    return <p>Loading...</p>;
  }

  let teamJson: { [key: string]: any } = {};
  let firmIdJson: { [key: string]: any } = {};
  const brands = Array.from(new Set(sales.map(row => {
                      teamJson[row.brand_name] = row.team_name
                      firmIdJson[row.brand_name] = row.firm_id
                       return row.brand_name
                     })))


let columns: columnProps[] = [];
columns.push({id:'name' , numeric: false, label:t('BRAND')})
  columns.push({id:'team_name' , numeric: false, label:t('FIRM')})
  channels.map(row => columns.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name, percent:true}))

  const rows = brands.map(row =>{
              let temp: { [key: string]: any } = {};
               temp['name'] = row
               temp['team_name'] = teamJson[row]
               channels.map(
                 row1 => temp[row1.name]= Math.round((sales.filter(row2 => row2.brand_name===row
                   && row2.channel_name===row1.name).reduce((a,c)=>
                         a+ c.volume,0))/(sales.filter(row2 => row2.channel_name===row1.name).reduce(
                           (a,c) => a+c.volume,0))*100)
                        )
               return temp
              })

  const chart1Data = {
    labels:[""],
    datasets: channels.map(
                (row,id) => ({
                data: [Math.round(sales.filter(row2 => row2.channel_name===row.name).reduce((a,c)=>
                        a+ c.volume,0))],
                label: (locale==="fr")?row.name_fr:row.name,
                fill: false,
                backgroundColor: channelColors[id],
                 borderColor: channelColors[id],
              })
                )}

  const chart2Data = {
          labels:channels.map(row => (locale==="fr")?row.name_fr:row.name),
          datasets: [{
                    data: channels.map(
                           row => sales.filter(row1 => row1.channel_name===row.name).reduce(
                             (a,c)=> a+ c.volume,0)),
                    borderWidth: 1,
                    backgroundColor: channelColors,
                    borderColor: channelColors,
                  }]}

  const rows1 = brands.map(row =>{
               let temp: { [key: string]: any } = {};
               temp['name'] = row
               temp['team_name'] = teamJson[row]
               channels.map(
                 row1 => temp[row1.name]= getValueByBrandChannel(distributionCoverage,row,row1.name,`value`)*100
                        )
               return temp
              })

  const chart3Data = {
    labels:[""],
    datasets: channels.map(
                (row,id) => ({
                data: [row.channel_size],
                label: (locale==="fr")?row.name_fr:row.name,
                fill: false,
                backgroundColor: channelColors[id],
                borderColor: channelColors[id],
              })
                )}

const chart4Data = {
                 labels:channels.map(row => (locale==="fr")?row.name_fr:row.name),
                    datasets: [{
                    data: channels.map(
                           row => row.channel_size),
                    borderWidth: 1,
                    backgroundColor: channelColors,
                    borderColor: channelColors,
                  }]
                }
  const title = t("DISTRIBUTION_PANEL_-_PERIOD", {selectedPeriod});

  // if(marketResearchChoices.some((choice => choice.study === 7 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

    return (  
    <>   
    <div className="">
    <div className="container mx-auto">
      <HeaderContainer  title={title} content={t("THE_DISTRIBUTION_PANEL_PROVIDES_CONTINUOUS_TRACKING_OF_PRODUCT_SA")} />
      
      <ParagraphContainer title={t("SALES_AND_MARKET_SHARES_BY_CHANNEL")} content={t( "THE_TABLE_AND_CHARTS_BELOW_PROVIDE_THE_MARKET_SHARES,_BASED_ON_UN")} />


      <div className="row align-items-center p-4">
        <div className="col">
        <h4 className="pb-4">{t("MARKET_SHARE_BY_CHANNEL_(%_UNIT)")}</h4>

        <TableSimple columns={columns} rows={rows}/>
    
        </div>
      </div>

        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

            <HorizontalBar data={chart1Data} title={t("UNIT_SALES_BY_CHANNEL_IN_THOUSANDS_OF_UNITS")} legendDisplay={false} />
  
            </GraphContainer>
  
          <GraphContainer>

            <DoughnutChart data={chart2Data} title={t("RELATIVE_CHANNEL_SIZE_(%_UNITS)")} inPercent={true} legendDisplay={true} />

          </GraphContainer>
        </div>

      <ParagraphContainer title={t("DISTRIBUTION_COVERAGE")}  content={t("THE_DISTRIBUTION_COVERAGE_FIGURES_IN_THE_CHARTS_AND_TABLE_BELOW_R")} />

      <div className="row align-items-start p-4">
        <h4 className="pb-4">{t("DISTRIBUTION_COVERAGE_BY_CHANNEL_(%_STORES)")}</h4>
        <div className="col">

        <TableSimple columns={columns} rows={rows1}/>

        </div>
      </div>
      

        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

            <HorizontalBar data={chart3Data} title={t("NUMBER_OF_OUTLETS_IN_EACH_CHANNEL")} legendDisplay={false} />

          </GraphContainer>
          <GraphContainer>

            <DoughnutChart data={chart4Data} title={t("RELATIVE_CHANNEL_SIZE_(%_OUTLET)")} inPercent={true} />

          </GraphContainer>
        </div>
    </div>
    </div>
    </>);
}

export default DistributionPanel;

