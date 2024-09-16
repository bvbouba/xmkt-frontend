import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";
import { getMarketsData, getProjectData } from "features/analyzeSlices";
import { fetchDecisionStatus, submitBrand } from "features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { uppercase } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type FormData = {
    name:string,
    role:string,
    project:number,
  };

  export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || 'en';
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        locale,
      },
    };
  };

function AddBrand({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm<FormData>();
      const dispatch = useAppDispatch();
      const router = useRouter()
      const paths = usePaths()
      const {participant} = useAuth()
      const { industryID, firmID,activePeriod,teamName,teamID } = participant||{};
      const {market_id} = router.query
      const marketID = typeof market_id === 'string' ? parseInt(market_id, 10) : null;
      const firstLetter = teamName?.[0]
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
            if (firmID && industryID && activePeriod) {
                dispatch(getProjectData({ industryID, firmID, period:activePeriod }));
                dispatch(getMarketsData());
              }
          }, [dispatch,marketID,firmID,industryID,activePeriod]);

          const {data:projects} = useAppSelector((state) => state.analyze.projects);
          const {data:markets} = useAppSelector((state) => state.analyze.markets);      
          const {success:bsuccess,loading:bloading} = useAppSelector((state) => state.decide.brand);
          const market = markets.find(m => m.id === marketID)

          const onSubmit: SubmitHandler<FormData> = (data) => {
            const { name, role, project} = data
            // Handle final form submission
            if(market && activePeriod && industryID && teamID){
                dispatch(submitBrand({name:uppercase(name),market:market.id, since:activePeriod, role:role||"", project,industry:industryID,team:teamID}))
            }
          };

          const validateName = (value: string) => {
            const alphabeticRegex = /^[A-Za-z]+$/;
            if (!alphabeticRegex.test(value)) { 
              return t("NAME_MUST_CONTAIN_ONLY_ALPHABETIC_LETTERS");
            }
            if ((value[0] !== firstLetter)) { 
                return t("NAME_MUST_START_WITH",{firstLetter})
            }
          };

          return ( 
        <>
        
        {bsuccess && <SuccessMessage message={t("UPDATED_SUCCESSFULLY")} />}
        <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">{t("BRAND_PORTFOLIO_DECISION")}</h1>
  

      <form onSubmit={handleSubmit(onSubmit)}  className="mt-4">

        <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="mb-5">
              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("NAME")}
            </label>
            <input
              {...register("name",{
                validate: validateName,
                required:true,
                minLength:{value:3, message:t("BRAND_NAME_LENGTH_MUST_BE_3_OR_GREATER")},
                maxLength:{value:6, message:t("BRAND_NAME_LENGTH_MUST_BE_6_OR_LESS")},
              })}
              id="name"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.name && (
              <p className="text-sm text-red-500 pt-2">
                {errors.name?.message}
              </p>
            )}
            </div>

            <div className="mb-5">
              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("MARKET")}
            </label>
            <input
              id="market"
              placeholder=""
              type="text"
              defaultValue={market?.name}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
            </div>

            <div className="mb-5">
              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("LAUNCHED_IN")}
            </label>
            <input
              id="since"
              placeholder=""
              type="text"
              defaultValue={activePeriod ?? ""}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
            </div>

        </div>

        <div className="mb-5">

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="objective"
            >
              {t("ROLE")}
            </label>
            <textarea
              {...register("role",{
                required:true,
                maxLength:{value:100, message:t("MUST_BE_LESS",{max:100})},
              })}
              id="objective"
              rows={4}
              placeholder=""
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            {!!errors.role && (
              <p className="text-sm text-red-500 pt-2">
                {errors.role?.message}
              </p>
            )}

            </div>

        <div className="mt-4">
          <span className="font-semibold">{t("YOU_ARE_ABOUT_TO_LAUNCH_A_NEW_BRAND_IN_THE_MARKET", {name:market?.name} )}</span>
          <div className="mt-2">
            <span className="font-semibold">{t("WHICH_R&D_PROJECT_DO_YOU_WANT_TO_USE_AS_THE_BASE_PROJECT_OF_THIS_")}</span>
            <div className="mt-2 grid grid-cols-1 gap-4">
              {t("SELECT_A_NEW_BASE_PROJECT:")}
             {projects.past?.map(entry=>(
                <div key={entry.id} className="row align-items-start">
                <label>
                  <input
                    type="radio"
                    value={entry.id}
                    {...register("project", { required: true })}
                  /> {entry.name} {entry.objective ? `: ${entry.objective}`: ""}
                </label>
                </div>
             ))}

              {!!errors.project && (
              <p className="text-sm text-red-500 pt-2">
                {t("THIS_FIELD_IS_REQUIRED")}
              </p>
            )}
            </div>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-4 p-4">
        <div className="">
          <button
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600"
                type="submit"
              >
                {bloading ? t("...LAUNCHING") : t("LAUNCH_NEW_BRAND")}
              </button>

          </div>

          <div>
          <Link href={paths.decide.$url()}> <button 
   className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
   > {t("DECISION_HOME")} </button></Link>
          </div>
          <div>
              <Link href={paths.decide.brandPortofolio.$url()}>
                <button className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                  {t("BRAND_PROTOFOLIO")}
                </button>
              </Link>
            </div>
      
        </div>
        
      </form>
    </div>
        </>
     );
}

export default AddBrand;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


AddBrand.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };