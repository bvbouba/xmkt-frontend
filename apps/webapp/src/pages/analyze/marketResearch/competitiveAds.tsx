
import { getValueByBrand } from "@/lib/utils";
import {  useEffect, useState } from "react";
import { TableSimple, } from "@/components/Table/Table";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer } from "@/components/container";
import VerticalBar from "@/components/charts/VerticalBar";
import { channelColors, colorGrades, colors, segmentColors } from "@/lib/constants/colors";
import { useSession } from "next-auth/react";
import { fetchMarketResearchChoices, getChannelsData, getMarketingMixData, getSegmentsData } from "features/data";
import { channelProps, markertingMixProps, marketResearchProps, segmentProps } from "types";
import { Loading } from "@/components/Loading";
import { Title } from "@/components/title";
import HorizontalBar from "@/components/charts/HorizontalBar";



export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function CompetitiveAds({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const {  industryID, firmID } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [marketResearchChoices,setMarketResearchChoices] = useState<marketResearchProps[]>([])
  const [m2Data,setM2Data] = useState<markertingMixProps[]>([])
  const [channels,setChannels] = useState<channelProps[]>([])
  const [segments,setSegments] = useState<segmentProps[]>([])
  const [loading,setLoading] = useState(true)
  

  const { t } = useTranslation('common')



  
  useEffect(()=>{
  
    if (status === "authenticated" && firmID && industryID) {
     
      const loadData = async () => {
        setLoading(true)
        try {
          const response1 = await fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: selectedPeriod,token: session.accessToken });
          const response2 = await getMarketingMixData({ industryID,firmID:0, period:selectedPeriod,token: session.accessToken,
              fields:"brand_name,brand_id,period_id,team_name,firm_id,advertising,channel_1,channel_2,channel_3,ads_share_1,ads_share_2,ads_share_3,ads_share_4,ads_share_5"
           });
          const response3 = await getChannelsData();
          const response4 = await getSegmentsData();
          setMarketResearchChoices(response1)
          setM2Data(response2)
          setChannels(response3)
          setSegments(response4)
          
        } catch (error) {
          console.error('Error getting course:', error);
        } finally{
          setLoading(false)
        }
      }
      loadData()

    }
  },[status,industryID,firmID,selectedPeriod,session?.accessToken])

  if (status === "loading" || loading) {
    return <Loading />;
  }



  let firmIds : { [key: string]: any } = {};
  const teams = Array.from(new Set(m2Data?.map(row => {
                      firmIds[row.team_name] = row.firm_id
                       return row.team_name
                     })))

  let dataArray1:{label:string,value_ads:number,value_com:number,firmID:number}[]=[]
  teams.map(row => dataArray1.push(
            {
            label:row,
            firmID:firmIds[row],
            value_ads:m2Data?.filter(row1 => row1.firm_id === firmIds[row]).reduce((a,c)=>
                    a + c.advertising
                     ,0),
             value_com:m2Data?.filter(row1 => row1.firm_id === firmIds[row]).reduce((a,c)=>
                     a + c.channel_1 + c.channel_2 + c.channel_3
                      ,0)
            })
         )

let dataArray2:{label:string,id:number,value:number}[]=[]
segments?.map(row => dataArray2.push(
                   {
                   label:(locale==="fr")?row.name_fr:row.name,
                   id:row.id,
                   value:m2Data?.reduce((a,c)=>
                           a + c.advertising*c[`ads_share_${row.id}`]
                            ,0)
                   })
                )

  let ordered1 = dataArray1.sort((a, b) =>b[`value_ads`] - a[`value_ads`])
  const chart1Data = {labels : [""],
                datasets:ordered1.map((row,id)=>({
                  data:[row.value_ads],
                 label: row.label,
                 fill: false,
                 backgroundColor:ordered1.map(row=>colors[id]),
                      borderColor:"white",
                }))
           
  }

  
  let ordered2 = dataArray2.sort((a, b) =>b.value - a.value)
  const chart2Data = {labels : [""],
                      datasets:ordered2.map((row,id)=>({
                        data:[row.value],
                      label: row.label,
                      fill: false,
                      backgroundColor:ordered2.map(row=>segmentColors[id]),
                            borderColor:"white",
                      }))
                  }
  
  

  let ordered3 = dataArray1.sort((a, b) =>b[`value_com`] - a[`value_com`])
    const chart3Data = {labels : [""],
                  datasets:ordered3.map((row,id)=>({
                    data:[row.value_com],
                  label: row.label,
                  fill: false,
                  backgroundColor:ordered3.map(row=>colors[id]),
                        borderColor:"white",
                  }))
              }

  

    let dataArray4:{label:string,id:number,value:number}[]=[]
    channels?.map(row => dataArray4.push(
              {
              label:(locale==="fr")?row.name_fr:row.name,
              id:row.id,
              value:m2Data?.reduce((a,c)=>
                      a + c[`channel_${row.id}`]
                       ,0)
              })
           )
    let ordered4 = dataArray4.sort((a, b) =>b[`value`] - a[`value`])
    const chart4Data = 
    {labels : [""],
      datasets:ordered4.map((row,id)=>({
        data:[row.value],
      label: row.label,
      fill: false,
      backgroundColor:ordered4.map(row=>channelColors[id]),
            borderColor:"white",
      }))
  }
  

  const brands = Array.from(new Set(m2Data?.map(row => row.brand_name
                     )))
  
  let columns = []
  columns.push({id:'name' , numeric: false, label:'Brand'})
  segments?.map(row => columns.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name }))
  columns.push({id:'total' , numeric: true, label:'TOTAL'})
  
  const rows = brands.map(row =>{
               let temp: { [key: string]: any } = {};
               temp['name'] = row
               let total = 0
               segments?.map(
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
  channels?.map(row => columns1.push({id:row.name , numeric: true, label:(locale==="fr")?row.name_fr:row.name }))
  columns1.push({id:'total' , numeric: true, label:'TOTAL'})
  
  const rows1 = brands.map(row =>{
               let temp: { [key: string]: any } = {};
               temp['name'] = row
               let total = 0
               channels?.map(
                 s => {
                   let qty = getValueByBrand(m2Data,row,selectedPeriod,`channel_${s.id}`)
                   temp[s.name]= qty
                   total = total + qty
                    })
               temp['total'] = total
               return temp
              })
    
    
    const choice1 = marketResearchChoices?.some((choice => choice.study === 2 && choice.choice === true))
    const choice2 = marketResearchChoices?.some((choice => choice.study === 3 && choice.choice === true))

    
    // if(!choice1 && !choice2){
    //   router.push(paths.analyze.marketResearch.$url());
    // }
    
    return ( <>
    
    <Title pageTitle={t("COMPETITIVE_ADVERSTISING_AND_COMMERCIAL_TEAM_ESTIMATES")} period={selectedPeriod} />      

    <div className="">
    <div className="container mx-auto">
      {choice1 && <>
      
        <HeaderContainer  title={t("COMPETITIVE_ADVERTISING_ESTIMATES")} period={selectedPeriod} content={t("ESTIMATES_OF_COMPETITIVE_ADVERTISING_BUDGETS_ARE_GIVEN_BY_FIRM_BY")} />



      {/* <div className="p-1">
        <span className="g-subtitle text-xl text-blue-700"> {t("RESOURCE_ALLOCATION_OVERVIEW")} </span>
        <span className="g-comment">
          <p>{t("THE_THREE_CHART_BELOW_SHOWS_HOW_RESOURCES_HAVE_BEEN_ALLOCATED_ACR")}</p>
        </span>
      </div> */}


        <div className="grid grid-cols-2 gap-4 h-80 p-4">
          <GraphContainer>

            <HorizontalBar data={chart1Data} rounded1={true} title={t("ESTIMATE_TOTAL_EXPENDITURE_(IN_MILLION_$)_-_BY_FIRM")} stacked={true} inThousand={true}/>
    
          </GraphContainer>
          <GraphContainer>

          <HorizontalBar data={chart2Data} rounded1={true} title={t("ESTIMATE_TOTAL_EXPENDITURE_(IN_MILLION_$)_-_BY_SEGMENT")} stacked={true} inThousand={true}/>
  
          </GraphContainer>
        </div>

          <div className="col p-8">

          <TableSimple columns={columns} rows={rows}/>
          
      </div></>}

      {choice2 && <><div className="mt-6">

      <HeaderContainer  title={t("ESTIMATED_COMMERCIAL_TEAM_SIZE_ESTIMATES")} period={selectedPeriod} content={t("ESTIMATES_OF_COMPETITIVE_COMMERCIAL_TEAM_SIZE_ARE_GIVEN_BY_FIRM_B")} />


      </div>



        <div className="grid grid-cols-2 gap-4 h-80 p-4">
          <GraphContainer>

          <HorizontalBar data={chart3Data} stacked={true} title= {t("ESTIMATED_COMMERCIAL_TEAM_SIZE_(IN_FULL-TIME_EQUIVALENT)_-_BY_FIRM")} />

          </GraphContainer>
          <GraphContainer>

          <HorizontalBar data={chart4Data} stacked={true} title={t("ESTIMATED_COMMERCIAL_TEAM_SIZE_(IN_FULL-TIME_EQUIVALENT)_-_BY_SEGMENT")} />

          </GraphContainer>
        </div>


          <div className="col p-8">

          <TableSimple columns={columns1} rows={rows1}/>

      </div>
      </>}

     </div>
    </div>
    </> );
}

export default CompetitiveAds;

