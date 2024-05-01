
import { getChannelsData, getSegmentsData } from "features/analyzeSlices";
import { fetchMarketResearchChoices, getMarketingMixData } from "features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getValueByBrand } from "@/lib/utils";
import {  useEffect } from "react";
import { TableSimple, } from "@/components/Table/Table";
import { useRouter } from "next/router";
import { Loading } from "@/components/Loading";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { useAuth } from "@/lib/providers/AuthProvider";
import VerticalBar from "@/components/charts/VerticalBar";
import { channelColors, colorGrades, segmentColors } from "@/lib/constants/colors";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function CompetitiveAds({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  

  const dispatch = useAppDispatch();
  const { t } = useTranslation('common')

  const { period } = router.query as { period: string};
  const selectedPeriod = parseInt(period)
  const {participant} = useAuth()
  const { industryID, firmID } = participant || {};

  
  useEffect(()=>{
    if (firmID && industryID ) {
    dispatch(fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: selectedPeriod }));
    }
  },[dispatch,firmID,industryID,selectedPeriod])

  const { data: marketResearchChoices } = useAppSelector((state) => state.decide.marketResearchChoices);


  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (firmID && industryID) {
      dispatch(getMarketingMixData({ industryID,firmID:0, period:selectedPeriod }));
      dispatch(getChannelsData());
      dispatch(getSegmentsData());
    }
  }, [dispatch,selectedPeriod,industryID]);

  const {data:m2Data, loading:mloading} = useAppSelector(
    (state) => state.decide.marketingMix
  );
  const {data:channels} = useAppSelector(
    (state) => state.analyze.channels
  );

  const {data:segments} = useAppSelector(
    (state) => state.analyze.segments
  );



  let firmIds : { [key: string]: any } = {};
  const teams = Array.from(new Set(m2Data.map(row => {
                      firmIds[row.team_name] = row.firm_id
                       return row.team_name
                     })))

  let dataArray1:{label:string,value_ads:number,value_com:number,firmID:number}[]=[]
  teams.map(row => dataArray1.push(
            {
            label:row,
            firmID:firmIds[row],
            value_ads:m2Data.filter(row1 => row1.firm_id === firmIds[row]).reduce((a,c)=>
                    a + c.advertising
                     ,0),
             value_com:m2Data.filter(row1 => row1.firm_id === firmIds[row]).reduce((a,c)=>
                     a + c.channel_1 + c.channel_2 + c.channel_3
                      ,0)
            })
         )

let dataArray2:{label:string,id:number,value:number}[]=[]
segments.map(row => dataArray2.push(
                   {
                   label:(locale==="fr")?row.name_fr:row.name,
                   id:row.id,
                   value:m2Data.reduce((a,c)=>
                           a + c.advertising*c[`ads_share_${row.id}`]
                            ,0)
                   })
                )

  let ordered1 = dataArray1.sort((a, b) =>b[`value_ads`] - a[`value_ads`])
  const chart1Data = {labels : ordered1.map(row => row.label),
                datasets:[{
                      data: ordered1.map(row=>row.value_ads),
                      borderWidth: 1,
                      barThickness:40,
                      backgroundColor:ordered1.map(row=>colorGrades[row.firmID-1][0]),
                      borderColor: ordered1.map(row=>colorGrades[row.firmID-1][0]),
                  }]
  }

  
  let ordered2 = dataArray2.sort((a, b) =>b.value - a.value)
  const chart2Data = {labels : ordered2.map(row => row.label),
                      datasets:[{
                      data: ordered2.map(row=>Math.round(row.value)),
                      borderWidth: 1,
                      barThickness:40,
                      backgroundColor: ordered2.map(row=>segmentColors[row.id-1]),
                      borderColor: ordered2.map(row=>segmentColors[row.id-1]),
                  }]
                }
  
  

  let ordered3 = dataArray1.sort((a, b) =>b[`value_com`] - a[`value_com`])
    const chart3Data = {
        labels: ordered3.map(row => row.label),
    datasets: [{
                        data: ordered3.map(row=>Math.round(row.value_com)),
                        borderWidth: 1,
                        barThickness:40,
                        backgroundColor:ordered1.map(row=>colorGrades[row.firmID-1][0]),
                        borderColor: ordered1.map(row=>colorGrades[row.firmID-1][0]),
                    }]
  }

    let dataArray4:{label:string,id:number,value:number}[]=[]
    channels.map(row => dataArray4.push(
              {
              label:(locale==="fr")?row.name_fr:row.name,
              id:row.id,
              value:m2Data.reduce((a,c)=>
                      a + c[`channel_${row.id}`]
                       ,0)
              })
           )
    let ordered4 = dataArray4.sort((a, b) =>b[`value`] - a[`value`])
    const chart4Data = {labels : ordered4.map(row => row.label),
    datasets: [{
                        data: ordered4.map(row=>row.value),
                        borderWidth: 1,
                        barThickness:40,
                        backgroundColor: ordered4.map(row=>channelColors[row.id-1]),
                        borderColor: ordered4.map(row=>channelColors[row.id-1]),
                    }]}
  

  const brands = Array.from(new Set(m2Data.map(row => row.brand_name
                     )))
  
  let columns = []
  columns.push({id:'name' , numeric: false, label:'Brand'})
  segments.map(row => columns.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name }))
  columns.push({id:'total' , numeric: true, label:'TOTAL'})
  
  const rows = brands.map(row =>{
               let temp: { [key: string]: any } = {};
               temp['name'] = row
               let total = 0
               segments.map(
                 s => {
                   let share  = getValueByBrand(m2Data,row,selectedPeriod,`ads_share_${s.id}`)
                   let ads = getValueByBrand(m2Data,row,selectedPeriod,`advertising`)
                   total = total + Math.round(share * ads)
                   temp[s.name]= Math.round(share * ads)
                 })
               temp['total'] = total
               return temp
              })
  
  let columns1 = []
  columns1.push({id:'name' , numeric: false, label:'Brand'})
  channels.map(row => columns1.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name }))
  columns1.push({id:'total' , numeric: true, label:'TOTAL'})
  
  const rows1 = brands.map(row =>{
               let temp: { [key: string]: any } = {};
               temp['name'] = row
               let total = 0
               channels.map(
                 s => {
                   let qty = getValueByBrand(m2Data,row,selectedPeriod,`channel_${s.id}`)
                   temp[s.name]= qty
                   total = total + qty
                    })
               temp['total'] = total
               return temp
              })
    
    const title1 = t("COMPETITIVE_ADVERTISING_ESTIMATES_-_PERIOD",{selectedPeriod})   
    const title2 = t("ESTIMATED_COMMERCIAL_TEAM_SIZE_ESTIMATES_-_PERIOD",{selectedPeriod})
    
    const choice1 = marketResearchChoices.some((choice => choice.study === 2 && choice.choice === true))
    const choice2 = marketResearchChoices.some((choice => choice.study === 3 && choice.choice === true))

    
    // if(!choice1 && !choice2){
    //   router.push(paths.analyze.marketResearch.$url());
    // }
    
    return ( <>
    
        

    <div className="">
    <div className="container mx-auto">
      {choice1 && <>
      
        <HeaderContainer  title={title1} content={t("ESTIMATES_OF_COMPETITIVE_ADVERTISING_BUDGETS_ARE_GIVEN_BY_FIRM_BY")} />



      {/* <div className="p-1">
        <span className="g-subtitle text-xl text-blue-700"> {t("RESOURCE_ALLOCATION_OVERVIEW")} </span>
        <span className="g-comment">
          <p>{t("THE_THREE_CHART_BELOW_SHOWS_HOW_RESOURCES_HAVE_BEEN_ALLOCATED_ACR")}</p>
        </span>
      </div> */}


        <div className="grid grid-cols-2 gap-4 h-80 p-4">
          <GraphContainer>
          {mloading ? <Loading />:  
            <VerticalBar data={chart1Data} title={t("ESTIMATE_TOTAL_EXPENDITURE_(IN_MILLION_$)_-_BY_FIRM")} />
    }
          </GraphContainer>
          <GraphContainer>
          {mloading ? <Loading />:  
          <VerticalBar data={chart2Data} title={t("ESTIMATE_TOTAL_EXPENDITURE_(IN_MILLION_$)_-_BY_SEGMENT")} />
  }
          </GraphContainer>
        </div>

          <div className="col p-8">
          {mloading ? <Loading />:  
          <TableSimple columns={columns} rows={rows}/>
          }
      </div></>}

      {choice2 && <><div className="mt-6">

      <HeaderContainer  title={title2} content={t("ESTIMATES_OF_COMPETITIVE_COMMERCIAL_TEAM_SIZE_ARE_GIVEN_BY_FIRM_B")} />


      </div>



        <div className="grid grid-cols-2 gap-4 h-80 p-4">
          <GraphContainer>
          {mloading ? <Loading />:  
          <VerticalBar data={chart3Data} title= {t("ESTIMATED_COMMERCIAL_TEAM_SIZE_(IN_FULL-TIME_EQUIVALENT)_-_BY_FIRM")} />
}
          </GraphContainer>
          <GraphContainer>
          {mloading ? <Loading />:  
          <VerticalBar data={chart4Data} title={t("ESTIMATED_COMMERCIAL_TEAM_SIZE_(IN_FULL-TIME_EQUIVALENT)_-_BY_SEGMENT")} />
}
          </GraphContainer>
        </div>


          <div className="col p-8">
          {mloading ? <Loading />:  
          <TableSimple columns={columns1} rows={rows1}/>
}
      </div>
      </>}

     </div>
    </div>
    </> );
}

export default CompetitiveAds;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// CompetitiveAds.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };