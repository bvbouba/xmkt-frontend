import {  ButtonPrev } from "@/components/button";
import {  SubmitHandler, useForm } from "react-hook-form";
import { FormData } from ".";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { uppercase } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { featureProps, projectCostEstimateProps } from "types";
import { createProject, fetchNumberOfQueries, getFeaturesData, runOnlineQueries } from "features/data";
import usePaths from "@/lib/paths";


type props = {
    onPrevious: () => void;
    formData?: Partial<FormData>;
    locale?:string
  };
  
  export const Budget: React.FC<props> = ({ onPrevious,formData,locale }) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { market_id } = router.query;
  const marketID = typeof market_id === 'string' ? parseInt(market_id, 10) : null;
  const { t } = useTranslation('common');
  const paths = usePaths()
  
  const { industryID, firmID, activePeriod } = session || {}; // Adjust as per your session object
  const [features, setFeatures] = useState<featureProps[]>([]);
  const [queryCount, setQueryCount] = useState<{count:number}>();
  const [queryResult, setQueryResult] = useState<projectCostEstimateProps>(); // Adjust the type as per the result
  const [loading, setLoading] = useState<boolean>(false);

  const selectedFeatures = features.filter(feature => ['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5'].includes(feature.surname));

  const fetchData = async () => {
    if (status === "authenticated") {
      try {
        setLoading(true);
        const featuresData = await getFeaturesData();
        setFeatures(featuresData);
        if (firmID && industryID && activePeriod && marketID) {
          const countData = await fetchNumberOfQueries({ firmID, industryID, period: activePeriod, marketID,token:session.accessToken });
          setQueryCount(countData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, firmID, industryID, activePeriod, marketID]);

  const runQueries = async () => {
    if (status === "authenticated" && firmID && industryID && activePeriod && marketID && formData?.choice && formData.feature_1
      && formData.feature_2 && formData.feature_3 && formData.feature_4 && formData.feature_5) {
      try {
        const choice = parseInt(formData?.choice);
        const response = await runOnlineQueries({
          industryID,
          firmID,
          period: activePeriod,
          marketID,
          choice,
          feature1: formData?.feature_1,
          feature2: formData?.feature_2,
          feature3: formData?.feature_3,
          feature4: formData?.feature_4,
          feature5: formData?.feature_5,
          baseCost: formData?.baseCost,
          token:session.accessToken
        });
        setQueryResult(response)
      } catch (error) {
        console.error('Error running queries:', error);
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const d = { ...formData, ...data };
    if (status === "authenticated" && industryID && firmID && activePeriod && marketID) {
      try {
        await createProject({
          name: uppercase(d.name),
          objective: d.objective,
          industryID,
          firmID,
          period: activePeriod,
          marketID,
          choice: d.choice,
          feature1: d.feature_1,
          feature2: d.feature_2,
          feature3: d.feature_3,
          feature4: d.feature_4,
          feature5: d.feature_5,
          baseCost: d.baseCost,
          allocatedBudget: d.budget,
          token:session.accessToken
        });
        router.push(paths.decide.researchAndDevelopment.$url()) 
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  const queryDisabled = (queryCount?.count || 0 )> 5;

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
            <input  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" type="text" value={queryCount?.count || 0} disabled />
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
            type="text" value={queryResult?.minCost || ""} disabled />
          </div>
          <div className=""></div>
          <div className="col-span-4">
            <label>{t("BUDGET_REQUIRED_FOR_COMPLETION")}</label>
          </div>
          <div className="col-2">
            <input name="budget-required_budget" 
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            type="text" value={queryResult?.projectCost || ""} disabled />
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
                {loading ? t("...SUBMITTING") : t("SUBMIT")}
              </button>

          </div>
        </div>
            </form>
            </>
     );
}

export default Budget;