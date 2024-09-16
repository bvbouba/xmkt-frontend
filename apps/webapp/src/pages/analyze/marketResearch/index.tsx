import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { fetchMarketResearchChoices } from "features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

function MarketResearchPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const paths = usePaths();
    const dispatch = useAppDispatch();
    const {participant,selectedPeriod} = useAuth();
    const { industryID, firmID } = participant || {};
    const { t } = useTranslation('common')

    useEffect(()=>{
      if (firmID && industryID ) {
      dispatch(fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: selectedPeriod }));
      }
    },[dispatch,firmID,industryID,selectedPeriod])

    const { data: marketResearchChoices } = useAppSelector((state) => state.decide.marketResearchChoices);

    const benchmarkingItems = [
        { url: paths.analyze.marketResearch._period(selectedPeriod).industryBenchmarking.$url(), image: '/images/industry-benchmarking-logo.png', alt: 'industry_benchmarking', title: "INDUSTRY_BENCHMARKING", study:1 },
        { url: paths.analyze.marketResearch._period(selectedPeriod).consumerSurvey.$url(), image: '/images/consumer-survey-logo.png', alt: 'consumer_survey', title: "CONSUMER_SURVEY" ,study:6},
        { url: paths.analyze.marketResearch._period(selectedPeriod).consumerPanel.$url(), image: '/images/consumer-panel-logo.png', alt: 'consumer_panel', title: "CONSUMER_PANEL" ,study:5},
        { url: paths.analyze.marketResearch._period(selectedPeriod).distributionPanel.$url(), image: '/images/distribution-panel-logo.png', alt: 'distribution_panel', title: "DISTRIBUTION_PANEL",study:7 },
        { url: paths.analyze.marketResearch._period(selectedPeriod).semanticScales.$url(), image: '/images/semantic-scales-logo.png', alt: 'semantic_scales', title: "SEMANTIC_SCALES",study: 10},
        { url: paths.analyze.marketResearch._period(selectedPeriod).multidimensionalScaling.$url(), image: '/images/multidimensional-scaling-logo.png', alt: 'multidimensional_scaling', title: "MULTIDIMENSIONAL_SCALING" ,study: 9},
        { url: paths.analyze.marketResearch._period(selectedPeriod).competitiveAds.$url(), image: '/images/competitive-ads-logo.png', alt: 'competitive_ads', title: "COMPETITIVE_ADVERSTISING_AND_COMMERCIAL_TEAM_ESTIMATES" , study:2,substudy:3},
        { url: paths.analyze.marketResearch._period(selectedPeriod).marketForecast.$url(), image: '/images/market-forecast-logo.png', alt: 'market_forecast', title: "MARKET_FORECAST",study:8 },
        { url: paths.analyze.marketResearch._period(selectedPeriod).conjointAnalysis.$url(), image: '/images/conjoint-analysis-logo.png', alt: 'conjoint_analysis', title: "CONJOINT_ANALYSIS",study:4 },
        // Add more items as needed
      ];
    

   
      const filteredBenchmarkingItems = benchmarkingItems
    .filter((item) => {
      return marketResearchChoices.some((choice) => {
        return (choice.study === item.study || choice.study === item.substudy) && choice.choice === true;
      });
    })
    .map((item) => {
      const translatedTitle = t(item.title, { lng: 'fr' });
      return { ...item, title: translatedTitle };
    })
    
    return (
        <>
        
      <Section menuItems={filteredBenchmarkingItems} locale={locale} />
      </>
    );
  }

export default MarketResearchPage;


MarketResearchPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  