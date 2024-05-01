import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { SuccessMessage } from "@/components/ToastMessages";
import { getMarketsData } from "features/analyzeSlices";
import { fetchBudgetDetails, fetchDecisionStatus, fetchMarketResearchChoices, resetState, updateMarketResearchChoice } from "features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { formatPrice } from "@/lib/utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

const checkChoice = (choice: boolean | any[]): boolean => {
    if (typeof choice === 'boolean') {
        if(choice === false){
      return false;
        } else {
            return true
        }
    } else if (Array.isArray(choice)){
        if ( choice.length === 0){
            return false;
        } else {
            return true
        }
    }
    return true
  };

function MarketResearchStudies({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm();
    const paths = usePaths();
    const dispatch = useAppDispatch();
    const {participant,setRefresh} = useAuth()
    const { industryID, firmID, activePeriod,teamID } = participant || {};
    const { t } = useTranslation('common')
    
    useEffect(() => {
      if(industryID){
      dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
      }
    }, [dispatch,industryID]);
    
    const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
    const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
    
    
    useEffect(() => {
      if (firmID && industryID && activePeriod) {
        dispatch(fetchMarketResearchChoices({ industry:industryID, firm:firmID, period: activePeriod }));
        dispatch(getMarketsData());
      }
    }, [dispatch, firmID, industryID, activePeriod]);
  
    const { data: marketResearchChoices } = useAppSelector((state) => state.decide.marketResearchChoices);
    const { data: markets } = useAppSelector((state) => state.analyze.markets);
    const { success: msuccess,loading:mloading } = useAppSelector((state) => state.decide.marketResearchChoice);
    
    useEffect(()=>{
        marketResearchChoices.map(m=>{setValue(`${m.id}`,m.choice)})
    },[marketResearchChoices])

    
    const benchmark =  marketResearchChoices.find(m => m.study == 1)
    
    const onSubmit = (data: any) => {
        // Handle form submission
        marketResearchChoices.map(entry =>{
            const choice = checkChoice(data[entry.id])
          dispatch(updateMarketResearchChoice({id:entry.id,choice})).then(() => {
            // After successful submission, trigger a refresh
            setRefresh((prevKey) => prevKey + 1);
          });
        })
      };

      // if(isDecisionInProgress) return<> Decision is in Progress</>

    return ( 
        <>
            
       {msuccess && <SuccessMessage message={t("UPDATED_SUCCESSFULLY")} />}
            <div className="container mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">{t("MARKET_RESEARCH_DECISIONS")}</h1>
      <p className="mb-4">
        {t("INDICATE_BELOW_WHICH_MARKET_RESEARCH_STUDIES_YOU_WANT_TO_PURCHASE")}
       {t("_GENERAL_STUDIES_APPLY_TO_ALL_MARKETS_WHILE_MARKET_SPECIFIC_ONES_")}
      </p>

      <form id="mrs" onSubmit={handleSubmit(onSubmit)}>

        {/* General Studies */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">{t("GENERAL_STUDIES")}</h2>
          {/* General studies checkboxes here */}
           <div className="row align-items-start">
            <input
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              {...register(`${benchmark?.id}`, { required: false })}
            /> 
            <label
            className="ms-2"
            >
            {(locale==="fr")?benchmark?.research_name_fr:benchmark?.research_name} : ${formatPrice(benchmark?.cost)}
          </label>
          </div>

      
        </div>

        {/* Market Specific Studies */}
        <div className="grid grid-cols-2 gap-4">
        {markets.map(m=>{
        const selectedStudies = marketResearchChoices.filter(c=> c.study!==1 && c.market === m.id)
        return(<div className="mb-8" key={m.id}>
          <h2 className="text-lg font-bold mb-2">{selectedStudies.length !==0 && m.name}</h2>
          <div className="grid grid-cols-1">
           {selectedStudies.map(entry =>
            
            <div key={entry.id} className="grid grid-cols-2 gap-4 mb-2">
            <div><input
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              {...register(`${entry?.id}`, { required: false })}
            /> 
            <label
            className="ms-2"
            >
            {(locale==="fr")?entry?.research_name_fr:entry.research_name}  
          </label>
          </div>
          <div>
          ${formatPrice(entry.cost)}
          </div>
          </div>

            )}

          </div>
        </div>)})}
        </div>


        <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <button
                  className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600"
                  type="submit"
                >
                  {mloading ? t("...SAVING") : t("SAVE")}
                </button>
              </div>
              <div>
                <Link href={paths.decide.$url()}>
                <button className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                 {t("DECISION_HOME")}
                </button>
              </Link>
            </div>

            
          </div>
      </form>

     
    </div>
        </>
     );
}

export default MarketResearchStudies;

MarketResearchStudies.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  