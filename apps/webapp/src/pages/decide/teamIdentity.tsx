import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { SuccessMessage } from "@/components/ToastMessages";
import { fetchDecisionStatus, updateTeamName } from "@/lib/features/decideSlices";
import { loadInfo } from "@/lib/features/participantSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { uppercase } from "@/lib/utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";

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

  const dispatch = useAppDispatch();
  const {participant} = useAuth()
  const { teamName,teamID,industryID,activePeriod} =
    participant || {};
    const paths = usePaths()
   const firstLetter = teamName?.[0]
    const {
        handleSubmit,
        register,
        formState: { errors: errorsForm },
      } = useForm<FormValues>();
    
      useEffect(() => {
        if(industryID){
        dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
        }
      }, [dispatch,industryID]);
      
      const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
      const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
      const {loading,success} = useAppSelector((state) => state.decide);
      const { t } = useTranslation('common')
      
      const onSubmit = (data: FormValues) => {
        const { teamName } = data;
        // Validate and handle form submission
        if (teamID) {
            dispatch(updateTeamName({ teamID, newName:uppercase(teamName) }));
            const pak = localStorage.getItem("pak");
            if(pak) dispatch(loadInfo({pak}))
        } 
      };

      const validateName = (value: string) => {
        const alphabeticRegex = /^[A-Za-z]+$/;
            if (!alphabeticRegex.test(value)) { 
              return t("NAME_MUST_CONTAIN_ONLY_ALPHABETIC_LETTERS");
            }
        if (value[0] !== firstLetter) { 
            return t("TEAM_NAME_MUST_START_WITH",{firstLetter})
        }
      };


      // if(isDecisionInProgress) return<> Decision is in Progress</>


    return (
        <>
        
        {success && <SuccessMessage message={t("UPDATED_SUCCESSFULLY")} />}
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
  