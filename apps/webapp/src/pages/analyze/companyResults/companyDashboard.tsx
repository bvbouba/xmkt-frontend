
import { useEffect, useState } from "react";

import { barThickness, unit } from "@/lib/constants";
import { BlockHeader } from "@/components/blockHeader";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer } from "@/components/container";
import { colorGrades } from "@/lib/constants/colors";
import VerticalBar from "@/components/charts/VerticalBar";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useSession } from "next-auth/react";
import { getBrandData, getFirmData } from "features/data";
import { brandProps, firmProps } from "types";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};


function CompanyDashboardPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const { teamName, industryID, firmID, industryName } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0

  const { t } = useTranslation('common')
  const [firmData,setFirmData] = useState<firmProps[]>()
  const [brandData,setBrandData] = useState<brandProps[]>()
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && firmID && industryID) {
     
      const loadData = async () => {
        setLoading(true)
        try {
          const response = await getFirmData({ industryID, firmID, token: session.accessToken });
          const response1 = await getBrandData({ industryID, firmID, token: session.accessToken });
          setFirmData(response)
          setBrandData(response1)
        } catch (error) {
          console.error('Error getting course:', error);
        } finally{
          setLoading(false)
        }
      }
      loadData()

    }

  }, [status,firmID,industryID,session?.accessToken]);

  if (status === "loading" || loading) {
    return <p>{t("LOADING...")}</p>;
  }
  
  let firmColors: string[] = []; // Default color array

  if (typeof firmID === 'number') {
    const colorIndex = firmID - 1; // Assuming firmID starts from 1
    firmColors = colorGrades[colorIndex] || []; // Get the color array based on firmID
  }

  // Example chart data for Firm
  const filteredFirmData = firmData?.filter(item => item.period_id <= selectedPeriod).sort((a, b) => a.period_id - b.period_id) || []
  const stockPriceData = {
    labels: filteredFirmData?.map((item) => `${(selectedPeriod < 4) ? t("PERIOD") : t("PER")} ${item.period_id}`), // Assuming there's a period_id field
    datasets: [
      {
        label: t("STOCK_PRICE"),
        data: filteredFirmData?.map((item) => item.stockprice),
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness
      },
    ],
  };
  const revenueData = {
    labels: filteredFirmData?.map((item) => `${(selectedPeriod < 4) ? t("PERIOD") : t("PER")} ${item.period_id}`),
    datasets: [
      {
        label: t("REVENUE"),
        data: filteredFirmData?.map((item) => item.revenue / unit),
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness
      },
    ],
  };
  const netContributionData = {
    labels: filteredFirmData?.map((item) => `${(selectedPeriod < 4) ? t("PERIOD") : t("PER")} ${item.period_id}`),
    datasets: [
      {
        label: t("NET_CONTRIBUTION"),
        data: filteredFirmData?.map((item) => item.net_contribution / unit),
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness
      },
    ],
  };
  const marketShareData = {
    labels: filteredFirmData?.map((item) => `${(selectedPeriod < 4) ? t("PERIOD") : t("PER")} ${item.period_id}`),
    datasets: [
      {
        label: t("MARKET_SHARE"),
        data: filteredFirmData?.map((item) => item.market_share),
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness
      },
    ],
  };

  const unitMarketShare = {
    labels: filteredFirmData?.map((item) => `${(selectedPeriod < 4) ? t("PERIOD") : t("PER")} ${item.period_id}`),
    datasets: [
      {
        label: t("UNIT_MARKET_SHARE"),
        data: filteredFirmData?.map((item) => item.unit_market_share),
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness
      },
    ],
  };
  const filteredBrandRevenue = brandData?.filter((item) => item.period_id === selectedPeriod) || []
  // Example chart data for Brands
  const brandRevenueChartData = {
    labels: filteredBrandRevenue?.map((item) => item.brand_name),
    datasets: [
      {
        data: filteredBrandRevenue?.map((item) => item.revenue / unit),
        backgroundColor: firmColors,
        borderColor: firmColors,
        borderWidth: 1,
      },
    ],
  };

  const brandContributionChartData = {
    labels: filteredBrandRevenue?.map((item) => item.brand_name),
    datasets: [
      {
        data: filteredBrandRevenue?.map((item) => item.contribution / unit),
        backgroundColor: firmColors,
        borderColor: firmColors,
        borderWidth: 1,
      },
    ],
  };


  const title = t("COMPANY_DASHBOARD_LONG", { teamName, industryName, selectedPeriod })

  return (
    <>

      <div className="">
        <div className="container mx-auto">
          <BlockHeader title={title} />
          <div className="grid grid-cols-3 gap-4">
            <GraphContainer>
                <VerticalBar data={stockPriceData} title={t("SPI")} />
            </GraphContainer>
            <GraphContainer>
                <VerticalBar data={revenueData} title={t("REVENUE_(M$)")} />
            </GraphContainer>
            <GraphContainer>
                <VerticalBar data={netContributionData} title={t("NET_CONTRIBUTION_(M$)")} />
            
            </GraphContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <GraphContainer>
                <VerticalBar data={marketShareData} title={t("MARKET_SHARE_(%$)")} inPercent={true} />
            </GraphContainer>
            <GraphContainer>
                <VerticalBar data={unitMarketShare} title={t("UNIT_MARKET_SHARE_(%U)")} inPercent={true} />
            </GraphContainer>
            <div></div>
          </div>
          <div className="grid grid-cols-3 gap-4 h-80">
            <GraphContainer>
                <DoughnutChart data={brandRevenueChartData} title={t("REVENUE_(M$)")} />
            </GraphContainer>
            <GraphContainer>
                <DoughnutChart data={brandContributionChartData} title={t("CONTRIBUTION_(M$)")} />
            </GraphContainer>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyDashboardPage;


