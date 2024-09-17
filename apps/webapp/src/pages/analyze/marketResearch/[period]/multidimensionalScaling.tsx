
import {  getMapData, getValueByBrandDimension, getValueBySegmentDimension } from "@/lib/utils";
import {  useEffect, useState } from "react";

import { TableSimple } from "@/components/Table/Table";
import { Loading } from "@/components/Loading";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { HeaderContainer, ParagraphContainer } from "@/components/container";
import ScatterChart from "@/components/charts/ScatterChart";
import { useSession } from "next-auth/react";
import { DimensionIdealsProps, dimensionProps, DimensionScalesProps, marketResearchProps, segmentProps } from "types";
import { fetchDimensions, fetchMarketResearchChoices, getDimensionalIdealsData, getDimensionalScalesData, getSegmentsData } from "features/data";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};


function MultidimensionalScaling({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession(); // Fetch session data
const { industryID, firmID } = session || {}; // Extract industryID and firmID from session
const selectedPeriod = session?.selectedPeriod || 0; // Use session to get selectedPeriod

// Local state for the data
const [dimensional, setDimensional] = useState<DimensionScalesProps[]>([]);
const [ideals, setIdeals] = useState<DimensionIdealsProps[]>([]);
const [segments, setSegments] = useState<segmentProps[]>([]);
const [dimensions, setDimensions] = useState<dimensionProps[]>([]);
const [loading, setLoading] = useState(false); // Loading state

const { t } = useTranslation('common'); // For translation


useEffect(() => {
  // Check if the session is authenticated and we have industryID and firmID
  if (status === "authenticated" && firmID && industryID) {

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetching all necessary data using API calls instead of dispatching Redux actions
 
        const response2 = await getDimensionalScalesData({
          industryID,
          period: selectedPeriod,
          token: session.accessToken,
        });
        
        const response3 = await getDimensionalIdealsData({
          industryID,
          period: selectedPeriod,
          token: session.accessToken,
        });

        const response4 = await getSegmentsData();

        const response5 = await fetchDimensions();

        // Setting the responses into state
        setDimensional(response2);
        setIdeals(response3);
        setSegments(response4);
        setDimensions(response5);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Make sure to stop the loading spinner
      }
    };

    // Trigger data loading
    loadData();
  }
}, [status]);
  
let firmIds : { [key: string]: any } = {};
let teamLabels : { [key: string]: any } = {};

const brands = Array.from(new Set(dimensional.map(row => {
                    teamLabels[row.brand_name] = row.team_name
                    firmIds[row.brand_name] = row.firm_id
                     return row.brand_name
                   })))

let columns = []
columns.push({id:'name' , numeric: false, label:t('BRAND')})
columns.push({id:'team_name' , numeric: false, label:t('FIRM')})
dimensions.map(row => columns.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name }))

const rows = brands.map(row =>{
            let temp: { [key: string]: any } = {};
            temp["id"]= firmIds[row]
             temp['name'] = row
             temp['team_name'] = teamLabels[row]
             dimensions.map(
               row1 => temp[row1.name]= getValueByBrandDimension(dimensional,row,row1.name,`rating`)
                      )
             return temp
            })

let columns1 = []
columns1.push({id:'name' , numeric: false, label:''})
dimensions.map(row => columns1.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name, }))

const rows1 = segments.map(row =>{
             let temp: { [key: string]: any } = {};
             temp["id"] = row.id
             temp['name'] =  (locale==="fr")?row.name_fr:row.name
             temp['segment_name'] = (locale==="fr")?row.name_fr:row.name
             dimensions.map(
               row1 => temp[row1.name]= (getValueBySegmentDimension(ideals,row.name,row1.name,`rating`)||0 ).toFixed(1)
                      )
             return temp
            })



  const mergedata = [...rows, ...rows1]

  const xTitle1 = (locale==="fr")?dimensions[0]?.name_fr:dimensions[0]?.name
  const yTitle1 = (locale==="fr")?dimensions[1]?.name_fr:dimensions[1]?.name
  const ticks = [-20,-10,0,10,20]
  const max=20
  const min=-20

  const chart1Data = getMapData({mergedata,xKey:dimensions[0]?.name,
                     yKey:dimensions[1]?.name})
  
  const xTitle2 = (locale==="fr")?dimensions[0]?.name_fr:dimensions[0]?.name
  const yTitle2 = (locale==="fr")?dimensions[2]?.name_fr:dimensions[2]?.name


  const chart2Data = getMapData({mergedata,xKey:dimensions[0]?.name,
                      yKey:dimensions[2]?.name})


  const title = t("MULTIDIMENSIONAL_SCALING_OF_BRAND_SIMILARITIES_&_PREFERENCES_-_PERIOD",{selectedPeriod});

  // if(marketResearchChoices.some((choice => choice.study === 9 && choice.choice === false))){
  //   router.push(paths.analyze.marketResearch.$url());
  // }

    return (<>
    
    
    <div className="">
    <div className="container mx-auto">
      <HeaderContainer  title={title} content={t("THIS_STUDY_PROVIDES_A_JOINT_SPACE_CONFIGURATION_OBTAINED_WITH_NON")}/>
      <ParagraphContainer title={t("PERCEPTUAL_MAP")} content={t("THIS_STUDY_PROVIDES_A_GRAPHICAL_REPRESENTATION_OF_THE_PERCEPTUAL_POSITIONING_OF_BRANDS_AND_CONSUMERS")}/>
    
      
      <div className="p-4">
      <ParagraphContainer title={t("ECONOMY_X_PERFORMANCE")}/>


      <div className="p-1">
        <div className="row align-items-center  pt-4">
          <div className="col col-map" id='brandmap'>
          {(loading )? <Loading />:  
          chart1Data && <ScatterChart data={chart1Data.data} min={min} max={max} ticks={ticks} xTitle={xTitle1} yTitle={yTitle1} labelColors={chart1Data.labelColors} closePairs={chart1Data.closePairs} />
          }
          </div>
        </div>
      </div>
      </div>
      
      <div className="p-4">
      <ParagraphContainer title={t("ECONOMY_X_CONVENIENCE")} />

      <div className="p-1">
        <div className="row align-items-center  pt-4">
          <div className="col col-map" id='brandmap'>
          {(loading)? <Loading />: 
           chart2Data && <ScatterChart data={chart2Data.data} min={min} max={max} ticks={ticks} xTitle={xTitle2} yTitle={yTitle2} labelColors={chart2Data.labelColors} closePairs={chart2Data.closePairs} />
        }
          </div>
        </div>
      </div>
      </div>


      <ParagraphContainer title={t("BRAND_PERCEPTIONS")} content={t("THE_TABLE_BELOW_GIVES_THE_COORDINATES_OF_THE_BRAND_POSITION_ON_TH")} />

        <div className="col p-4">
        {(loading )? <Loading />: 
        <TableSimple columns={columns} rows={rows}/>
      }
        </div>


      <ParagraphContainer title={t("IDEAL_VALUES")} content={t("THE_TABLE_BELOW_GIVES_THE_COORDINATES_OF_THE_BRAND_POSITION_ON_TH2")} />


        <div className="col p-4">
        {(loading )? <Loading />: 
        <TableSimple columns={columns1} rows={rows1}/>
    }
        </div>
{/* 
      <div className="p-4">
        <span className="g-subtitle text-xl text-blue-700">Influence of Product Characteristics on Perceptual Dimensions </span>
        <span className="g-comment">
          <p>An indication of the influence of product characterisitics on perceptual dimensions is provided in the table below to help
          you interpret the dimension that were derived from the study.  </p>
        </span>
      </div>

      <div className="p-1">
        <div className="row align-items-center">
          <table className="table table-hover table-fr">
            <thead className="thead-light">
              <tr>
                <th scope="col"> </th>
                {p_feature.map(entry => (
                  <th key={entry} scope="col">{entry}</th>
                ))}
              </tr>
            </thead>
            {p_values &&
              <tbody>
                {p_label.map((entry, index) => (
                  <tr key={entry}>
                    <td scope="row" className="w_fixed">{entry}</td>
                    {entry.map((values, innerIndex) => (
                      <td key={innerIndex} className="" align="right">{values}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            }
          </table>
        </div>
      </div> */}
    </div>
    </div>
    </>  );
}

export default MultidimensionalScaling;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// MultidimensionalScaling.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };