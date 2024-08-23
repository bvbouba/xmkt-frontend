
import {
  financialItems1,
  financialItems2,
  firmFinancialItems,
  unit,
} from "@/lib/constants";
import { getFirmData } from "features/analyzeSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {  formatPrice, getValueByTeam } from "@/lib/utils";
import {  useEffect } from "react";
import { useRouter } from "next/router";
import { fetchMarketResearchChoices } from "features/decideSlices";
import usePaths from "@/lib/paths";
import { Loading } from "@/components/Loading";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { categoryColors,  functionColors } from "@/lib/constants/colors";
import { useAuth } from "@/lib/providers/AuthProvider";
import GroupedBar from "@/components/charts/GroupedBar";


interface props {
        bold: boolean,
        label: string,
        [key: string]: any;

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

function IndustryBenchmarking({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common')

  const router = useRouter()

  const { period } = router.query as { period: string};
    const selectedPeriod = parseInt(period)
  const {participant} = useAuth()
    const { industryID, firmID } =participant || {};


  const paths = usePaths()
  useEffect(()=>{
    if (firmID && industryID ) {
    dispatch(fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: selectedPeriod }));
    }
  },[dispatch,firmID,industryID,selectedPeriod])

  const { data: marketResearchChoices } = useAppSelector((state) => state.decide.marketResearchChoices);

  


  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (firmID && industryID) {
      dispatch(getFirmData({ industryID, firmID: 0 }));
    }
  }, [dispatch,industryID]);

  const {data:firmsData,loading} = useAppSelector((state) => state.analyze.firm);

  const labels = firmsData
  .filter((row) => row.period_id === selectedPeriod)
  .map((row) => row.team_name) 
  const financialChartData1 = {
    labels,
    datasets: financialItems1.map((row, id) => ({
      label: (locale==="fr")?row.translate:row.label,
      backgroundColor: categoryColors[id],
      borderColor: categoryColors[id],
      data: firmsData
        .filter((row1) => row1.period_id === selectedPeriod)
        .map((row2) =>
          {
            const value  = getValueByTeam(firmsData, row2.team_name, selectedPeriod, row.id)
            if (typeof value === 'number') {
                return Math.round(value/unit)
            }
            return value
        }
        ),
    })),
  };

  const financialChartData2 = {
    labels,
    datasets: financialItems2.map((row, id) => ({
      label: (locale==="fr")?row.translate:row.label,
      backgroundColor: functionColors[id],
      borderColor: functionColors[id],
      data: firmsData
        .filter((row1) => row1.period_id === selectedPeriod)
        .map((row2) => {
          let total =
            getValueByTeam(firmsData, row2.team_name, selectedPeriod, "ads_expenses") +
            getValueByTeam(firmsData, row2.team_name, selectedPeriod, "comm_costs") +
            getValueByTeam(firmsData, row2.team_name, selectedPeriod, "marketr_costs") +
            getValueByTeam(firmsData, row2.team_name, selectedPeriod, "research_d") +
            getValueByTeam(firmsData, row2.team_name, selectedPeriod, "cogs");
          if (row.id === "marcom") {
            return (
              (getValueByTeam(
                firmsData,
                row2.team_name,
                selectedPeriod,
                "ads_expenses"
              ) +
                getValueByTeam(
                  firmsData,
                  row2.team_name,
                  selectedPeriod,
                  "comm_costs"
                ) +
                getValueByTeam(
                  firmsData,
                  row2.team_name,
                  selectedPeriod,
                  "marketr_costs"
                )) /
              total
            );
          } else {
            return (
              getValueByTeam(firmsData, row2.team_name, selectedPeriod, row.id) / total
            );
          }
        }),
    })),
  };
     const selectedFirmsData = firmFinancialItems.map((row,id) =>{
                  let temp:props = {
                        bold: false,
                        label: '', 
                       
                  }
                  temp['bold'] = row.bold
                  temp['label'] = (locale==="fr")?row.translate:row.label,
                  firmsData.filter(row1 => row1.period_id === selectedPeriod).map(
                    row2 => temp[row2.team_name]=getValueByTeam(firmsData,row2.team_name,selectedPeriod,row.id)*row.sign)
                    return temp
                  })
   const title = t("OVERALL_COMPANY_PERFORMANCES_AND_EXPENDITURES_-_PERIOD",{selectedPeriod})
  //  if(marketResearchChoices.some(choice => choice.study === 1 && choice.choice === false)){
  //   router.push(paths.analyze.marketResearch.$url());
  // }
  

                  
                  return (
    <>
      
      <div className="">
      <div className="container mx-auto">
      <HeaderContainer title={title}/>

      <div className="p-1">
        <ParagraphContainer title={t("OVERALL_COMPANY_PERFORMANCES_AND_EXPENDITURES")} content={t("THE_TWO_CHARTS_BELOW_SHOW_THE_OVERALL_PERFORMANCE_OF_THE_COMPETIN")} />
    
        <div className="grid grid-cols-2 gap-4 m-4 h-80">
          <GraphContainer>
          {loading ? <Loading />:  
           <GroupedBar data={financialChartData1} title="" />
                  }
          </GraphContainer>
          <GraphContainer>
          {loading ? <Loading />:  
          <GroupedBar data={financialChartData2} title="" stacked={true} inPercent={true} />
                }
          </GraphContainer>
        </div>
      </div>

      <div className="p-1">
        <ParagraphContainer title={t("COMPANY_PROFIT_&_LOSS_STATEMENTS")} content={t("THE_TABLE_BELOW_PROVIDES_AN_ESTIMATED_P&L_STATEMENT_OF_THE_COMPET")} />
  
        <div className="flex items-center">
          <div className="w-full">
          <div className="p-4">
          {loading ? <Loading />:  
      <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th></th>
            {labels.map((label) => (
              <th key={label} scope="col" className="px-2 py-1" align="center">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedFirmsData.map((entry, index) => (
            <tr key={index} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${entry.bold ? 'font-bold' : ''}`}>
              <td className={`px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white`}>{entry.label}</td>
              {labels.map((label) => (
                <td key={label} className="px-2 py-1" align="center" >
                  {formatPrice(entry[label])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      }
    </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default IndustryBenchmarking;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


// IndustryBenchmarking.getLayout = function getLayout(page: ReactElement) {
//   return <Layout>{page}</Layout>;
// };