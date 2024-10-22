import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";
import usePaths from "@/lib/paths";
import { uppercase } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { fetchBrandById, fetchDecisionStatus, getMarketsData, getProjectData, updateBrand } from "features/data";
import { brandPortofolioProps, decideStatusProps, marketProps, rndProjectProps } from "types";
import { Loading } from "@/components/Loading";


export type FormData = {
  name: string,
  role: string,
  project: number,
  operation: string
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

function UpdateBrand({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>();
  const router = useRouter();
  const { brand_id } = router.query;
  const brandID = typeof brand_id === 'string' ? parseInt(brand_id, 10) : null;

  const paths = usePaths();

  const { data: session, status } = useSession();
  const { industryID, firmID, activePeriod, teamName } = session || {};
  const firstLetter = teamName?.[0];
  const selectedChoice = watch("operation");
  const { t } = useTranslation('common');

  const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
  const [brand, setBrand] = useState<brandPortofolioProps>();
  const [projects, setProjects] = useState<rndProjectProps>();
  const [markets, setMarkets] = useState<marketProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [messsage, setMessage] = useState<string>("")


  // Fetch project, brand, and market data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && firmID && industryID && activePeriod && brandID) {
        setLoading(true);
        try {
          const projectData = await getProjectData({ industryID, firmID, period: activePeriod, token: session.accessToken });
          setProjects(projectData);
          const brandData = await fetchBrandById({ id: brandID, token: session.accessToken });
          setBrand(brandData);
          const marketsData = await getMarketsData();
          setMarkets(marketsData);
        } catch (error) {
          console.error('Error fetching  data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [status,firmID,industryID,activePeriod,session?.accessToken]);

  useEffect(() => {
    if (brand?.name !== undefined) {
      setValue('name', brand?.name);
    }
    if (brand?.role !== undefined) {
      setValue('role', brand?.role);
    }

    if (brand?.is_active !== undefined) {
      if (brand?.is_active === true) {
        setValue('operation', '1');
      } else {
        setValue('operation', '0');
      }
    }


  }, [brand?.name, brand?.role, brand?.is_active]);


  const market = markets.find(m => m.id === brand?.market)

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    if (window.confirm(t("ARE_YOU_SURE_YOU_WANT_MODIFY_THIS_PRODUCT"))) {
      const { name, role, project, operation } = data
      const isActive = (operation === "0") ? false : true

      // Handle final form submission
      if (market && activePeriod && industryID && brandID && status === 'authenticated') {
 
          try {
            await updateBrand({ id: brandID, name: uppercase(name), role, project, isActive, period: activePeriod, token: session.accessToken })
            setMessage(t("UPDATED_SUCCESSFULLY"))
            if(operation ==="0"){
              router.push(paths.decide.brandPortofolio.$url())
            }
          } catch (error) {
            console.error('Error updating brand:', error);
          }

      }
    }
  };

  const validateProjectName = (value: string) => {
    if ((value[0] !== firstLetter)) {
      return (`Project name must start with ${firstLetter}`)
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
          {brand?.is_active ? <div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="team"
                >
                  {t("NAME")}
                </label>
                <input
                  {...register("name", {
                    validate: validateProjectName,
                    required: true,
                    min: { value: 3, message: t("NAME_LENGTH_MUST_BE_3_OR_GREATER") },
                    max: { value: 20, message: t("NAME_LENGTH_MUST_BE_20_OR_LESS") }
                  })}
                  id="name"
                  placeholder=""
                  spellCheck={false}
                  disabled
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

              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="team"
                >
                  {t("BASED_ON")}
                </label>
                <input
                  id="since"
                  placeholder=""
                  type="text"
                  defaultValue={brand?.project_name ?? ""}
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
                {...register("role",
                  { required: true }
                )}
                id="role"
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
              <span className="font-semibold">{t("WHAT_OPERATION_DO_YOU_WANT_TO_DO_ON_THIS_BRAND?.")}</span>
              <div>

                <div className="row align-items-start">
                  <label>
                    <input
                      type="radio"
                      value={"1"}
                      {...register("operation", { required: true })}
                    /> {t("MAINTAIN")}
                  </label>
                </div>
                <div className="row align-items-start">
                  <label>
                    <input
                      type="radio"
                      value={"0"}
                      {...register("operation", { required: true })}
                    /> {t("WITHDRAW_-_WILL_NO_LONGER_BE_MARKETED", { name: brand?.name })}
                  </label>
                </div>
                <div className="row align-items-start">
                  <label>
                    <input
                      type="radio"
                      value={"2"}
                      {...register("operation", { required: true })}
                    /> {t("MODIFY")}
                  </label>
                </div>

              </div>

              {(selectedChoice === "2") &&
                (<div className="pl-5">
                  <div className="mt-2 grid grid-cols-1 gap-4">
                    {t("SELECT_A_NEW_BASE_PROJECT:")}
                    {projects?.past?.map(entry => (
                      <div key={entry.id} className="row align-items-start">
                        <label>
                          <input
                            type="radio"
                            value={entry.id}
                            {...register("project", { required: true })}
                            defaultChecked={entry.id === brand?.project}
                          /> {entry.name} {entry.objective ? `: ${entry.objective}` : ""}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>)
              }
            </div>
          </div> :
            <div> {brand?.name && t("IS_NO_LONGER_ACTIVE", { name: brand?.name })}</div>}


          <div className="grid grid-cols-3 gap-4 p-4">
            {brand?.is_active && <div className="">
              <button
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600"
                type="submit"
              >
                {loading ? t("...SAVING") : t("SAVE")}
              </button>


            </div>
            }
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
        {/* Confirmation Modal */}

      </div>
    </>
  );
}

export default UpdateBrand;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

UpdateBrand.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};