
import { getMapData, getValueByBrandFeature, getValueBySegmentFeature } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TableSimple } from "@/components/Table/Table";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { HeaderContainer, ParagraphContainer } from "@/components/container";
import { featureProps, segmentProps, SemanticIdealsProps, SemanticScalesProps } from "types";
import ScatterChart from "@/components/charts/ScatterChart";
import { useSession } from "next-auth/react";
import { getFeaturesData, getSegmentsData, getSemanticIdealsData, getSemanticScalesData } from "features/data";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";



interface columnProps {
  id: string;
  numeric: boolean;
  label: string;
  percent?: boolean;
}


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function SemanticScales({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();
  const { t } = useTranslation('common');

  const industryID = session?.industryID;
  const selectedPeriod = session?.selectedPeriod || 0;

  const [selectedFeature, setSelectedFeature] = useState<featureProps | undefined>(undefined);
  const [semantics, setSemantics] = useState<SemanticScalesProps[]>([]);
  const [ideals, setIdeals] = useState<SemanticIdealsProps[]>([]);
  const [featuresData, setFeaturesData] = useState<featureProps[]>([]);
  const [segments, setSegments] = useState<segmentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'

  useEffect(() => {
    if (status === 'authenticated' && industryID) {
      const loadData = async () => {
        setLoading(true);
        try {

          const response2 = await getSemanticScalesData({ industryID, period: selectedPeriod, token: session.accessToken });
          setSemantics(response2);

          const response3 = await getSemanticIdealsData({ industryID, period: selectedPeriod, token: session.accessToken });
          setIdeals(response3);

          const response4 = await getFeaturesData();
          setFeaturesData(response4);

          const response5 = await getSegmentsData();
          setSegments(response5);
        } catch (error) {
          console.error('Error getting data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [status, industryID, selectedPeriod, session?.accessToken]);

  const features = featuresData.filter(item => item.surname !== "feature_7")

  useEffect(() => {
    // Set the initial feature to features[0] only when the component mounts
    if (features.length > 0 && !selectedFeature) {
      setSelectedFeature(features[0]);
    }
  }, [features, selectedFeature]);


  if (status === "loading" || loading) {
    return <Loading />;
  }




  let firmIds: { [key: string]: any } = {};
  let teamLabels: { [key: string]: any } = {};

  const brands = Array.from(new Set(semantics.map(row => {
    teamLabels[row.brand_name] = row.team_name
    firmIds[row.brand_name] = row.firm_id
    return row.brand_name
  })))

  let columns: columnProps[] = []
  columns.push({ id: 'name', numeric: false, label: t('BRAND') })
  columns.push({ id: 'team_name', numeric: false, label: t('FIRM') })
  features.map(row => columns.push({ id: row.abbrev, numeric: true, label: (locale === "fr") ? row.abbrev_fr : row.abbrev }))

  const rows = brands.map(row => {
    let temp: { [key: string]: any } = {};
    temp["id"] = firmIds[row]
    temp['name'] = row
    temp['team_name'] = teamLabels[row]
    features.map(
      row1 => temp[row1.abbrev] = getValueByBrandFeature(semantics, row, row1.abbrev, `rating`)
    )
    return temp
  })


  let columns1 = []
  columns1.push({ id: 'name', numeric: false, label: '' })
  features.map(row => columns1.push({ id: row.abbrev, numeric: true, label: (locale === "fr") ? row.abbrev_fr : row.abbrev, }))

  const rows1 = segments.map(row => {
    let temp: { [key: string]: any } = {};
    temp["id"] = row.id
    temp['name'] = (locale === "fr") ? row.name_fr : row.name
    temp['segment_name'] = (locale === "fr") ? row.name_fr : row.name
    features.map(
      row1 => temp[row1.abbrev] = (getValueBySegmentFeature(ideals, row.name, row1.abbrev, `rating`) || 0).toFixed(1)
    )
    return temp
  })


  const mergedata = [...rows, ...rows1]




  const etalon = features.find(entry => entry.surname === "feature_6")


  const ticks = [1, 4, 7]
  const max = 7
  const min = 1



  // if(marketResearchChoices.some((choice => choice.study === 10 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }
  return (<>

    <Title pageTitle={t("SEMANTIC_SCALES")} period={selectedPeriod} />

    <div className="">
      <div className="container mx-auto">
        <HeaderContainer title={t("SEMANTIC_SCALES")} period={selectedPeriod} content={t("THE_SEMANTIC_SCALES_STUDY_PROVIDES_DATA_BASED_ON_A_SEMANTIC_DIFFE")} />
        <span>
          <img src={`${basePath}/images/semantic_scale_sample.png`} alt="semantic_scale_sample" />
        </span>
        <ParagraphContainer content={t("SEVERAL_CRUCIAL_INFORMATION_ARE_DERIVED_FROM_THESE_QUESTIONNAIRES")} />

        <>

          <ParagraphContainer title={t("BRAND_PERCEPTIONS")} content={t("RESPONDENTS_ARE_ASKED_TO_RATE_EACH_BRAND_ACCORDING_TO_THE_WAY_THE")} />

          <div className="col p-4">

            <TableSimple columns={columns} rows={rows} />

          </div>
        </>

        <>
          <ParagraphContainer title={t("IDEAL_VALUES")} content={t("RESPONDENTS_ARE_ASKED_TO_RATE_EACH_BRAND_ACCORDING_TO_THE_WAY_THE2")} />

          <div className="col p-4">

            <TableSimple columns={columns1} rows={rows1} />

          </div>
        </>

        <ParagraphContainer title={t("BRAND_MAPS")} content={t("MAPS_REPRESENTING_CONSUMERS_PERCEPTIONS_BASED_ON_THE_SEMANTIC_SCALES")} />


        {features.filter(entry => entry.abbrev !== etalon?.abbrev).map(feature => {

          const chartData = getMapData({
            mergedata, xKey: etalon?.abbrev,
            yKey: feature?.abbrev,
          })

          const xTitle = (locale === "fr") ? etalon?.abbrev_fr : etalon?.abbrev
          const yTitle = (locale === "fr") ? feature?.abbrev_fr : feature?.abbrev
          if (chartData === null) return <></>
          return (
          <div className="flex justify-center grid grid-cols-1 p-4">
            <div className="">
              <label htmlFor="features" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {`${(locale === "fr") ? etalon?.abbrev_fr : etalon?.abbrev} x ${(locale === "fr") ? feature.abbrev_fr : feature.abbrev}`}
              </label>
            </div>
            <div className="h-96 w-3/4">
              <ScatterChart data={chartData.data} min={min} max={max} ticks={ticks} xTitle={xTitle} yTitle={yTitle} labelColors={chartData.labelColors} closePairs={chartData.closePairs} />
            </div>
          </div>
          )
        }
        )}
        {/* 
      <div className="row align-items-center p-4">
        <div className="col inline-flex">
        <label htmlFor="features" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> {t("SELECT_DIMENSIONS")} : </label>
          <select
          id="feature" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          title="" 
          onChange={handleClick} 
          value={selectedFeature?.abbrev || (features.length > 0 ? features[0]?.abbrev : '')}
          >
            <option value={""}>-------</option>
            {features.filter(entry=>entry.abbrev !== etalon?.abbrev).map((entry,index) => (
                (index !== 5) && <option key={entry.abbrev} value={entry.abbrev} >{`${(locale==="fr")?etalon?.abbrev_fr:etalon?.abbrev} x ${(locale === "fr")?entry.abbrev_fr:entry.abbrev}`}</option>
            ))}
          </select>
        </div>
        <div className="col content-center">
       {chartData && <ScatterChart data={chartData.data} min={min} max={max} ticks={ticks} xTitle={xTitle} yTitle={yTitle} labelColors={chartData.labelColors} closePairs={chartData.closePairs} />}
      </div>
      </div> */}

      </div>
    </div>
  </>);
}

export default SemanticScales;

