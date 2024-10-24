import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { featureColors } from "@/lib/constants/colors";
import VerticalBar from "@/components/charts/VerticalBar";
import LineChart from "@/components/charts/LineChart";
import { useSession } from "next-auth/react";
import {  getFeaturesData, getLevelsData, getSegmentsData, getUtilitiesData } from "features/data";
import { featureProps, levelProps, segmentProps, utilitiesProps } from "types";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};


function ConjointAnalysis({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();
  const { industryID, firmID, courseID } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0;

  const [utilities, setUtilities] = useState<utilitiesProps[]>();
  const [levels, setLevels] = useState<levelProps[]>();
  const [featureList, setFeatureList] = useState<featureProps[]>();
  const [segments, setSegments] = useState<segmentProps[]>();
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation('common');
  useEffect(() => {
    if (status === 'authenticated' && firmID && industryID && courseID) {
      const loadData = async () => {
        setLoading(true);
        try {
    

          const [utilitiesData, levelsData, featuresData, segmentsData] = await Promise.all([
            getUtilitiesData({ courseID, token: session?.accessToken }),
            getLevelsData({ token: session?.accessToken }),
            getFeaturesData(),
            getSegmentsData(),
          ]);

          setUtilities(utilitiesData);
          setLevels(levelsData);
          setFeatureList(featuresData);
          setSegments(segmentsData);
        } catch (error) {
          console.error('Error fetching market research choices:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [status,firmID,industryID,courseID,session?.accessToken]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  let features: string[] = [];

  let ids: { [key: string]: any } = {};
  if (utilities && utilities.length > 0)
    features = utilities[0].utilities.map((row) => {
      ids[row.feature_name] = row.feature;
      return row.feature_name;
    });
  let w_utils: { [key: string]: any } = {};
  let m_utils: { [key: string]: any } = {};

  segments?.forEach((row) => {
    m_utils[row.name] = [];
    w_utils[row.name] = [];

    features.forEach((row1) => {
      let array = [0, 0, 0, 0];
      let length = utilities?.filter((row2) => row2.segment_name === row.name).length || 1;

      utilities?.filter((row2) => row2.segment_name === row.name)
        .forEach((row2) => {
          row2.utilities
            .filter((row3) => row3.feature_name === row1)
            .forEach((row4) => {
              array = [
                array[0] + row4.u_1,
                array[1] + row4.u_2,
                array[2] + row4.u_3,
                array[3] + row4.u_4,
              ];
            });
        });

      m_utils[row.name].push(array.map((x) => x / length));
      w_utils[row.name].push(Math.max(...array) - Math.min(...array));
    });
  });

  const chart1Data = {
    labels: segments?.map(entry=>(locale==="fr")?entry.name_fr:entry.name) || [],
    datasets: features.map((row, id) => ({
      label: ((locale==="fr")? featureList?.find((row1) => row1.abbrev === row)?.abbrev_fr : featureList?.find((row1) => row1.abbrev === row)?.abbrev),
      data: segments?.map((row1) => {
        let c = w_utils[row1.name][id];
        let t = w_utils[row1.name].reduce((a: number, b: number) => a + b, 0);
        return c / t;
      }) || [],
      borderWidth: 1,
      backgroundColor:featureColors[id],
      borderColor:featureColors[id],
    })),
  };

  let chart2Data: { [key: string]: any } = {};
  segments?.map((row) => {
    chart2Data[row.name] = {
    labels:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,],    
    datasets:features.map((row1, id1) => {
      let dl: number[] = [];
      let temp = levels?.filter(
        (row2) => row2.segment_name === row.name && row2.feature_name === row1
      );
      if (temp && temp.length > 0)
        dl = [temp[0].l_1, temp[0].l_2, temp[0].l_3, temp[0].l_4];

       let datalabels = [
        ...Array(5 * id1)
          .fill(null)
          .map((v) => null),
        ...dl,
      ];
      return ({
        data: [
          ...Array(5 * id1)
            .fill(null)
            .map((v) => null),
          ...m_utils[row.name][id1],
        ],
        label:  (locale==="fr")? featureList?.find((row) => row.abbrev === row1)?.abbrev_fr:featureList?.find((row) => row.abbrev === row1)?.abbrev,
        lineTension: 0.1,
        pointRadius: 3,
        pointStyle: "circle",
        fill: false,
        datalabels: {
          display: true,
          align: "end",
          anchor: "end",
          formatter: function (value: any, ctx: any) {
            return datalabels[ctx.dataIndex];
          },
        },
        backgroundColor:featureColors[id1],
        borderColor:featureColors[id1],
      });
    })};
  })
 
  let legend = "";
  features.map((row) => {
    let temp = featureList?.filter((row1) => row1.abbrev === row);
    if (temp && temp.length > 0)
      legend = legend.concat(`${temp[0].abbrev}: ${temp[0].unit},`);
  });

 
  // if(marketResearchChoices.some((choice => choice.study === 4 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

  return (
    <>
      
      <Title pageTitle={t("CONJOINT_ANALYSIS")} period={selectedPeriod} />      

      <div className="">
      <div className="container mx-auto">
      <HeaderContainer  title={t("CONJOINT_ANALYSIS")} period={selectedPeriod} content={t("THIS_STUDY_ENABLES_FIRMS_TO_ESTIMATE_THE_RELATIVE_IMPORTANCE_OF_T")} />

      <div className="grid grid-cols-1 mb-4 h-80">
          <GraphContainer>

           <VerticalBar data={chart1Data} title="" inPercent={true} legend={true} />
        
          </GraphContainer>
      </div>

      <ParagraphContainer title= {t("UTILITY_CHARTS")} content={t("THE_CHARTS_BELOW_SHOW_THE_UTILITIES_ATTACHED_TO_FOUR_ARBITRARY_LE")}   />
 
      <div className="grid grid-cols-1">
        {segments?.map((segment,index) => (
          <div className="col h-72 p-4" key={index}>
            <LineChart data={chart2Data[segment.name]} title={(locale==="fr")?segment.name_fr:segment.name} yGrid={true} xTicks={false} yTitle={t("UTILITY")}/>
          </div>
        ))} 
      </div>

    </div>
    </div>
    </>
  );
}

export default ConjointAnalysis;

