
import {  useEffect, useState } from "react";


import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { segmentColors } from "@/lib/constants/colors";
import VerticalBar from "@/components/charts/VerticalBar";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useSession } from "next-auth/react";
import {  getSalesData, getSegmentsData } from "features/data";
import {  salesProps, segmentProps } from "types";


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

function ConsumerPanel({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();
  const { industryID, firmID } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0;
  
  const [sales, setSales] = useState<salesProps[]>([]);
  const [segments, setSegments] = useState<segmentProps[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { t } = useTranslation('common');
  
  useEffect(() => {
    if (status === "authenticated" && firmID && industryID) {
      const loadData = async () => {
        setLoading(true);
        try {
          
          const response2 = await getSalesData({
            industryID,
            period: selectedPeriod,
            token: session.accessToken, 
          });
  
          const response3 = await getSegmentsData();
  
          setSales(response2);
          setSegments(response3);
  
        } catch (error) {
          console.error("Error fetching data:", error);
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

  const totalSize = sales?.reduce((a, c) => a + c.volume, 0);
  let teamJson: { [key: string]: any } = {};
  let firmIdJson: { [key: string]: any } = {};
  const brands = Array.from(
    new Set(
      sales?.map((row) => {
        teamJson[row.brand_name] = row.team_name;
        firmIdJson[row.brand_name] = row.firm_id;
        return row.brand_name;
      })
    )
  );


  let dataArray: { label: string; value: number }[] = [];
  brands.map((row) =>
    dataArray.push({
      label: row,
      value:
        sales.filter((row1) => row1.brand_name === row)
          .reduce((a, c) => a + c.volume, 0) / totalSize,
    })
  );
  let ordered = dataArray.sort((a, b) => b[`value`] - a[`value`]);

  const msChartData = {
    labels: ordered.map((row) => row.label),
    datasets: [
      {
        data: ordered.map((row) => row.value),
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
      (row1) =>
        (temp[row1.name] = Math.round(
          (sales
            .filter(
              (row2) => row2.brand_name === row && row2.segment_name === row1.name
            )
            .reduce((a, c) => a + c.volume, 0) /
            sales
              .filter((row2) => row2.segment_name === row1.name)
              .reduce((a, c) => a + c.volume, 0)) *
            100
        ))
    );
    return temp;
  });

  const salesChart = {
    labels: [""],
    datasets: segments.map((row,id) => ({
      data: [
        Math.round(
          sales
            .filter((row2) => row2.segment_name === row.name)
            .reduce((a, c) => a + c.volume, 0)
        ),
      ],
      label: (locale==="fr")?row.name_fr:row.name,
      fill: false,
      backgroundColor: segmentColors[id],
      borderColor: segmentColors[id],
    })),
  };

  const relativeSalesChart = {
    labels: segments.map((row) => (locale==="fr")?row.name_fr:row.name),
    datasets: [
      {
        data: segments.map((row) =>
          sales
            .filter((row1) => row1.segment_name === row.name)
            .reduce((a, c) => a + c.volume, 0)
        ),
        borderWidth: 1,
        backgroundColor: segmentColors,
    borderColor: segmentColors,
      },
    ],
    
  };

  
  const title = t("CONSUMER_PANEL_-_PERIOD",{selectedPeriod});

  // if(marketResearchChoices.some((choice => choice.study === 5 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

  return (
    <>
      

      <div className="">   
      <div className="container mx-auto">

        <HeaderContainer title={title} content={t("THE_CONSUMER_PANEL_STUDY_SHOWN_BELOW_IS_BASED_ON_A_SAMPLE_GROUP_O")}  />
        
        
        <ParagraphContainer title={t("MARKET_SHARES_(BASED_ON_UNITS_SOLD)")} content={t("THE_MARKET_SHARES_FIGURES_IN_THE_CHART_AND_TABLE_BELOW_REPRESENT_THE_PROPORTION_OF_INDIVIDUALS_WHO_HAVE_PURCHASED_A_GIVEN_BRAND_DURING_PERIOD",{selectedPeriod})} />
 

        <div className="grid grid-cols-1 gap-4 m-4 h-80">
          <GraphContainer>

            <VerticalBar
              data={msChartData}
                title={t("TOTAL_MARKET_SHARES_(%UNIT)")}
                inPercent={true}   
            />

          </GraphContainer>
        </div>

     

        <div className="col p-7">
        <h4 className="pb-4">
            {t("MARKET_SHARE_BY_CONSUMER_SEGMENT")}
          </h4>
          <div className="col">

            <table className="w-full text-xs border text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
        </div>

    
        <ParagraphContainer title={t("INDUSTRY_VOLUME_(BASED_ON_UNITS_SOLD)")} 
        content={t("THE_CHARTS_BELOW_GIVE_THE_UNIT_PRODUCT_CATEGORY_SALES_BY_CONSUMER")} />

        <div className="grid grid-cols-2 gap-4 m-4 h-80">
          <GraphContainer>

            <HorizontalBar
              data={salesChart}
                title={t("UNIT_SALES_BY_CONSUMER_SEGMENT_IN_THOUSAND_OF_UNITS")}
                legendDisplay={false}
                legendPos="right"
            />

          </GraphContainer>
          
          <GraphContainer>

            <DoughnutChart
              data={relativeSalesChart}
              title={t("RELATIVE_CONSUMER_SEGMENT_SIZES") }
              inPercent={true}
            />

          </GraphContainer>
          
        </div>
      </div>
      </div>
    </>
  );
}

export default ConsumerPanel;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// ConsumerPanel.getLayout = function getLayout(page: ReactElement) {
//   return <Layout>{page}</Layout>;
// };
