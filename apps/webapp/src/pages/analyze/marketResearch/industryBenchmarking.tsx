
import {
  financialItems1,
  financialItems2,
  firmFinancialItems,
  unit,
} from "@/lib/constants";
import {  formatPrice, getValueByTeam } from "@/lib/utils";
import {  useEffect, useState } from "react";

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GraphContainer, HeaderContainer, ParagraphContainer } from "@/components/container";
import { categoryColors,  colors,  functionColors } from "@/lib/constants/colors";
import GroupedBar from "@/components/charts/GroupedBar";
import { useSession } from "next-auth/react";
import { firmProps } from "types";
import {  getFirmData } from "features/data";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";


interface props {
        bold: boolean,
        label: string,
        [key: string]: any;

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

function IndustryBenchmarking({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();  // Get session data
  const { industryID, firmID } = session || {};    // Extract from session
  const selectedPeriod = session?.selectedPeriod || 0;  // Extract selectedPeriod from session or default to 0

  const [firmsData, setFirmsData] = useState<firmProps[]>([]);  // Use state for firms data
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation('common');


  useEffect(() => {
    if (status === 'authenticated' && industryID) {
      const loadData = async () => {
        setLoading(true);
        try {
     
          // Fetch Firm Data
          const response2 = await getFirmData({
            industryID,
            firmID: 0,  // Replace firmID if needed
            token: session.accessToken,
          });
          setFirmsData(response2);

        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [status,industryID,session?.accessToken]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  const labels = firmsData
  .filter((row) => row.period_id === selectedPeriod)
  .map((row) => row.team_name) 
  const financialChartData1 = {
    labels,
    datasets: financialItems1.map((row, id) => ({
      label: (locale==="fr")?row.translate:row.label,
      backgroundColor: colors[id],
      borderColor: "white",
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
      backgroundColor: colors[id],
      borderColor: "white",
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
  //  if(marketResearchChoices.some(choice => choice.study === 1 && choice.choice === false)){
  //   router.push(paths.analyze.marketResearch.$url());
  // }
  

                  
                  return (
    <>
          <Title pageTitle={t("INDUSTRY_BENCHMARKING")} period={selectedPeriod} />      

      <div className="">
      <div className="container mx-auto">
      <HeaderContainer title={t("INDUSTRY_BENCHMARKING")} period={selectedPeriod}/>

      <div className="p-1">
        <ParagraphContainer title={t("OVERALL_COMPANY_PERFORMANCES_AND_EXPENDITURES")} content={t("THE_TWO_CHARTS_BELOW_SHOW_THE_OVERALL_PERFORMANCE_OF_THE_COMPETIN")} />
    
        <div className="grid grid-cols-2 gap-4 m-4 h-80">
          <GraphContainer>

           <GroupedBar data={financialChartData1} title="" legendPos="top"/>
                  
          </GraphContainer>
          <GraphContainer>

          <GroupedBar data={financialChartData2} title="" stacked={true} inPercent={true} legendPos="top"/>
                
          </GraphContainer>
        </div>
      </div>

      <div className="p-1">
        <ParagraphContainer title={t("COMPANY_PROFIT_&_LOSS_STATEMENTS")} content={t("THE_TABLE_BELOW_PROVIDES_AN_ESTIMATED_P&L_STATEMENT_OF_THE_COMPET")} />
  
        <div className="flex items-center">
          <div className="w-full">
          <div className="p-4">

      <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="bg-white"></th>
            {labels.map((label) => (
              <th key={label} scope="col" className="px-2 py-1 border" align="center">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedFirmsData.map((entry, index) => (
            <tr key={index} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${entry.bold ? 'font-bold' : ''}`}>
              <td className={`px-2 py-1 border font-medium text-gray-900 whitespace-nowrap dark:text-white`}>{entry.label}</td>
              {labels.map((label) => (
                <td key={label} className="px-2 py-1 border" align="center" >
                  {formatPrice(entry[label])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
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

