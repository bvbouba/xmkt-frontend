
import {marketingItems, perceptualItems, transformConstants } from "@/lib/constants";

import {  useEffect, useState } from "react";

import { OnlineQueryTable, ProjectTableBasic, Table } from "@/components/Table";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getValueByBrand, getValueByPeriodMarket, translateFeatures, translateGenericFunction } from "@/lib/utils";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { channelColors, colorGrades, functionColors, marketColors } from "@/lib/constants/colors";
import DoughnutChart from "@/components/charts/DoughnutChart";
import GroupedBar from "@/components/charts/GroupedBar";
import HorizontalBar from "@/components/charts/HorizontalBar";
import { useSession } from "next-auth/react";
import { getBrandData, getChannelsData, getFeaturesData, getFirmData, getMarketingMixData, getMarketsData, getOnlineQueryInfoData, getProjectAllData, getSegmentsData } from "features/data";
import { brandProps, channelProps, featureProps, firmProps, markertingMixProps, marketProps, onlineQueryProps, projectProps, segmentProps } from "types";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function DecisionReviewPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { t } = useTranslation('common')
    const { data: session, status } = useSession()
    const { industryID, firmID } = session || {};
    const selectedPeriod = session?.selectedPeriod || 0
    const [allProjects,setAllProjects] = useState<projectProps[]>([])
    const [onlineQuery,setOnlineQuery] = useState<onlineQueryProps[]>([])
    const [marketingMix,setMarketingMix] = useState<markertingMixProps[]>([])
    const [firmData,setFirmData] = useState<firmProps[]>([])
    const [brandData,setBrandData] = useState<brandProps[]>([])
    const [markets,setMarkets] = useState<marketProps[]>([])
    const [features,setFeatures] = useState<featureProps[]>([])

    const [channelsData,setChannelsData] = useState<channelProps[]>([])
    const [segmentsData,setSegmentsData] = useState<segmentProps[]>([])
    const [loading,setLoading] = useState(true)
    
  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (status === "authenticated" && firmID && industryID) {
      
      const loadData = async () => {
        setLoading(true)
      try {
      const response1 = await getProjectAllData({ industryID, firmID, period:selectedPeriod,token: session.accessToken });
      const response2 = await getOnlineQueryInfoData({ industryID, firmID, period:selectedPeriod,token: session.accessToken });
      const response3 = await getMarketingMixData({ industryID, firmID, period:selectedPeriod,token: session.accessToken, });
      const response4 = await getFirmData({ industryID, firmID,token: session.accessToken });
      const response5 = await getBrandData({ industryID, firmID,token: session.accessToken });
      setAllProjects(response1)
      setOnlineQuery(response2)
      setMarketingMix(response3)
      setFirmData(response4)
      setBrandData(response5)
      const response6 = await getMarketsData();
      const response7 = await getFeaturesData();
      const response8 = await getChannelsData();
      const response9 = await getSegmentsData();
      setMarkets(response6)
      setFeatures(response7)
      setChannelsData(response8)
      setSegmentsData(response9)
      } catch (error) {
        console.error('Error getting data:', error);
      }finally{
        setLoading(false)
      }
      }
      loadData()
    }
    

  }, [status,industryID,firmID,selectedPeriod,session?.accessToken]);

  if (status === "loading" || loading) {
    return <p>{`${t("loading")}...`}</p>;
  }
  
 const channels = translateGenericFunction(channelsData,locale)
 const segments = translateGenericFunction(segmentsData,locale)

 let firmColors:string[] = []; // Default color array

if (typeof firmID === 'number') {
  const colorIndex = firmID - 1; // Assuming firmID starts from 1
  firmColors = colorGrades[colorIndex] || []; // Get the color array based on firmID
}

  const byMarketData = {
    labels: markets?.map((row) => row.name),
    datasets: [
      {
        data: markets?.map((row) =>
       marketingItems?.reduce(
            (a, c) =>
              getValueByPeriodMarket(firmData, selectedPeriod, row.id, c.id) + a,
            0
          )
        ),
        borderWidth: 1,
        backgroundColor: marketColors,
        borderColor: marketColors
      },
    ],
  };

  const byFirmData = {
    labels: transformConstants(locale).marketingItems.map((row) => row.label),
    datasets: [
      {
        data: marketingItems.map((row) =>
          markets?.reduce(
            (a, c) =>
              getValueByPeriodMarket(firmData, selectedPeriod, c.id, row.id) + a,
            0
          )
        ),
        borderWidth: 1,
        backgroundColor: functionColors,
        borderColor: functionColors
      },
    ],
  };

  const byBrandData = {
    labels: brandData?.filter((row) => row.period_id === selectedPeriod)
      .map((row1) => row1.brand_name),

    datasets: transformConstants(locale).adcomItems.map((row, id) => ({
      data: brandData?.filter((row1) => row1.period_id === selectedPeriod)
        .map((row2) =>
          getValueByBrand(brandData, row2.brand_name, selectedPeriod, row.id)
        ),
      label: row.label,
      backgroundColor: functionColors[id],
      borderColor: functionColors[id]
    })),
  };

  const commercialbyChannelData = {
    labels: channels?.map((row) => row.name) || [],
    datasets: [
      {
        data: channels?.map((row) =>
          marketingMix?.reduce(
            (a, c) =>
              getValueByBrand(
                marketingMix,
                c.brand_name,
                selectedPeriod,
                `channel_${row.id}`
              ) + a,
            0
          )
        ) || [],
        borderWidth: 1,
        backgroundColor: channelColors,
        borderColor: channelColors
      },
    ],
  };

  const commercialByBrandData = {
    labels: [''],
    datasets: marketingMix?.map((row, id) => ({
      data: [
        channels?.reduce(
          (a, c) =>
            a +
            getValueByBrand(
              marketingMix,
              row.brand_name,
              selectedPeriod,
              `channel_${c.id}`
            ),
          0
        ) || 0,
      ],
      label: row.brand_name,
      fill: false,
      backgroundColor: firmColors[id],
      borderColor: firmColors[id]
    })),
  };


  const selectedFeatures = features?.filter(feature=>['feature_1','feature_2',
  'feature_3','feature_4','feature_5'].includes(feature.surname))

  const selectedProjects = allProjects?.filter(project => project.creation_period === selectedPeriod && project.creation_period !=0)
  const selectedOnlineQueries = onlineQuery?.filter(query => query.period === selectedPeriod)
  const selectedMarketingMix = marketingMix?.filter(query => query.period_id === selectedPeriod)



  const positioningItems = segments?.map(s =>({
    label:s.name,
    id:`ads_share_${s.id}`
  })) || []



  const commercialItems = channels?.map(c =>({
    label:c.name,
    id:`channel_${c.id}`
  })) || []


  
  return (
    <>
      
     
     
      <div className="">
      <div className="container mx-auto">
      <HeaderContainer title={`${t("DECISION_REVIEW")} - ${t("PERIOD")} ${selectedPeriod}`} />

  
      <ParagraphContainer  title={t("RESSOURCE_ALLOCATION_OVERVIEW")} content={t("THE_THREE_CHARTS_BELOW_SHOW_HOW_RESOURCES_HAVE_BEEN_ALLOCATED_ACR")}/>

      <div className="grid grid-cols-2 gap-4 h-80">
      <GraphContainer>
          <DoughnutChart data={byMarketData} title={t("RESOURCE_ALLOCATED_BY_MARKET")} />
        </GraphContainer>
        <GraphContainer>
          <DoughnutChart data={byFirmData} title={t("RESOURCE_ALLOCATION_BY_FUNCTION_")}/>
        </GraphContainer>
      </div>

      <div className="grid grid-cols-1 h-80">
        <GraphContainer>
        <GroupedBar data={byBrandData} title={t("RESOURCE_ALLOCATION_BY_BRAND")} stacked = {true} />
        </GraphContainer>
      </div>
      
      <div>
      <ParagraphContainer  title={t("R_&_D_PROJECTS")} content={`${t("THE_TABLE_BELOW_LISTS_THE_PROJECTS_WHICH_THE_R&D_DEPARTMENT_WILL_")} ${selectedPeriod}`}/>

       <div>
      <ProjectTableBasic projects={selectedProjects} features={translateFeatures(selectedFeatures,locale)} />
      </div>
      </div> 

      <div>
      <ParagraphContainer  title={t("ONLINE_QUERY")} content={`${t("THE_TABLE_BELOW_LISTS_THE_ONLINE_QUERIES_MADE_BY_R&D_DEPARTEMENT_")} ${selectedPeriod} decisions.`}/>
       <div>
      <OnlineQueryTable onlineQueryData={selectedOnlineQueries} features={translateFeatures(selectedFeatures,locale)} />
      </div>
      </div>

      <div>
      <ParagraphContainer  title={t("MARKETING_MIX")}/>
 
       <div>
       <div className="p-4"><Table data={selectedMarketingMix} items={transformConstants(locale).prodAdsItems} lookup="brand_name" heads={[...new Set(selectedMarketingMix.map((entry) => entry.brand_name))]}/>
       </div>
       </div>
      </div>


      <div>
      <ParagraphContainer  title={t("SEGMENTATION_STRATEGY")}/>

       <div>
       <div className="p-4"><Table data={selectedMarketingMix} percent={true} items={positioningItems} lookup="brand_name" heads={[...new Set(selectedMarketingMix.map((entry) => entry.brand_name))]}/>
       </div>
       </div>
      </div>

      <div>
      <ParagraphContainer  title={t("PERCEPTUAL_OBJECTIVES")}/>
   
       <div>
       <div className="p-4"><Table data={selectedMarketingMix}  items={perceptualItems} lookup="brand_name" heads={[...new Set(selectedMarketingMix.map((entry) => entry.brand_name))]}/>
      </div>
       </div>
      </div>

      <div>
      <ParagraphContainer  title={t("COMMERCIAL_TEAM_SIZE")} content={`${t("THE_TABLE_BELOW_SHOWS_THE_NUMBER_OF_COMMERCIAL_PERSONS_ALLOCATED_")} ${selectedPeriod}`} />
  
       <div>
       <div className="p-4"><Table data={selectedMarketingMix}  items={commercialItems} lookup="brand_name" heads={[...new Set(selectedMarketingMix.map((entry) => entry.brand_name))]}/>
       </div>
       </div>
      </div>

      <div>
      <ParagraphContainer  content={t("THE_TWO_CHART_BELOW_SHOWS_HOW_YOUR_COMMERCIAL")} />

   
      <div className="grid grid-cols-2 gap-4 h-80">
      <GraphContainer>
          <DoughnutChart data={commercialbyChannelData} title={""}/>
    
        </GraphContainer>
        <GraphContainer>
          <HorizontalBar data={commercialByBrandData} title=""/>
        </GraphContainer>
      </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default DecisionReviewPage;


