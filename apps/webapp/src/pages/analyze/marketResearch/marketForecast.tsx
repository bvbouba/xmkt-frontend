import {useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { periods, periods1, transformConstants } from "@/lib/constants";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { segmentColors } from "@/lib/constants/colors";
import HorizontalBar from "@/components/charts/HorizontalBar";
import VerticalBar from "@/components/charts/VerticalBar";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useSession } from "next-auth/react";
import { forecastProps, segmentProps } from "types";
import {  getForecastsData, getSegmentsData } from "features/data";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";

Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};


function MarketForecast({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();
const { industryID, firmID } = session || {};
const selectedPeriod = session?.selectedPeriod || 0;

const [forecasts, setForecasts] = useState<forecastProps[]>([]);
const [segments, setSegments] = useState<segmentProps[]>([]);
const [loading, setLoading] = useState(true);

const { t } = useTranslation('common');

// Fetch market research choices and forecasts data when authenticated
useEffect(() => {
  if (status === 'authenticated' && industryID) {
    const loadData = async () => {
      setLoading(true);
      try {
    
        const response2 = await getForecastsData({
          industryID,
          period: selectedPeriod,
          token: session.accessToken,
        });

        const response3 = await getSegmentsData();

        setForecasts(response2);
        setSegments(response3);
      } catch (error) {
        console.error('Error getting data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }
}, [status,industryID,selectedPeriod,session?.accessToken]);

if (status === "loading" || loading) {
  return <Loading />;
}

  const chart1Data = {
    labels: transformConstants(locale).periods.map((row) => row.label),
    datasets: [
      {
        data: periods.map((row) =>
          forecasts.reduce((a, c) => a + Math.round(c[row.id] * 1000), 0)
        ),
        borderWidth: 1,
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const chart2Data = {
    labels: transformConstants(locale).periods1.map((row) => row.label),
    datasets: [
      {
        data: periods1.map((row) => {
          let beg = forecasts.reduce((a, c) => a + c[row.begin], 0);
          let end = forecasts.reduce((a, c) => a + c[row.end], 0);
          if (row.average) return Math.pow(end / beg, 1 / row.n) - 1;
          return end / beg - 1;
        }),
        borderWidth: 1,
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const chart3Data = {
    labels: transformConstants(locale).periods.map((row) => row.label) as string[],
    datasets: segments.map((row,index) => ({
      label: (locale==="fr")?row.name_fr:row.name,
      data: periods.map((row1) => {
        let temp = forecasts.filter((row2) => row2.segment_name === row.name);
        if (temp.length > 0) return Math.round(temp[0][row1.id] * 1000);
        return 0;
      }),
      borderWidth: 1,
      backgroundColor: segmentColors[index],
      borderColor: segmentColors[index],
    })),
  };

  const chart4Data = {
    labels: transformConstants(locale).periods.map((row) => row.label),
    datasets: segments.map((row,index) => ({
      label: (locale==="fr")?row.name_fr:row.name,
      data: periods.map((row1) => {
        let temp = forecasts.filter((row2) => row2.segment_name === row.name);
        if (temp.length > 0) {
          let beg = temp[0][row1.begin];
          let end = temp[0][row1.end];
          if (row1.average) return Math.pow(end / beg, 1 / row1.n) - 1;
          return end / beg - 1;
        }
        return 0;
      }),
      borderWidth: 1,
      backgroundColor: segmentColors[index],
      borderColor: segmentColors[index],
    })),
  };

  const chart5Data = {
    datasets:[
    {
      data: segments.map((row) =>
        forecasts
          .filter((row1) => row1.segment_name === row.name)
          .reduce((a, c) => a + c.current_period, 0)
      ),
      borderWidth: 1,
      backgroundColor: segmentColors,
      borderColor: segmentColors,
    },
  ]}
  const chart6Data = {
    labels:segments.map(row=>(locale==="fr")?row.name_fr:row.name,),
    datasets:[
    {
      data: segments.map((row) =>
        forecasts
          .filter((row1) => row1.segment_name === row.name)
          .reduce((a, c) => a + c.five_period, 0)
      ),
      borderWidth: 1,
      backgroundColor: segmentColors,
      borderColor: segmentColors,
    },
  ]}
  
  // if(marketResearchChoices.some(choice => choice.study === 8 && choice.choice === false)){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

  return (
    <>
      
      <Title pageTitle={t("MARKET_FORECAST")} period={selectedPeriod} />      
     
      <div className="">
      <div className="container mx-auto">

      <HeaderContainer  title={t("MARKET_FORECAST")} period={selectedPeriod} content={t("THIS_STUDY_PROVIDES_ESTIMATES_OF_THE_EVENTUAL_MARKET_SIZE_IN_ONE_")} />
     
     <ParagraphContainer  title={t("TOTAL_MARKET_SIZE")} content={t("THE_CHARTS_BELOW_SHOW_THE_ACTUAL_SIZE_THIS_PERIODAND_THE_EXPECTED")}  />


      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

           <HorizontalBar data={chart1Data} title={t("MARKET_SIZE_BROKEN_DOWN_BY_CONSUMER_SEGMENT_(IN_THOUSANDS_OF_UNIT")} legendDisplay={false} />
  
           </GraphContainer>
          <GraphContainer>

          <HorizontalBar data={chart2Data} title={t("CONSUMER_SEGMENT_GROWTH_RATE_(IN_%_UNITS)")} inPercent={true} legendDisplay={false} />
           
          </GraphContainer>
        </div>
      </div>

  
      <ParagraphContainer title={t("MARKET_SIZE_BY_CONSUMER_SEGMENT")} content={t("THE_CHARTS_BELOW_SHOW_THE_ACTUAL_MARKET_SIZE_THIS_PERIODAND_THE_E")} />

      <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

          <VerticalBar data={chart3Data} title={t("MARKET_SIZE_(IN_THOUSANDS_OF_UNITS)")} legend={true}/>
          
          </GraphContainer>
          <GraphContainer>

          <VerticalBar data={chart4Data} title={t("MARKET_GROWTH_RATE_(%UNIT)")} inPercent={true} legend={true}/>
        
        </GraphContainer>
      </div>

      <div className="p-4">
      <ParagraphContainer title={t("RELATIVE_CONSUMER_SEGMENT_SIZE_(IN_%_OF_TOTAL_MARKET_SIZE)")} />

        <div className="grid grid-cols-2 gap-4 h-80">
          <GraphContainer>

            <DoughnutChart data={chart5Data} title={""} inPercent={true} legendDisplay={true} />
          
          </GraphContainer>
          <GraphContainer>

          <DoughnutChart data={chart6Data} title={""} inPercent={true}  />
           
          </GraphContainer>
        </div>
        <div className="grid grid-cols-2">
          <div className="col pl-4">
            <span className="italic text-sm">{t("CURRENT_PERIOD")}</span>
          </div>
          <div className="col pl-4">
            <span className="italic text-sm">{t("FIVE_PERIOD")}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default MarketForecast;

