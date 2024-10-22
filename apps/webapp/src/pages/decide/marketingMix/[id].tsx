import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";

import usePaths from "@/lib/paths";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { brandProps, markertingMixProps, MarketingMixType } from "types";
import { fetchMarketingMixDecisionByTeam, fetchDimensions, fetchMarketingMixById, getFeaturesData, getSegmentsData, partialUpdateMarketingMix, getBrandResultByFirm, getPeriodResultByBrand } from "features/data";

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
  const locale = context.locale || context.defaultLocale || 'fr';
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
  const { data: session, status, update } = useSession();
  const { industryID, activePeriod, teamID, firmID } = session || {};
  const selectedChoice: string = (watch("perceptual_obj") || "").toString();
  const dimension1 = watch("dimension_1");
  const objective1 = watch("objective_1");
  const dimension2 = watch("dimension_2");
  const watchAdsShares = watch([
    "ads_share_1",
    "ads_share_2",
    "ads_share_3",
    "ads_share_4",
    "ads_share_5",
  ]);
  const total = watchAdsShares.reduce((acc, value) => acc + Number(value), 0);
  const { t } = useTranslation('common');
  const [brand, setBrand] = useState<markertingMixProps>();
  const [features, setFeatures] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [lastbrandDecision, setLastBrandDecision] = useState<MarketingMixType>()
  const [brandResult, setBrandResult] = useState<brandProps>()
  const lastPeriod = (activePeriod || 0) - 1
  // Fetch marketing mix, features, dimensions, and segments data
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && ID && teamID && activePeriod && industryID && firmID) {
        try {
          const marketingMixData = await fetchMarketingMixById({ id: ID, token: session.accessToken });
          setBrand(marketingMixData);


          if (brand?.brand_id) {
            const decision = await fetchMarketingMixDecisionByTeam({
              teamId: teamID, period: lastPeriod, token: session.accessToken,
              fields: "brand_id,production,price,advertising,period_id"
            })
            setLastBrandDecision(decision.find(d => d.brand_id === brand?.brand_id))


            const result = await getPeriodResultByBrand({
              brandID: brand?.brand_id, period: lastPeriod, token: session.accessToken,
            })
            setBrandResult(result)
          }

          const featuresData = await getFeaturesData();
          setFeatures(featuresData);

          const dimensionsData = await fetchDimensions();
          setDimensions(dimensionsData);

          const segmentsData = await getSegmentsData();
          setSegments(segmentsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [ID, status, session,brand?.brand_id]);

  // Update form values based on fetched brand data
  useEffect(() => {
    if (brand) {
      setValue("production", brand.production);
      setValue("price", brand.price);
      setValue("advertising", brand.advertising);
      setValue("ads_share_1", Math.round(brand.ads_share_1 * 100));
      setValue("ads_share_2", Math.round(brand.ads_share_2 * 100));
      setValue("ads_share_3", Math.round(brand.ads_share_3 * 100));
      setValue("ads_share_4", Math.round(brand.ads_share_4 * 100));
      setValue("ads_share_5", Math.round(brand.ads_share_5 * 100));
      setValue("dimension_1", brand.dimension_1);
      setValue("dimension_2", brand.dimension_2);
      setValue("objective_1", brand.objective_1);
      setValue("perceptual_obj", brand.perceptual_obj?.toString());
    }
  }, [brand, setValue]);

  // Clear objectives and dimensions if certain conditions are not met
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

    if (selectedChoice === "0") {
      setValue("dimension_1", "");
      setValue("objective_1", "");
      setValue("dimension_2", "");
      setValue("objective_2", "");
    }
  }, [dimension1, objective1, dimension2, selectedChoice, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
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
      objective_2,
    } = data;
    if (ID && teamID && status === "authenticated") {
      setLoading(true);
      try {
        await partialUpdateMarketingMix({
          id: ID,
          production,
          price,
          advertising,
          ads_share_1: ads_share_1 / 100,
          ads_share_2: ads_share_2 / 100,
          ads_share_3: ads_share_3 / 100,
          ads_share_4: ads_share_4 / 100,
          ads_share_5: ads_share_5 / 100,
          perceptual_obj: parseInt(perceptual_obj),
          team_id: teamID,
          dimension_1: objective_1 ? parseInt(dimension_1) : null,
          objective_1: parseFloat(objective_1) || null,
          dimension_2: objective_2 ? parseInt(dimension_2) : null,
          objective_2: parseFloat(objective_2) || null,
          token: session.accessToken,
        });
        await update({
          ...session,
          refresh: session.refresh + 1
        })

        setMessage(t("UPDATED_SUCCESSFULLY"));
      } catch (error) {
        console.error('Error updating marketing mix:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setValue("total", total);
  }, [total]);

  const validateTotal = (value: number) => {
    if (value !== 100) {
      return t(`TOTAL_DO_NOT_ADD_UP`);
    }
  };

  const featureOptions = ({ locale }: { locale?: string }) => features.filter(feature => ['feature_1', 'feature_2',
    'feature_3', 'feature_4', 'feature_5', 'feature_6'].includes(feature.surname)).map(option => (
      <option key={option.id} value={option.id}>
        {(locale === "fr") ? option.abbrev_fr : option.abbrev}
      </option>
    ))
  const dimensionOptions = ({ locale }: { locale?: string }) => dimensions.map(option => (
    <option key={option.id} value={option.id}>
      {(locale === "fr") ? option.name_fr : option.name}
    </option>))


  if (session?.decisionStatus !== 1 && loading === false) {
    return <div>{t("DECISION_ROUND_NOT_ACTIVE")}</div>;
  }


  return (
    <>

      {message && <SuccessMessage message={message} setMessage={setMessage} />}


      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {t("MARKETING_MIX_DECISION")} - {brand?.brand_name}
        </h1>

        <p className="text-lg mb-4">
          {t("BRAND_WAS_LAUNCHED_IN_THE_MARKET_ON_DATE.", { brand_name: brand?.brand_name, market_name: brand?.market_name, launched_in: brand?.launched_period, activePeriod, project_name: brand?.project?.project_name })}
        </p>

        <hr className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">


          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-2">{t("PRODUCTION")}</h2>
              <p>
                {t("ENTER_HERE_YOUR_PRODUCTION_PLAN_IN_UNITS", { brand_name: brand?.brand_name })}
                .
              </p>

              <p>
                {brandResult && t("UNITS_OF_BRAND_WERE_SOLD_DURING_LAST_PERIOD", { unit_sold: brandResult?.unit_sold*1000, brand_name: brand?.brand_name, period: lastPeriod })}
                .
              </p>
              <p>
                {brandResult && t("THERE_ARE_UNITS_OF_BRAND_AVAILABLE_IN_YOUR_INVENTORY", { inventory: brandResult?.inventory_end*1000, brand_name: brand?.brand_name })}
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

          <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-2">
          <h2 className="text-xl font-bold mb-2">{t("PRICE")}</h2>
              <p>
                {t("SPECIFY_THE_RECOMMENDED_RETAIL_PRICE_AT_WHICH_YOU_WISH_TO_SELL_BRAND", { brand_name: brand?.brand_name })}.<br />
              </p> <p> {t("THIS_IS_THE_LIST_PRICE_TO_THE_CONSUMER.")} </p>
              <p>  {lastbrandDecision && t("THE_PRICE_WAS_AT_THE_LAST_PERIOD", { price: lastbrandDecision?.price, period:lastPeriod })}
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

          <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-2">
              <h2 className="text-xl font-bold mb-2">{t("ADVERTISING")}</h2>
              <p>
                {t("ENTER_BELOW_YOUR_ADVERTISING_BUDGET_FOR_BRAND", { brand_name: brand?.brand_name })} <br />
              </p>
              <p>  {lastbrandDecision && t("THE_ADVERTISING_BUDGET_OF_BRAND_IN_PERIOD", { advertising: lastbrandDecision?.advertising, brand_name:lastbrandDecision?.brand_name, period:lastPeriod })}
              </p>
              <p>{t("INDICATE_ALSO_HOW_YOU_WANT_TO_ALLOCATE_THESE_BUDGETS_ACCROSS_CONS")}
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
                  <small> {(locale === "fr") ? entry.name_fr : entry.name}</small>
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
                {t("ENTER_BELOW_WHAT_YOUR_DESIRED_PERCEPTUAL_OBJECTIVES", { brand_name: brand?.brand_name })}
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
                  {(selectedChoice === "1") ? featureOptions({ locale }) : dimensionOptions({ locale })}
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
                    {(selectedChoice === "1") ? featureOptions({ locale }) : dimensionOptions({ locale })}
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
                {loading ? t("...SAVING") : t("SAVE")}
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
