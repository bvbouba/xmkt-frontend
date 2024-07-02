import { RedirectToLogin } from "@/components/RedirectToLogin";
import { ButtonNext, ButtonPrev } from "@/components/button";
import {  useForm } from "react-hook-form";
import { FormData } from ".";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useEffect } from "react";
import { getFeaturesData } from "features/analyzeSlices";
import { fetchDecisionStatus } from "features/decideSlices";
import { useTranslation } from "next-i18next";

type props = {
    onNext: (data: FormData) => void;
    onPrevious: () => void;
    formData?: Partial<FormData>;
    locale?:string
  };

  export const Characteristics: React.FC<props> = ({ onNext,onPrevious,formData,locale}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm<FormData>();
      const dispatch = useAppDispatch();
    const selectedChoice = watch("choice");
    const participant = useAppSelector((state) => state.participant);
    const { industryID} = participant;
    const { t } = useTranslation('common')
    
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
          }, [dispatch]);
        
    
          const {data:features} = useAppSelector((state) => state.analyze.features);
          const selectedFeatures = features.filter(feature=>['feature_1','feature_2',
          'feature_3','feature_4','feature_5'].includes(feature.surname))

          if(isDecisionInProgress) return<> {t("DECISION_IS_IN_PROGRESS")}</>
    return (
        <>
        
        <form onSubmit={handleSubmit(onNext)} className="">
    

        <div className="">
        <h2 className="g-subtitle text-xl text-blue-700">({t("PROJECT_DESIRED_CHARACTERISTICS")})</h2>
      </div>


      <div>
        <div>
        <div className="grid grid-cols-5 gap-4 p-4">
                {selectedFeatures.map(entry =><div key={entry.id} className="flex flex-col">
               <span> {(locale==="fr") ? entry.name_fr : entry.name}</span>
               <span><small>{`(${entry.range_inf} to ${entry.range_sup})`}</small></span>
                </div> )}           
         </div>
          <div className="grid grid-cols-5 gap-4">
           <div className="">
            <input
              {...register("feature_1",{
                required:true,
                max:{value:features[0]?.range_sup,message: t("Value must be smaller", {range_sup:features[0]?.range_sup})},
                min:{value:features[0]?.range_inf,message: t("Value must be greater", {range_inf:features[0]?.range_inf})},
              })}
              defaultValue={formData?.feature_1}
              id="feature_1"
              type="number"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.feature_1 && (
              <p className="text-sm text-red-500 pt-2">
                {errors.feature_1?.message}
              </p>
            )}
            </div>

            <div className="">
            <input
              {...register("feature_2",{
                required:true,
                max:{value:features[1]?.range_sup,message: t("Value must be smaller", {range_sup:features[1]?.range_sup})},
                min:{value:features[1]?.range_inf,message: t("Value must be greater", {range_inf:features[1]?.range_inf})},
              })}
              defaultValue={formData?.feature_2}
              id="feature_2"
              type="number"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.feature_2 && (
              <p className="text-sm text-red-500 pt-2">
                {errors.feature_2?.message}
              </p>
            )}
            </div>

            <div className="">
            <input
              {...register("feature_3",{
                required:true,
                max:{value:features[2]?.range_sup,message: t("Value must be smaller", {range_sup:features[2]?.range_sup})},
                min:{value:features[2]?.range_inf,message: t("Value must be greater", {range_inf:features[2]?.range_inf})},
              })}
              defaultValue={formData?.feature_3}
              id="feature_3"
              type="number"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.feature_3 && (
              <p className="text-sm text-red-500 pt-2">
                {errors.feature_3?.message}
              </p>
            )}
            </div>

            <div className="">
            <input
              {...register("feature_4",{
                required:true,
                max:{value:features[3]?.range_sup,message: t("Value must be smaller", {range_sup:features[3]?.range_sup})},
                min:{value:features[3]?.range_inf,message: t("Value must be greater", {range_inf:features[3]?.range_inf})},
              })}
              defaultValue={formData?.feature_4}
              id="feature_4"
              type="number"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.feature_4 && (
              <p className="text-sm text-red-500 pt-2">
                {errors.feature_4?.message}
              </p>
            )}
            </div>

            <div className="">
            <input
              {...register("feature_5",{
                required:true,
                max:{value:features[4]?.range_sup,message:  t("Value must be smaller", {range_sup:features[4]?.range_sup})},
                min:{value:features[4]?.range_inf,message: t("Value must be greater", {range_inf:features[4]?.range_inf})},
              })}
              defaultValue={formData?.feature_5}
              id="feature_5"
              type="number"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.feature_5 && (
              <p className="text-sm text-red-500 pt-2">
                {errors.feature_5?.message}
              </p>
            )}
            </div>
           
          </div>
           

          
          <div className="row align-items-start pt-10">
          <div className="">
           <h2 className="g-subtitle text-xl text-blue-700">{t("PROJECT_DESIRED_BASE_COST")}</h2>
          </div>

          </div>
          <div className="row align-items-start p-4">
          <label>
            <input
              type="radio"
              value="1"
              defaultChecked={formData?.choice === "1"}
              {...register("choice", { required: true })}
            /> {t("DEVELOP_THIS_PROJECT_AT_THE_LOWEST_POSSIBLE_COST")}
          </label>
          </div>

          <div className="row align-items-start p-4">
          <input
              type="radio"
              value="2"
              defaultChecked={formData?.choice === "2"}
              {...register("choice", { required: true })}
            /> {t("SPECIFY_THE_BASE_COST_FOR_THIS_PROJECT")}
          </div> 
        </div>
      </div>

      {(selectedChoice === "2") && (
        <div className="p-4 inline-flex">
          <label htmlFor="baseCost" className="text-xs">{t("DESIRED_BASE_COST_IN_$")}:</label>
          <input
            type="number"
            id="baseCost"
            defaultValue={formData?.baseCost}
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            {...register("baseCost", { required: true })}
          />
        </div>
      )}

           
        <div className="grid grid-cols-2 pt-4 gap-4">
          <div>
              <ButtonPrev type="button" onClick={onPrevious}>
                {t("PREVIOUS")}
              </ButtonPrev>
          </div>
          <div className="flex justify-end">
              <ButtonNext
                type="submit"
              >
                {t("NEXT")}
              </ButtonNext>

          </div>
        </div>
            </form>
            </>
    );
}

export default Characteristics;