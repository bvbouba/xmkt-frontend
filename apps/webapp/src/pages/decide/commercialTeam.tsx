import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";
import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { channelProps, decideStatusProps, markertingMixProps } from "types";
import { fetchDecisionStatus, getChannelsData, getMarketingMixData, partialUpdateMarketingMix } from "features/data";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
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
  const { t } = useTranslation('common');
  const paths = usePaths();
  
  const { data: session, status,update } = useSession();
  const { industryID, firmID, activePeriod, teamID } = session || {};
  
  const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
  const [brands, setBrands] = useState<markertingMixProps[]>([]);
  const [channels, setChannels] = useState<channelProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(true);

  const [message, setMessage] = useState<string>("");
  
  const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
  
  // Fetch decision status when industryID is available
  useEffect(() => {
    if (status === "authenticated" && industryID) {
      const fetchDecisionStatusData = async () => {
        try {
          const data = await fetchDecisionStatus({ industryID, token: session.accessToken });
          setDecisionStatus(data);
        } catch (error) {
          console.error('Error fetching decision status:', error);
        }
      };
      fetchDecisionStatusData();
    }
  }, [status, industryID,session?.accessToken]);

  // Fetch marketing mix and channels data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && firmID && industryID && activePeriod) {
        setLoading1(true)
        try {
          const marketingMixData = await getMarketingMixData({ industryID, firmID, period: activePeriod, token: session.accessToken });
          setBrands(marketingMixData);
          const channelsData = await getChannelsData();
          setChannels(channelsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }finally{
          setLoading1(false)
        } 
      }
    };
    fetchData();
  }, [status,firmID,industryID,activePeriod,session?.accessToken]);
  
  const selectedBrands = brands.filter((entry) => entry.is_active === true);
  
  if (status==="loading" && loading1) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (data: any) => {
    // Handle form submission
    if (teamID && status === 'authenticated') {
      setLoading(true)
      try {
        await Promise.all(
          brands.map(async (entry) => {
            const channel_1 = data['channel_1'][entry.id];
            const channel_2 = data['channel_2'][entry.id];
            const channel_3 = data['channel_3'][entry.id];
  
            await partialUpdateMarketingMix({
              id: entry.id,
              team_id: teamID,
              channel_1,
              channel_2,
              channel_3,
              token: session.accessToken
            });
          })
        );
        const newSession = await update({
          ...session,
          refresh:session.refresh+1
        })
        // Trigger a refresh after successful submission
        setMessage(t('UPDATED_SUCCESSFULLY'));
      } catch (error) {
        console.error('Error updating marketing mix:', error);
      }finally{
        setLoading(false)
      }
    }
  };
    // if(isDecisionInProgress) return<> Decision is in Progress</>
  
    return (
      <>
        {message && <SuccessMessage message={message} setMessage={setMessage}/>}
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
  