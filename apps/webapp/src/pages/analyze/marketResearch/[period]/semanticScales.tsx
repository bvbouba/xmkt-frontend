
import { getFeaturesData, getSegmentsData, getSemanticIdealsData, getSemanticScalesData } from "features/analyzeSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {  getMapData, getValueByBrandFeature, getValueBySegmentFeature } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TableSimple } from "@/components/Table/Table";
import { useRouter } from "next/router";
import { fetchMarketResearchChoices } from "features/decideSlices";
import { Loading } from "@/components/Loading";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { HeaderContainer, ParagraphContainer } from "@/components/container";
import { featureProps } from "types";
import { useAuth } from "@/lib/providers/AuthProvider";
import ScatterChart from "@/components/charts/ScatterChart";



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

function SemanticScales({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [selectedFeature,setSelectedFeature] = useState<featureProps|undefined>(undefined)
  const dispatch = useAppDispatch();

    const { t } = useTranslation('common')

    const router = useRouter()

    const { period } = router.query as { period: string};
    const selectedPeriod = parseInt(period)
    const {participant} = useAuth()
  const { industryID, firmID } =participant || {};
     
  
    useEffect(()=>{
      if (firmID && industryID ) {
      dispatch(fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: selectedPeriod }));
      }
    },[dispatch,firmID,industryID,selectedPeriod])
  
    const { data: marketResearchChoices } = useAppSelector((state) => state.decide.marketResearchChoices);
  
  
  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (firmID && industryID) {
      dispatch(getSemanticScalesData({ industryID, period:selectedPeriod }));
      dispatch(getSemanticIdealsData({ industryID, period:selectedPeriod }));
    }
    dispatch(getFeaturesData())
    dispatch(getSegmentsData())
  }, [dispatch,selectedPeriod,industryID]);

 
  const {data:semantics,loading:sloading} = useAppSelector(
    (state) => state.analyze.semanticScales
  );
  const {data:ideals,loading:iloading} = useAppSelector(
    (state) => state.analyze.semanticIdeals
  );
  const {data:featuresData} = useAppSelector(
    (state) => state.analyze.features
  );

  const {data:segments} = useAppSelector(
    (state) => state.analyze.segments
  );
  
const features = featuresData.filter(item=>item.surname !== "feature_7")

useEffect(() => {
  // Set the initial feature to features[0] only when the component mounts
  if (features.length > 0 && !selectedFeature) {
    setSelectedFeature(features[0]);
  }
}, [features, selectedFeature]);


let firmIds: { [key: string]: any } = {};
let teamLabels: { [key: string]: any } = {};

const brands = Array.from(new Set(semantics.map(row => {
                    teamLabels[row.brand_name] = row.team_name
                    firmIds[row.brand_name] = row.firm_id
                     return row.brand_name
                   })))

let columns:columnProps[] = []
columns.push({id:'name' , numeric: false, label:t('BRAND')})
columns.push({id:'team_name' , numeric: false, label:t('FIRM')})
features.map(row => columns.push({id:row.abbrev , numeric: true, label:(locale==="fr")?row.abbrev_fr :row.abbrev }))

const rows = brands.map(row =>{
             let temp: { [key: string]: any } = {};
             temp["id"]= firmIds[row]
             temp['name'] = row
             temp['team_name'] = teamLabels[row]
             features.map(
               row1 => temp[row1.abbrev]= getValueByBrandFeature(semantics,row,row1.abbrev,`rating`)
                      )
             return temp
            })


let columns1 = []
columns1.push({id:'name' , numeric: false, label:''})
features.map(row => columns1.push({id:row.abbrev , numeric: true, label:(locale==="fr")?row.abbrev_fr :row.abbrev, }))

const rows1 = segments.map(row =>{
              let temp: { [key: string]: any } = {};
              temp["id"] = row.id
             temp['name'] = (locale==="fr")?row.name_fr:row.name
             temp['segment_name'] = (locale==="fr")?row.name_fr:row.name
             features.map(
               row1 => temp[row1.abbrev]= (getValueBySegmentFeature(ideals,row.name,row1.abbrev,`rating`) || 0).toFixed(1)
                      )
             return temp
            })


  const mergedata = [...rows, ...rows1]


  const handleClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAbbrev = e.target.value;
    const selectedFeat = features.find(entry => entry.abbrev === selectedAbbrev);
    if (selectedFeat) {
      setSelectedFeature(selectedFeat);
    }
  }

  const etalon = features.find(entry=> entry.surname==="feature_6")
  
  const xTitle = (locale==="fr")?etalon?.abbrev_fr:etalon?.abbrev
  const yTitle = (locale==="fr")?selectedFeature?.abbrev_fr:selectedFeature?.abbrev
  const ticks = [1,4,7]
  const max=7
  const min=1

  const chartData = getMapData({mergedata,xKey:etalon?.abbrev,
                             yKey:selectedFeature?.abbrev,})

  const title = t("SEMANTIC_SCALES_-_PERIOD",{selectedPeriod});
  // if(marketResearchChoices.some((choice => choice.study === 10 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }
    return (  <>
    
       
    <div className="">
    <div className="container mx-auto">
      <HeaderContainer title={title}  content={t("THE_SEMANTIC_SCALES_STUDY_PROVIDES_DATA_BASED_ON_A_SEMANTIC_DIFFE")} />
      <span>
        <img src="/images/semantic_scale_sample.png" alt="semantic_scale_sample" />
      </span>
       <ParagraphContainer  content={t("SEVERAL_CRUCIAL_INFORMATION_ARE_DERIVED_FROM_THESE_QUESTIONNAIRES")}   />
     
      <>

      <ParagraphContainer title={t("BRAND_PERCEPTIONS")} content={t("RESPONDENTS_ARE_ASKED_TO_RATE_EACH_BRAND_ACCORDING_TO_THE_WAY_THE")}   />

          <div className="col p-4">
          {sloading ? <Loading />:  
          <TableSimple columns={columns} rows={rows}/>
    }
          </div>
      </>

      <>
        <ParagraphContainer title={t("IDEAL_VALUES")} content={t("RESPONDENTS_ARE_ASKED_TO_RATE_EACH_BRAND_ACCORDING_TO_THE_WAY_THE2")}   />

          <div className="col p-4">
          {iloading ? <Loading />:  
          <TableSimple columns={columns1} rows={rows1}/>
  }
          </div>
      </>

      <ParagraphContainer title={t("BRAND_MAPS")} content={t("MAPS_REPRESENTING_CONSUMERS_PERCEPTIONS_BASED_ON_THE_SEMANTIC_SCALES")}   />


      {(iloading && sloading) ? <Loading />:  

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
      </div>
}
    </div>
    </div>
    </>);
}

export default SemanticScales;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// SemanticScales.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };