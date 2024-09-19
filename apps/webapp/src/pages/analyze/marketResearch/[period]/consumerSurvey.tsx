
import {  getValueByBrandSegment, getValueByChannelSegment } from "@/lib/utils";
import {  useEffect, useState } from "react";


import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { channelColors } from "@/lib/constants/colors";
import VerticalBar from "@/components/charts/VerticalBar";
import HorizontalBar from "@/components/charts/HorizontalBar";
import { useSession } from "next-auth/react";
import {  getBrandAwarenessData, getChannelsData, getMarketDemandData, getPurchaseIntentData, getSegmentsData, getShoppingHabitData } from "features/data";
import { brandAwarenessProps, channelProps, demandProps, segmentProps, shoppingHabitProps } from "types";


interface columnProps {
  id: string;
  numeric: boolean;
  label: string;
  percent?: boolean;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function ConsumerSurvey({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession(); // Fetch session data
  const { industryID, firmID } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0;
  const [segments, setSegments] = useState<segmentProps[]>([]);
  const [brandAwareness, setBrandAwareness] = useState<brandAwarenessProps[]>([]);
  const [purchaseIntent, setPurchaseIntent] = useState<brandAwarenessProps[]>([]);
  const [shoppingHabit, setShoppingHabit] = useState<shoppingHabitProps[]>([]);
  const [marketDemand, setMarketDemand] = useState<demandProps[]>([]);
  const [channels, setChannels] = useState<channelProps[]>([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('common');

  useEffect(() => {
    if (status === "authenticated" && firmID && industryID) {
      const loadData = async () => {
        setLoading(true);
        try {
    
          const response2 = await getSegmentsData();
          setSegments(response2);

          const brandAwarenessData = await getBrandAwarenessData({
            industryID,
            period: selectedPeriod,
            token: session.accessToken,
          });
          const purchaseIntentData = await getPurchaseIntentData({
            industryID,
            period: selectedPeriod,
            token: session.accessToken,
          });
          const shoppingHabitData = await getShoppingHabitData({
            industryID,
            period: selectedPeriod,
            token: session.accessToken,
          });
          const marketDemandData = await getMarketDemandData({
            industryID,
            period: selectedPeriod,
            token: session.accessToken,
          });
          const channelsData = await getChannelsData();

          setBrandAwareness(brandAwarenessData);
          setPurchaseIntent(purchaseIntentData);
          setShoppingHabit(shoppingHabitData);
          setMarketDemand(marketDemandData);
          setChannels(channelsData);
          
        } catch (error) {
          console.error("Error fetching market research data:", error);
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

  const total_size = marketDemand.reduce((a, c) => a + c.size, 0);
  let teamJson: { [key: string]: any } = {};
  let firmIdJson: { [key: string]: any } = {};
  const brands = Array.from(
    new Set(
      brandAwareness.map((row) => {
        teamJson[row.brand_name] = row.team_name;
        firmIdJson[row.brand_name] = row.firm_id;
        return row.brand_name;
      })
    )
  );
  let dataArray: { label: string; value_awa: number; value_pi: number }[] = [];
  brands.map((row) =>
    dataArray.push({
      label: row,
      value_awa: marketDemand.reduce(
        (a, c) =>
          a +
          getValueByBrandSegment(brandAwareness, row, c.segment_name, `value`) *
            (c.size / total_size),
        0
      ),
      value_pi: marketDemand.reduce(
        (a, c) =>
          a +
          getValueByBrandSegment(purchaseIntent, row, c.segment_name, `value`) *
            (c.size / total_size),
        0
      ),
    })
  );
  let ordered = dataArray.sort((a, b) => b[`value_awa`] - a[`value_awa`]);

  const chart1Data = {
    labels: ordered.map((row) => row.label),
    datasets: [
      {
        data: ordered.map((row) => row.value_awa),
        borderWidth: 1,
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
    
  };


  let columns: columnProps[] = [];
  columns.push({ id: "name", numeric: false, label: t("BRAND") });
  columns.push({ id: "team_name", numeric: false, label: t("FIRM") });
  segments.map((row) =>
    columns.push({ id: row.name, numeric: true, label: (locale==="fr")?row.name_fr:row.name, percent: true })
  );

  const rows = brands.map((row) => {
    let temp: { [key: string]: any } = {};
    temp["name"] = row;
    temp["team_name"] = teamJson[row];
    segments.map(
      (row2) =>
        (temp[row2.name] = Math.round(
          getValueByBrandSegment(brandAwareness, row, row2.name, `value`) * 100
        ))
    );
    return temp;
  });

  ordered = dataArray.sort((a, b) => b[`value_pi`] - a[`value_pi`]);
  const chart2Data = {
    labels: ordered.map((row) => row.label),
    datasets: [
      {
        data: ordered.map((row) => row.value_pi),
        borderWidth: 1,
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const rows1 = brands.map((row) => {
    let temp: { [key: string]: any } = {};
    temp["name"] = row;
    temp["team_name"] = teamJson[row];
    segments.map(
      (row2) =>
        (temp[row2.name] = Math.round(
          getValueByBrandSegment(purchaseIntent, row, row2.name, `value`) * 100
        ))
    );
    return temp;
  });


  const chart3Data = {
    labels: [""],
    datasets: channels.map((row,id) => ({
      data: segments.map((row1) =>
        getValueByChannelSegment(shoppingHabit, row.name, row1.name, `percent`)
      ),
      label: (locale === "fr") ? row.name_fr : row.name,
      fill: false,
      backgroundColor:channelColors[id],
      borderColor: channelColors[id],
    })),
  };
  const title = t("CONSUMER_SURVEY_-_PERIOD", {selectedPeriod});

  // if(marketResearchChoices.some((choice => choice.study === 6 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

  return (
    <>
      
      <div className="">
      <div className="container mx-auto">
        <HeaderContainer   title={title} content={t("THE_SURVEY_QUESTIONNAIRE_HAS_BEEN_ADMINISTERED_TO_1000_INDIVIDUAL", {period:selectedPeriod})} />
        
        <ParagraphContainer   title={t("BRAND_AWARENESS")} content={t("THE_BRAND_AWARENESS_FIGURES_IN_THE_CHART_AND_TABLE_BELOW_REPRESEN")}/>
  

        <div className="grid grid-cols-1 gap-4 m-4 h-80">
          <GraphContainer>

            <VerticalBar data={chart1Data} title={t("AVERAGE_BRAND_AWARENESS")} inPercent={true} />
  
          </GraphContainer>
        </div>

       

          <div className="col p-7">
          <h4 className="pb-4">{t("BRAND_AWARENESS_BY_CONSUMER_SEGMENT")}</h4>

            <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className="px-2 py-1"
                      align="center"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                      index === rows.length - 1 ? "font-weight-bold" : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td key={column.id} className="px-2 py-1" align="center">
                        {column.percent
                          ? `${row[column.id]} %`
                          : column.numeric
                          ? row[column.id]
                          : row[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        <ParagraphContainer   title={t("PURCHASE_INTENTIONS")} content={t("THE_PURCHASE_INTENTIONS_FIGURES_IN_THE_CHART_AND_TABLE_REPRESENT_")} />


        <div className="grid grid-cols-1 gap-4 m-4 h-80">
          <GraphContainer>

            <VerticalBar data={chart2Data} title={t("AVERAGE_PURCHASE_INTENT")} inPercent={true} />

          </GraphContainer>
        </div>

  

          <div className="col p-7">
          <h4 className="pb-4"> {t("PURCHASE_INTENTION_BY_CONSUMER_SEGMENT")} </h4>

            <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className="px-2 py-1"
                      align="center"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows1.map((row, index) => (
                  <tr
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                      index === rows.length - 1 ? "font-weight-bold" : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td key={column.id} className="px-2 py-1" align="center">
                        {column.percent
                          ? `${row[column.id]} %`
                          : column.numeric
                          ? row[column.id]
                          : row[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
         
        <ParagraphContainer   title={t("SHOPPING_HABITS")} content={t("THE_SHOPPING_HABITS_DATA_IN_THE_CHART_REPRESENTS_FOR_EACH_CHANNEL")} />

    
        <div className="grid grid-cols-1 gap-4 m-4 h-80">
          <GraphContainer>

            <HorizontalBar data={chart3Data}  title="" inPercent={true} legendPos="right" />

          </GraphContainer>
        </div>
      </div>
      </div>
    </>
  );
}

export default ConsumerSurvey;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// ConsumerSurvey.getLayout = function getLayout(page: ReactElement) {
//   return <Layout>{page}</Layout>;
// };
