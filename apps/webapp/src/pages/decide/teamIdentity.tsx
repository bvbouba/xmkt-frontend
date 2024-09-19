import { Layout } from "@/components/Layout";
import { SuccessMessage } from "@/components/ToastMessages";
import usePaths from "@/lib/paths";
import { uppercase } from "@/lib/utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { decideStatusProps } from "types";
import { fetchDecisionStatus, updateTeamName } from "features/data";

interface FormValues {
    teamName: string;
  }

  export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || 'en';
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        locale,
      },
    };
  };

  
function TeamIdentity({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {

  const { data: session, status,update } = useSession();
const { teamName, teamID, industryID, activePeriod } = session || {};
const paths = usePaths();
const firstLetter = teamName?.[0];
const { handleSubmit, register, formState: { errors: errorsForm } } = useForm<FormValues>();
const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
const [loading, setLoading] = useState(false);
const { t } = useTranslation('common');
const [message, setMessage] = useState<string>("")

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
}, [status, industryID]);

const isDecisionInProgress = decisionStatus?.status === 2 || decisionStatus?.status === 0;

// Handle form submission
const onSubmit = async (data: FormValues) => {
  const { teamName } = data;

  // Validate and handle form submission
  if (teamID && status === 'authenticated') {
    setLoading(true)
    try {
      await updateTeamName({ teamID, newName: uppercase(teamName), token: session.accessToken });
      update({...session,
            teamName:uppercase(teamName)
      })
      setMessage(t("UPDATED_SUCCESSFULLY"))
    } catch (error) {
      console.error('Error updating team name:', error);
    }finally{
      setLoading(false)
    }
  }
};

// Validate the team name
const validateName = (value: string) => {
  const alphabeticRegex = /^[A-Za-z]+$/;
  if (!alphabeticRegex.test(value)) {
    return t("NAME_MUST_CONTAIN_ONLY_ALPHABETIC_LETTERS");
  }
  if (value[0] !== firstLetter) {
    return t("TEAM_NAME_MUST_START_WITH", { firstLetter });
  }
};


      // if(isDecisionInProgress) return<> Decision is in Progress</>


    return (
        <>
        
        {message && <SuccessMessage message={message} setMessage={setMessage}/>}
        <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">{t("TEAM_IDENTITY")}</h1>
      <div className="grid grid-cols-1">
        <div className="">
          <p className="text-gray-600 mb-2">
            {t("CHOOSE_A_NAME_FOR_YOUR_TEAM_THAT_REFLECTS_YOUR_TEAM_SPIRIT",{firstLetter})} 
            {t("MAKE_SURE_TO_INVOLVE_ALL_YOUR_TEAMMATES_IN_THE_CHOICE._BEWARE,_YO")}
          </p>
        </div>
        <div className="">
   
          <form className="max-w-md " onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="teamName"
            >
              {t("NAME")}
            </label>
              <input
              {...register("teamName",{
                validate: validateName,
                required:true,
                minLength:{value:3, message:t("TEAM_NAME_LENGTH_MUST_BE_3_OR_GREATER")},
                maxLength:{value:8, message:t("TEAM_NAME_LENGTH_MUST_BE_8_OR_LESS")},
              })}
                type="text"
                id="teamName"
                name="teamName"
                defaultValue={teamName ?? ""}
                placeholder=""
                disabled={(activePeriod || 0) > 1}
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {!!errorsForm.teamName && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.teamName?.message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
              <button type="submit"  className="bg-blue-500 text-white px-4 py-2 rounded-md">
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
      </div>
    </div>
        </>
     );
}

export default TeamIdentity;

TeamIdentity.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  