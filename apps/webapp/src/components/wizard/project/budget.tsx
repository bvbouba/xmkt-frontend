import {  ButtonPrev } from "@/components/button";
import {  SubmitHandler, useForm } from "react-hook-form";
import { FormData } from ".";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useEffect } from "react";
import { getFeaturesData, getOnlineQueryInfoData } from "features/analyzeSlices";
import { checkCostReduction, createProject, fetchBudgetDetails, fetchDecisionStatus, fetchNumberOfQueries, runOnlineQueries } from "features/decideSlices";
import { useRouter } from "next/router";
import usePaths from "@/lib/paths";
import { useTranslation } from "next-i18next";
import { uppercase } from "@/lib/utils";
import { useAuth } from "@/lib/providers/AuthProvider";


type props = {
    onPrevious: () => void;
    formData?: Partial<FormData>;
    locale?:string
  };
  
  export const Budget: React.FC<props> = ({ onPrevious,formData,locale }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>();
      const dispatch = useAppDispatch();
      const router = useRouter()
      const paths = usePaths()
      const {participant,setRefresh} = useAuth()
      const { industryID, firmID,activePeriod } = participant || {};
      const {market_id} = router.query
      const marketID = typeof market_id === 'string' ? parseInt(market_id, 10) : null;
      const { t } = useTranslation('common')
      
    //  useEffect(()=>{
    //   if(formData?.feature_1 && formData?.feature_2 && formData?.feature_3 && formData?.feature_4 && formData?.feature_5){
    //   const projectData = {
    //     feature_1: formData?.feature_1.toString(),
    //     feature_2: formData?.feature_2.toString(),
    //     feature_3:formData?.feature_3.toString(),
    //     feature_4: formData?.feature_4.toString(),
    //     feature_5: formData?.feature_5.toString(),
    //   };
    //   dispatch(checkCostReduction(projectData));
    // }
    //  },[formData])
     
    //  const {data:costReduction} = useAppSelector((state) => state.decide.costReduction);

      
      useEffect(() => {
        if(industryID){
        dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
        }
      }, [dispatch,industryID]);
      
      const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
      const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
      
      
        useEffect(() => {
            // Dispatch actions to get firm and brand data when the component mounts
              dispatch(getFeaturesData());
              if(firmID && industryID && activePeriod && marketID){
              dispatch(fetchNumberOfQueries({firmID,industryID,period:activePeriod,marketID}))
              }
          }, [dispatch,marketID,firmID,industryID,activePeriod]);

         
        
          const {data:features} = useAppSelector((state) => state.analyze.features);
          const selectedFeatures = features.filter(feature=>['feature_1','feature_2',
          'feature_3','feature_4','feature_5'].includes(feature.surname))

          const {data:count,loading} = useAppSelector((state) => state.decide.queryCount);
          const {data:result,loading:rloading,success:rsuccess} = useAppSelector((state) => state.decide.queryResult);
          

          const runQueries=()=>{
            if(firmID && industryID && activePeriod && marketID && formData?.choice && formData.feature_1
                && formData.feature_2 && formData.feature_3 && formData.feature_4 && formData.feature_5
                ){
                const choice = parseInt(formData?.choice)
                dispatch(runOnlineQueries({
                    industryID,
                    firmID,
                    period:activePeriod,
                    marketID,
                    choice,
                    feature1:formData?.feature_1,
                    feature2:formData?.feature_2,
                    feature3:formData?.feature_3,
                    feature4:formData?.feature_4,
                    feature5:formData?.feature_5,
                    baseCost:formData?.baseCost
                }))
            }
          }
     
          const onSubmit: SubmitHandler<FormData> = (data) => {
            // Handle final form submission
            const d = { ...formData, ...data };
            if(industryID && firmID && activePeriod && marketID){
            dispatch(createProject({
                name:uppercase(d.name),
                objective:d.objective,
                industryID,
                firmID,
                period: activePeriod,
                marketID,
                choice: d.choice,
                feature1: d.feature_1,
                feature2: d.feature_2,
                feature3:  d.feature_3,
                feature4:  d.feature_4,
                feature5:  d.feature_5,
                baseCost:d.baseCost,
                allocatedBudget:d.budget
            })).then(() => {
              // After successful submission, trigger a refresh
              setRefresh((prevKey) => prevKey + 1);
            });;
           }
     
          };

          if (rsuccess){
          router.push(paths.decide.researchAndDevelopment.$url()); 
          }
          const queryDisabled = (count > 5)

          if(isDecisionInProgress) return<> Decision is in Progress</>
    return (
        <>
        
        <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
        <h2 className="g-subtitle text-xl text-blue-700">{t("PROJECT_DESIRED_CHARACTERISTICS_&_BASE_COST")}</h2>
      </div>

        {/* Render project desired characteristics */}
        <div className="grid grid-cols-5 gap-4 p-4">
                {selectedFeatures.map(entry =><div key={entry.id} className="flex flex-col">
               <span> {(locale==="fr")?entry.name_fr:entry.name}</span>
               <span><small>{`(${entry.range_inf} to ${entry.range_sup})`}</small></span>
                </div> )}           
         </div>
          <div className="grid grid-cols-5 gap-4">
           <div className="">
            <input
              defaultValue={formData?.feature_1}
              id="feature_1"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={formData?.feature_2}
              id="feature_2"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={formData?.feature_3}
              id="feature_3"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={formData?.feature_4}
              id="feature_4"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={formData?.feature_5}
              id="feature_5"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>
           
          </div>

        {/* Render base cost */}
        <div className="row align-items-start pt-2">
          <div className="max-w-xs">
            {t("BASE_COST_($)")}<br />
            {formData?.choice === '1' ? (
              <input className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" type="text" value={t("LOWEST_POSSIBLE")} disabled />
            ) : (
              <input className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" type="text" value={formData?.baseCost} disabled />
            )}
          </div>
        </div>

        {/* Optional: Run an estimate */}
        <div className="pt-10">
          <h2 className="g-subtitle text-xl text-blue-700">{t("RUN_AN_ESTIMATE_TO_COLLECT_ADDITIONAL_INFORMATION_ABOUT_THIS_PROJ")}</h2>
        </div>
        <div className="grid grid-cols-6 gap-4 max-w-lg ">
          <div className="col-span-4">
            {t("TOTAL_NUMBER_OF_QUERIES_ALLOWED_THIS_PERIOD")}
          </div>
          <div className="">
            <input  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" type="text" defaultValue={5} disabled />
          </div>
          <div className=""></div>
          <div className="col-span-4">
            {t("NUMBER_OF_QUERIES_ALREADY_RUN")}
          </div>
          <div className="">
            <input  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" type="text" value={count || ""} disabled />
          </div>
          <div className="">
            <button type="button" 
            className={`text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none ${(queryDisabled) ? "cursor-not-allowed" : ""} focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600`}
            onClick={()=>runQueries()} disabled={queryDisabled}>{t("RUN")}</button>
          </div>
          <div className="col-span-4">
            <label>{t("ESTIMATED_MINIMUM_BASE_COST")}</label>
          </div>
          <div className="">
            <input name="budget-min_cost" 
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            type="text" value={result?.minCost || ""} disabled />
          </div>
          <div className=""></div>
          <div className="col-span-4">
            <label>{t("BUDGET_REQUIRED_FOR_COMPLETION")}</label>
          </div>
          <div className="col-2">
            <input name="budget-required_budget" 
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            type="text" value={result?.projectCost || ""} disabled />
          </div>
          <div className="col-6"></div>
        
        </div>


     

        {/* Allocate budget */}
        <div className="pt-5">
          <h2 className="g-subtitle text-xl text-blue-700">{t("ALLOCATE_A_BUDGET_FOR_THIS_PROJECT")}</h2>
        </div>
        <div className="grid grid-cols-6 gap-4 max-w-lg pt-4 pb-4">
          <div className="col-span-4">
           {t("BUDGET_ALLOCATED_THIS_PERIOD_(K_$)")}
          </div>
          <div className="">
          <input
              {...register("budget",{
                required:true,
                min:{value:0, message:"it must be 0 or greater"},
              })}
              defaultValue={formData?.budget}
              id="budget"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.budget && (
              <p className="text-sm text-red-500 pt-2">
                {errors.budget?.message}
              </p>
            )}
          </div>
          <div className=""></div>
        </div>
           
        <div className="grid grid-cols-2 gap-4">
          <div>
              <ButtonPrev type="button" onClick={onPrevious}>
                {t("PREVIOUS")}
              </ButtonPrev>
          </div>
          <div className="flex justify-end">
          <button
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600"
                type="submit"
              >
                {rloading ? t("...SUBMITTING") : t("SUBMIT")}
              </button>

          </div>
        </div>
            </form>
            </>
     );
}

export default Budget;