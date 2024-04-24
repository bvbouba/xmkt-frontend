import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { SuccessMessage } from "@/components/ToastMessages";
import { getChannelsData } from "@/lib/features/analyzeSlices";
import { fetchBudgetDetails, fetchDecisionStatus, getMarketingMixData, partialUpdateMarketingMix } from "@/lib/features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
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

function CommercialTeam({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const { t } = useTranslation('common')
  
    const paths = usePaths();
    const dispatch = useAppDispatch();
    const {participant,setRefresh} = useAuth()
    const { industryID, firmID, activePeriod,teamID } = participant || {};

    useEffect(() => {
      if(industryID){
      dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
      }
    }, [dispatch,industryID]);
    
    const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
    const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
    
  
    useEffect(() => {
      if (firmID && industryID && activePeriod) {
        dispatch(getMarketingMixData({ industryID, firmID, period: activePeriod }));
        dispatch(getChannelsData());
      }
    }, [dispatch, firmID, industryID, activePeriod]);
  
    const { data: brands } = useAppSelector((state) => state.decide.marketingMix);
    const { data: channels } = useAppSelector((state) => state.analyze.channels);
    const { success: msuccess,loading:mloading } = useAppSelector((state) => state.decide.marketingMixById);
    const selectedBrands = brands.filter((entry) => entry.is_active === true);
    
  
    const onSubmit = (data: any) => {
      // Handle form submission
      brands.map(entry =>{
        const channel_1 = data['channel_1'][entry.id]
        const channel_2 = data['channel_2'][entry.id]
        const channel_3 = data['channel_3'][entry.id]
        if(teamID){
        dispatch(partialUpdateMarketingMix({id:entry.id,team_id:teamID,channel_1,channel_2,channel_3}))
        .then(() => {
          // After successful submission, trigger a refresh
          setRefresh((prevKey) => prevKey + 1);
        });
        }
      })
    };

    // if(isDecisionInProgress) return<> Decision is in Progress</>
  
    return (
      <>
        {msuccess && <SuccessMessage message="Updated successfully" />}
        <div className="container mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">{t("COMMERCIAL_TEAM_DECISION")}</h1>
          <p className="mb-4">
            {t("ENTER_IN_THE_TABLE_BELOW_THE_NUMBER_OF_FULL-TIME_COMMERCIAL_PEOPL")}
          </p>
  
          <form id="ct" onSubmit={handleSubmit(onSubmit)}>
            <table className="min-w-full leading-normal mb-8">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                  {channels.map((entry) => (
                    <th key={entry.id} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {(locale==="fr")?entry.name_fr:entry.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedBrands.map((entry) => (
                  <tr key={entry.id}>
                    <th className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{entry.brand_name}</th>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        {...register(`channel_1.${entry.id}`, { required: true })}
                        type="number"
                        placeholder=""
                        className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                        defaultValue={entry.channel_1}
                      />
                      {errors[`channel_1.${entry.id}`] && (
                        <p className="text-red-500">{t("THIS_FIELD_IS_REQUIRED")}</p>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        {...register(`channel_2.${entry.id}`, { required: true })}
                        type="number"
                        placeholder=""
                        className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                        defaultValue={entry.channel_2}
                      />
                      {errors[`channel_2.${entry.id}`] && (
                        <p className="text-red-500">{t("THIS_FIELD_IS_REQUIRED")}</p>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input
                        {...register(`channel_3.${entry.id}`, { required: true })}
                        type="number"
                        placeholder=""
                        className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                        defaultValue={entry.channel_3}
                      />
                      {errors[`channel_3.${entry.id}`] && (
                        <p className="text-red-500">{t("THIS_FIELD_IS_REQUIRED")}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
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

export default CommercialTeam;

CommercialTeam.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  