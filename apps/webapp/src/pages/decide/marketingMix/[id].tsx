import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { SuccessMessage } from "@/components/ToastMessages";
import { fetchDimensions, getFeaturesData, getSegmentsData } from "@/lib/features/analyzeSlices";
import {
  fetchBudgetDetails,
  fetchDecisionStatus,
  fetchMarketingMixById,
  partialUpdateMarketingMix,
} from "@/lib/features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  brand_name: string;
  production: number;
  price: number;
  advertising: number;
  ads_research: number;
  ads_share_1: number;
  ads_share_2: number;
  ads_share_3: number;
  ads_share_4: number;
  ads_share_5: number;
  total: number;
  perceptual_obj: string;
  dimension_1: string;
  objective_1: string;
  dimension_2: string;
  objective_2: string;
  channel_1: number;
  channel_2: number;
  channel_3: number;
}

// For objective_1_values
const objective1Values = () => {
  const choices = [{ value: "", label: "-----" }];
  let j = 1.0;
  while (j < 7) {
    const a = j.toFixed(1);
    choices.push({ value: a, label: a });
    j += 0.1;
  }
  return choices;
};

// For objective_2_values
const objective2Values = () => {
  const choices = [{ value: "", label: "-----" }];
  let j = -20;
  while (j < 20) {
    const a = j.toString();
    choices.push({ value: a, label: a });
    j += 1;
  }
  return choices;
};

const choicesObjective1 = objective1Values().map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ));
const choicesObjective2 = objective2Values().map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ));

export const getStaticProps: GetStaticProps = async (context) => {
                              const locale = context.locale || context.defaultLocale || 'en';
                              return {
                                props: {
                                  ...(await serverSideTranslations(locale, ['common'])),
                                  locale,
                                },
                              };
                            };                       
function DetailPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>();
  const router = useRouter();
  const { id } = router.query;
  const ID = typeof id === "string" ? parseInt(id, 10) : null;
  const paths = usePaths();
  const {participant,setRefresh} = useAuth()
  const dispatch = useAppDispatch();
  const { industryID, activePeriod, teamID } = participant || {};
  // Watch for changes in ads_share_* inputs
  const selectedChoice: string = (watch("perceptual_obj") || "").toString();
  const dimension1 = watch("dimension_1")
  const objective1 = watch("objective_1")
  const dimension2 = watch("dimension_2")
  const watchAdsShares = watch([
    "ads_share_1",
    "ads_share_2",
    "ads_share_3",
    "ads_share_4",
    "ads_share_5",
  ]);
  const total = watchAdsShares.reduce((acc, value) => acc + Number(value), 0);
  const { t } = useTranslation('common')
  
  useEffect(() => {
    if(industryID){
    dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
    }
  }, [dispatch,industryID]);
  
  const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
  const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 1);
  
  useEffect(() => {
    // Dispatch actions to get firm and brand data when the component mounts
    if (ID) {
      dispatch(fetchMarketingMixById({ id: ID }));
    }
    dispatch(getFeaturesData());
    dispatch(fetchDimensions());
    dispatch(getSegmentsData());
  }, [dispatch, ID]);

  const { data: brand } = useAppSelector(
    (state) => state.decide.marketingMixById
  );

  const { data: features } = useAppSelector(
    (state) => state.analyze.features
  );

  const { data: dimensions } = useAppSelector(
    (state) => state.analyze.dimensions
  );

  const { data: segments } = useAppSelector((state) => state.analyze.segments);
  useEffect(() => {
    setValue("total", total);
  }, [total]);

  const { success: msuccess,loading:mloading } = useAppSelector((state) => state.decide.marketingMixById);


  useEffect(() => {
    if (brand?.production !== undefined) {
      setValue("production", brand?.production);
    }
    if (brand?.price !== undefined) {
      setValue("price", brand?.price);
    }
    if (brand?.advertising !== undefined) {
      setValue("advertising", brand?.advertising);
    }
    if (brand?.ads_share_1 !== undefined) {
      setValue("ads_share_1", Math.round(brand?.ads_share_1 * 100));
    }
    if (brand?.ads_share_2 !== undefined) {
      setValue("ads_share_2", Math.round(brand?.ads_share_2 * 100));
    }
    if (brand?.ads_share_3 !== undefined) {
      setValue("ads_share_3", Math.round(brand?.ads_share_3 * 100));
    }
    if (brand?.ads_share_4 !== undefined) {
      setValue("ads_share_4", Math.round(brand?.ads_share_4 * 100));
    }
    if (brand?.ads_share_5 !== undefined) {
      setValue("ads_share_5", Math.round(brand?.ads_share_5 * 100));
    }

    if (brand?.dimension_1 !== undefined) {
      setValue("dimension_1", brand?.dimension_1);
    }

    if (brand?.dimension_2 !== undefined) {
      setValue("dimension_2", brand?.dimension_2);
    }

    
    if (brand?.objective_1 !== undefined) {
      setValue("objective_1", brand?.objective_1);
    }

    if (brand?.perceptual_obj !== undefined) {
      setValue("perceptual_obj", brand?.perceptual_obj.toString());
    }

  }, [setValue,brand]);


  useEffect(() => {
    if (!dimension1) {
      setValue("objective_1", "");
      setValue("dimension_2", "");
      setValue("objective_2", "");
    }

    if (!objective1) {
      setValue("dimension_2", "");
      setValue("objective_2", "");
    }

    if (!dimension2) {
      setValue("objective_2", "");
    }
    if(selectedChoice === "0"){
      setValue("dimension_1", "");
      setValue("objective_1", "");
      setValue("dimension_2", "");
      setValue("objective_2", "");
    }
  }, [objective1,dimension1,dimension2,selectedChoice]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const {
      production,
      price,
      advertising,
      ads_share_1,
      ads_share_2,
      ads_share_3,
      ads_share_4,
      ads_share_5,
      perceptual_obj,
      dimension_1,
      dimension_2,
      objective_1,
      objective_2
    } = data;
    // Handle final form submission
    if (ID && teamID) {
      dispatch(
        partialUpdateMarketingMix({
          id: ID,
          production,
          price,
          advertising,
          ads_share_1: ads_share_1 / 100,
          ads_share_2: ads_share_2 / 100,
          ads_share_3: ads_share_3 / 100,
          ads_share_4: ads_share_4 / 100,
          ads_share_5: ads_share_5 / 100,
          perceptual_obj:parseInt(perceptual_obj),
          team_id: teamID,
          dimension_1:objective_1 ? parseInt(dimension_1): null,
          objective_1:parseFloat(objective_1) || null,
          dimension_2:objective_2 ? parseInt(dimension_2): null,
          objective_2:parseFloat(objective_2) || null,
        })
      ).then(() => {
        // After successful submission, trigger a refresh
        setRefresh((prevKey) => prevKey + 1);
      });;
    }
  };

  const validateTotal = (value: number) => {
    if (value !== 100) {
      return `total does not add up`;
    }
  };

  const featureOptions=({locale}:{locale?:string}) => features.filter(feature=>['feature_1','feature_2',
                'feature_3','feature_4','feature_5','feature_6'].includes(feature.surname)).map(option => (
                        <option key={option.id} value={option.id}>
                          {(locale==="fr")?option.abbrev_fr:option.abbrev}
                        </option>
                      ))
  const dimensionOptions=({locale}:{locale?:string}) => dimensions.map(option => (
                        <option key={option.id} value={option.id}>
                          {(locale==="fr")?option.name_fr:option.name}
                        </option>))
  
  // if(isDecisionInProgress) return<> Decision is in Progress</>
  return (
    <>
      
      {msuccess && <SuccessMessage message={t("UPDATED_SUCCESSFULLY")} />}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {t("MARKETING_MIX_DECISION")} - {brand?.brand_name}
        </h1>

        <p className="text-lg mb-4">
          {t("BRAND_WAS_LAUNCHED_IN_THE_MARKET_ON_DATE.", {brand_name:brand?.brand_name,  market_name:brand?.market_name,launched_in:brand?.launched_period,activePeriod,project_name:brand?.project?.project_name})}
        </p>

        <hr className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <input
            type="hidden"
            id="firm_id"
            name="firm_id"
            value="{{firm_id}}"
          />
          <input
            type="hidden"
            id="market_id"
            name="market_id"
            value="{{market_id}}"
          />

          <div id="msg"></div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{t("PRODUCTION")}</h2>
              <p>
                {t("ENTER_HERE_YOUR_PRODUCTION_PLAN_IN_UNITS", {brand_name:brand?.brand_name})}
                .
              </p>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("UNITS")}
              </label>
              <input
                {...register("production", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_POSITIVE") },
                })}
                id="name"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.production && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.production?.message}
                </p>
              )}
            </div>
            <div></div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{t("PRICE")}</h2>
              <p>
                {t("SPECIFY_THE_RECOMMENDED_RETAIL_PRICE_AT_WHICH_YOU_WISH_TO_SELL_BRAND", {brand_name:brand?.brand_name})}.<br />
                {t("THIS_IS_THE_LIST_PRICE_TO_THE_CONSUMER.")}
              </p>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                $
              </label>
              <input
                {...register("price", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_POSITIVE") },
                  max: { value: 999, message: t("VALUE_MUST_BE_BELOW_THOUSAND") },
                })}
                id="price"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.price && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.price?.message}
                </p>
              )}
            </div>
            <div></div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{t("ADVERTISING")}</h2>
              <p>
                {t("ENTER_BELOW_YOUR_ADVERTISING_BUDGET_FOR_BRAND", {brand_name:brand?.brand_name})} <br/>
               {t("INDICATE_ALSO_HOW_YOU_WANT_TO_ALLOCATE_THESE_BUDGETS_ACCROSS_CONS")}
              </p>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("MEDIA")}
              </label>
              <input
                {...register("advertising", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_POSITIVE") },
                })}
                id="advertising"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.advertising && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.advertising?.message}
                </p>
              )}
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-6 gap-4 mb-4">
            {segments?.map((entry) => (
              <div key={entry.id} className="flex flex-col">
                <span>
                  <small> {(locale==="fr")?entry.name_fr:entry.name}</small>
                </span>
              </div>
            ))}

            <div className="flex flex-col">
              <span>
                <small> {t("TOTAL")}</small>
              </span>
            </div>

            <div className="">
              <input
                {...register("ads_share_1", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_GREATER_THAN_0") },
                })}
                id="ads_share_1"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.ads_share_1 && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.ads_share_1?.message}
                </p>
              )}
            </div>

            <div className="">
              <input
                {...register("ads_share_2", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_GREATER_THAN_0") },
                })}
                id="ads_share_2"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.ads_share_2 && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.ads_share_2?.message}
                </p>
              )}
            </div>

            <div className="">
              <input
                {...register("ads_share_3", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_GREATER_THAN_0") },
                })}
                id="ads_share_3"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.ads_share_3 && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.ads_share_3?.message}
                </p>
              )}
            </div>

            <div className="">
              <input
                {...register("ads_share_4", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_GREATER_THAN_0") },
                })}
                id="ads_share_4"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.ads_share_4 && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.ads_share_4?.message}
                </p>
              )}
            </div>

            <div className="">
              <input
                {...register("ads_share_5", {
                  required: true,
                  min: { value: 0, message: t("VALUE_MUST_BE_GREATER_THAN_0") },
                })}
                id="ads_share_5"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
              {!!errors.ads_share_5 && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.ads_share_1?.message}
                </p>
              )}
            </div>

            <div className="">
              <input
                {...register("total", {
                  required: true,
                  validate: validateTotal,
                })}
                id="total"
                type="number"
                placeholder=""
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                disabled
              />
              {!!errors.total && (
                <p className="text-sm text-red-500 pt-2">
                  {errors.total?.message}
                </p>
              )}
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-4">
              <h2 className="text-xl font-bold mb-2">{t("PERCEPTUAL_OBJECTIVE")}</h2>
              <p>
                {t("ENTER_BELOW_WHAT_YOUR_DESIRED_PERCEPTUAL_OBJECTIVES", {brand_name:brand?.brand_name})}
                <br />
                {t("IF_YOUR_INTENT_IS_JUST_TO_RAISE_AWARENESS")}
                <br />
                {t("OTHERWISE,_YOU_MAY_SPECIFY_YOUR_OBJECTIVES_IN_TERMS_OF_SEMANTIC_S")}
              </p>
            </div>

            <div className="row align-items-start">
              <label>
                <input
                  type="radio"
                  value={0}
                  {...register("perceptual_obj", { required: true })}
                />{" "}
                {t("NO_OBJECTIVES")}
              </label>
            </div>
            <div className="row align-items-start">
              <label>
                <input
                  type="radio"
                  value={1}
                  {...register("perceptual_obj", { required: true })}
                />{" "}
                {t("SEMANTIC_SCALES")}
              </label>
            </div>
            <div className="row align-items-start">
              <label>
                <input
                  type="radio"
                  value={2}
                  {...register("perceptual_obj", { required: true })}
                />{" "}
                {t("MULTIDIMENSIONAL_SCALING")}
              </label>
            </div>
            <div></div>
          </div>

          {selectedChoice !== "0" && (
            <div className="grid grid-cols-4 gap-4 mb-4">

               <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("DIMENSION_1")}
              </label>
              <select
                {...register("dimension_1", {
                  required: false,
                })}
                id="dimension_1"
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                defaultChecked={brand?.dimension_1}
              >
              <option value="">-----</option>
              {(selectedChoice === "1") ? featureOptions({locale}) : dimensionOptions({locale})}
              </select>
            
            </div>
            

             <div>
             {(dimension1) && (<><label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("OBJECTIVE_1")}
              </label>
              <select
                {...register("objective_1", {
                  required: false,
                })}
                id="objective_1"
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                defaultChecked={brand?.objective_1}
              >
              {(selectedChoice === "1") ? choicesObjective1 : choicesObjective2}
              </select></>)
            }
            </div>
            
            <div>
            {objective1 && <><label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("DIMENSION_2")}
              </label>
              <select
                {...register("dimension_2", {
                  required: false,
                })}
                id="dimension_2"
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                defaultChecked={brand?.dimension_2}
              >
              <option value="">-----</option>
              {(selectedChoice === "1") ? featureOptions({locale}) : dimensionOptions({locale})}
              </select>
              </>}
            </div>

           <div>
           {dimension2 && <> <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
               {t("_OBJECTIVE_2")}
              </label>
              <select
                {...register("objective_2", {
                  required: false,
                })}
                id="objective_2"
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                defaultChecked={brand?.objective_2}
              >
               {(selectedChoice === "1") ? choicesObjective1 : choicesObjective2}
              </select>
              </>}
            </div>

            </div>
          )}

          <div className="grid grid-cols-4 gap-4 pt-4">
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

            <div>
              <Link href={paths.decide.marketingMix.$url()}>
                <button className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                  {t("MARKETING_MIX")}
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default DetailPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

DetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
