import HeaderContainer from "@/components/container/header";
import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";
import { fetchChartData } from "features/data";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ChartDataType } from "types";

const DynamicChart = dynamic(() => import('@/components/charts/Chart'), { ssr: false });

type MenuStructure = {
    [key: string]: { [key: string]: string };
  };


export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || 'fr';
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        locale,
      },
    };
  };
  
  function Page({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { data: session, status } = useSession();
    const { t } = useTranslation('common');
    const [industry, setIndustry] = useState(session?.industryID || '');
    const [chartType, setChartType] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedData, setSelectedData] = useState<ChartDataType>();
    const [selectedMenu, setSelectedMenu] = useState('');
    const { activePeriod, industryName, industryID } = session || {};
    const [loading, setLoading] = useState(true);

    const menu: MenuStructure = {
      MARKET: {
        // [t('MARKET_SIZE')]: 'marketSize',
        // [t('MARKET_GROWTH')]: 'marketGrowth',
        // [t('MARKET_SEGMENT_SIZE')]: 'marketSegmentSize',
        // [t('AVERAGE_PRICE')]: 'averagePrice'
      },
      PERFORMANCE: {
        [t('MARKET_RETAIL_SALES')]: '2',
        [t('MARKET_SALES')]: '3',
        [t('MARKET_SHARE')]: '4',
        // [t('SEGMENT_SALES')]: 'segmentSales',
        // [t('CHANNEL_SHARES')]: 'channelShares',
        // [t('NET_CONTRIBUTION')]: 'netContribution',
        // [t('CUMULATIVE_NET_CONTRIBUTION')]: 'cumulativeNetContribution',
        [t('SHARE_PRICE_INDEX')]: '1'
      },
      BENCHMARKING: {
        // [t('REVENUES')]: 'revenues',
        // [t('COST_OF_GOODS_SOLD')]: 'costOfGoodsSold',
        // [t('INVENTORY_COST')]: 'inventoryCost',
        // [t('CUMULATIVE_INVENTORY_COST')]: 'cumulativeInventoryCost',
        // [t('CONTRIBUTION_BEFORE_MARKETING')]: 'contributionBeforeMarketing',
        [t('ADVERTISING_EXPENDITURE')]: '8',
        [t('COMMERCIAL_TEAM_EXPENDITURES')]: '11',
        // [t('NET_CONTRIBUTION_BENCHMARK')]: 'netContributionBenchmark',
        // [t('SELLING_PRICE')]: 'sellingPrice',
        // [t('RETAIL_PRICE')]: 'retailPrice'
      }
    };
  
    useEffect(() => {
        if (chartType && industryID && activePeriod && status === 'authenticated') {
        const fetchData = async () => {
          try {
            const data = await fetchChartData({
              chartType,
              period: (activePeriod-1).toString(),
              industry:industryID.toString(),
              token: session.accessToken
            });
            setSelectedData(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }
    }, [status, chartType, industry, activePeriod]);

    if (status === "loading") {
        return <Loading />;
      }
  
    return (
      <>
        <Title pageTitle={t('CHARTING_TOOL')} />
        <div className="container mx-auto">
          <HeaderContainer title={t('CHARTING_TOOL')} />
  
          <div className="flex">
            {/* Left Menu Section */}
            <div className="w-1/4 p-4 border-r">
              {/* Industry Selection */}
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mt-4 mb-6"
                defaultValue={industryID}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="" disabled>
                  {t('SELECT_INDUSTRY')}
                </option>
                <option value={industryID}>{industryName}</option>
              </select>
  
              {/* Main Menu Selection */}
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mt-4 mb-6"
                defaultValue=""
                onChange={(e) => setSelectedMenu(e.target.value)}
              >
                <option value="" disabled>
                  {t('SELECT_MENU')}
                </option>
                {Object.keys(menu).map((menuTitle) => (
                  <option key={menuTitle} value={menuTitle}>
                    {t(menuTitle)}
                  </option>
                ))}
              </select>
  
              {/* Submenu Dropdown - Appears only when a main menu is selected */}
              {selectedMenu && (
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mt-4 mb-6"
                  defaultValue=""
                  onChange={(e) => {
                    const selectedChartType = e.target.value;
                    const selectedTitle = Object.keys(menu[selectedMenu]).find(
                      (title) => menu[selectedMenu][title] === selectedChartType
                    );
                    setChartType(selectedChartType);
                    setSelectedTitle(selectedTitle || '');
                  }}
                >
                  <option value="" disabled>
                    {t('SELECT_SUBMENU')}
                  </option>
                  {Object.entries(menu[selectedMenu]).map(([submenuTitle, chartType]) => (
                    <option key={chartType} value={chartType}>
                      {submenuTitle}
                    </option>
                  ))}
                </select>
              )}
            </div>
  
            {/* Right Chart Area */}
            <div className="w-3/4 p-4">
              <h2 className="text-2xl font-semibold mb-4">{selectedTitle}</h2>
              <div className="bg-white shadow-md rounded-lg p-6 h-96">
                {selectedData ? (
                  <DynamicChart
                    data={selectedData.data}
                    options={selectedData.options}
                    displayType={selectedData.displayType}
                    chartType={selectedData.chartType}
                    title={selectedTitle}
                  />
                ) : (
                  <p>{t('SELECT_SUBMENU_TO_VIEW_GRAPH')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default Page;