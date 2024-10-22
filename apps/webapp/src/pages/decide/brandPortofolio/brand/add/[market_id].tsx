import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";
import { uppercase } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { fetchDecisionStatus, getMarketsData, getProjectData, submitBrand } from "features/data";
import { decideStatusProps } from "@/lib/type";
import { marketProps, rndProjectProps } from "types";
import usePaths from "@/lib/paths";
import { Loading } from "@/components/Loading";

export type FormData = {
  name: string,
  role: string,
  project: number,
};

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function AddBrand({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const paths = usePaths()
  const { market_id } = router.query;
  const marketID = typeof market_id === 'string' ? parseInt(market_id, 10) : null;
  const { industryID, firmID, activePeriod, teamName, teamID } = session || {};
  const firstLetter = teamName?.[0];
  const { t } = useTranslation('common');

  const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
  const [projects, setProjects] = useState<rndProjectProps>();
  const [markets, setMarkets] = useState<marketProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [messsage,setMessage] = useState<string>("")
 
 
  useEffect(() => {
    if (status === "authenticated" && firmID && industryID && activePeriod) {
      const loadData = async () => {
        try {
          const [projectsData, marketsData] = await Promise.all([
            getProjectData({ industryID, firmID, period: activePeriod, token: session.accessToken }),
            getMarketsData(),
          ]);
          setProjects(projectsData);
          setMarkets(marketsData);
        } catch (error) {
          console.error('Error getting data:', error);
        } 
      };
      loadData();
    }
  }, [status,firmID,industryID,activePeriod,session?.accessToken]);
  const market = markets.find(m => m.id === marketID)

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, role, project } = data
    // Handle final form submission
    if (status === "authenticated"  && market && activePeriod && industryID && teamID) {
      setLoading(true)
      setMessage("")
      try {
        await submitBrand({ name: uppercase(name), market: market.id, since: activePeriod, role: role || "", project, industry: industryID, team: teamID,token:session.accessToken })
        setMessage(t("UPDATED_SUCCESSFULLY"))
        router.push(paths.decide.brandPortofolio.$url())
      } catch (error) {
        console.error('Error updating brand:', error);
      }finally{
        setLoading(false)
      }
    }
  };

  const validateName = (value: string) => {
    const alphabeticRegex = /^[A-Za-z]+$/;
    if (!alphabeticRegex.test(value)) {
      return t("NAME_MUST_CONTAIN_ONLY_ALPHABETIC_LETTERS");
    }
    if ((value[0] !== firstLetter)) {
      return t("NAME_MUST_START_WITH", { firstLetter })
    }
  };

  if (session?.decisionStatus !== 1 && loading===false) {
    return <div>{t("DECISION_ROUND_NOT_ACTIVE")}</div>;
}

if (loading) {
  return <Loading />;
}

  return (
    <>

      {messsage && <SuccessMessage message={messsage} setMessage={setMessage} />}
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">{t("BRAND_PORTFOLIO_DECISION")}</h1>


        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="team"
              >
                {t("NAME")}
              </label>
              <input
                {...register("name", {
                  validate: validateName,
                  required: true,
                  minLength: { value: 3, message: t("BRAND_NAME_LENGTH_MUST_BE_3_OR_GREATER") },
                  maxLength: { value: 6, message: t("BRAND_NAME_LENGTH_MUST_BE_6_OR_LESS") },
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
              {...register("role", {
                required: true,
                maxLength: { value: 100, message: t("MUST_BE_LESS", { max: 100 }) },
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
            <span className="font-semibold">{t("YOU_ARE_ABOUT_TO_LAUNCH_A_NEW_BRAND_IN_THE_MARKET", { name: market?.name })}</span>
            <div className="mt-2">
              <span className="font-semibold">{t("WHICH_R&D_PROJECT_DO_YOU_WANT_TO_USE_AS_THE_BASE_PROJECT_OF_THIS_")}</span>
              <div className="mt-2 grid grid-cols-1 gap-4">
                {t("SELECT_A_NEW_BASE_PROJECT:")}
                {projects?.past?.map(entry => (
                  <div key={entry.id} className="row align-items-start">
                    <label>
                      <input
                        type="radio"
                        value={entry.id}
                        {...register("project", { required: true })}
                      /> {entry.name} {entry.objective ? `: ${entry.objective}` : ""}
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
                {loading ? t("...LAUNCHING") : t("LAUNCH_NEW_BRAND")}
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