import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BlockHeader } from "@/components/blockHeader";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePaths from "@/lib/paths";
import Link from "next/link";
import { SuccessMessage } from "@/components/ToastMessages";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { CustomModal as Modal } from "@/components/Modal";
import { useSession } from "next-auth/react";
import { decideStatusProps, featureProps, projectProps } from "types";
import { deleteProject, fetchDecisionStatus, fetchProjectById, getFeaturesData, partialUpdateProject } from "features/data";
import { Loading } from "@/components/Loading";


export type FormData = {
  objective?:string | null,

  budget:number
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


function ProjectPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
const { project_id } = router.query;
const projectID = typeof project_id === 'string' ? parseInt(project_id, 10) : null;

const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

const { data: session, status,update } = useSession();
const { activePeriod, teamID, industryID } = session || {};  // Assuming session participant data structure

const paths = usePaths();
const { t } = useTranslation('common');
const [showConfirmation, setShowConfirmation] = useState(false);
const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
const [project, setProject] = useState<projectProps>();
const [features, setFeatures] = useState<featureProps[]>([]);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState<string>("")

// Fetch project and features data
useEffect(() => {
  const fetchData = async () => {
    if (status === "authenticated" && projectID && activePeriod) {
      try {
        const projectData = await fetchProjectById({ id: projectID, period: activePeriod, token: session.accessToken });
        setProject(projectData);
        
        const featuresData = await getFeaturesData();
        setFeatures(featuresData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };
  fetchData();
}, [status, projectID, activePeriod,session?.accessToken]);

// Populate form fields with project data
useEffect(() => {
  if (project?.allocated_budget_for_current_period !== undefined) {
    setValue('budget', project.allocated_budget_for_current_period);
  }
  setValue('objective', project?.objective);
}, [project]);

// Filter selected features
const selectedFeatures = features.filter(feature => 
  ['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5'].includes(feature.surname)
);

// Handle form submission
const onSubmit: SubmitHandler<FormData> = async (data) => {
  if (projectID && activePeriod && status === "authenticated") {
    const objective = data.objective || project?.objective || "";
    setLoading(true)
    try {
      await partialUpdateProject({
        projectID,
        objective,
        allocatedBudget: data.budget,
        period: activePeriod,
        token: session.accessToken
      });
      const newSession = await update({
        ...session,
        refresh:session.refresh+1
      })
      setMessage(t("UPDATED_SUCCESSFULLY"))
    } catch (error) {
      console.error('Error updating project:', error);
    }finally{
      setLoading(false)
    }
  }
};

// Handle project deletion
const onDelete = async () => {
  if (window.confirm(t("ALL_YOUR_PAST_INVESTMENT_WILL_BE_LOST"))){
  if (projectID && status === "authenticated") {
    setShowConfirmation(false);
    try {
      await deleteProject({ projectID, token: session.accessToken });
      router.push(paths.decide.researchAndDevelopment.$url());
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
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
      
      {message && <SuccessMessage message={message} setMessage={setMessage}/>}
      <div className="container mx-auto">
      <BlockHeader title={t("R&D_DECISION_-_PROJECT_OVERVIEW")} />

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="gap-4">
          
          <div className="max-w-md">
          <div className="p-4">
            <h2 className="g-subtitle text-xl text-blue-700">{t("PROJECT_NAME_&_OBJECTIVE")}</h2>

          <div className="col-span-2 p-4">
            <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("NAME")}
            </label>
            <input
              defaultValue={project?.name}
              id="name"
              placeholder=""
              spellCheck={false}
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="mb-5">
             
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="objective"
            >
              {t("OBJECTIVE")} <FontAwesomeIcon icon={faEdit} />
            </label>
            <textarea
              {...register("objective",{
                required:false
              })}
              id="objective"
              rows={4}
              placeholder=""
              disabled={!(project?.status == false)}
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            {!!errors.objective && (
              <p className="text-sm text-red-500 pt-2">
                {errors.objective?.message}
              </p>
            )}
            </div>
          </div>
          </div>

          </div>


          <div className="p-4">
            <h2 className="g-subtitle text-xl text-blue-700">{t("PROJECT_CHARACTERISTICS_AND_BASE_COST")}</h2>
         

          <div className="">
          <div className="grid grid-cols-5 gap-4 p-4">
                {selectedFeatures.map(entry =><div key={entry.id} className="flex flex-col">
               <span> {entry.name}</span>
               <span><small>{`(${entry.range_inf} to ${entry.range_sup})`}</small></span>
                </div> )}           
         </div>
          <div className="grid grid-cols-5 gap-4">
           <div className="">
            <input
              defaultValue={project?.feature_1}
              id="feature_1"
              type="number"
              placeholder=""
              spellCheck={false}
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={project?.feature_2}
              id="feature_2"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={project?.feature_3}
              id="feature_3"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={project?.feature_4}
              id="feature_4"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>

            <div className="">
            <input
              defaultValue={project?.feature_5}
              id="feature_5"
              type="number"
              placeholder=""
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>
           
          </div>
          </div>

          <div className="p-4 max-w-md">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="w-24">Base cost</div>
            <div>
            <input
              type="text"
              defaultValue={(project?.choice === 1 )? 'lowest possible' : project?.base_cost}
              disabled
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            /> 
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="">{t("ESTIMATED_MINIMUM_BASE_COST")}</div>
              <div>
                <div>
              <input
            type="number"
            id="minCost"
            defaultValue={project?.min_cost}
            disabled
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
          </div>
          </div>
            </div>
          </div>

          </div>

          <div className="p-4">
            <h2 className="g-subtitle text-xl text-blue-700">{t("BUDGET_ALLOCATED_TO_PROJECT")}</h2>
         
          <div className="p-4 max-w-md">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="w-36">{t("BUDGET_REQUIRED_FOR_COMPLETION")}</div>
            <div><input 
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            type="text" defaultValue={project?.required_budget} disabled />
          </div></div>

         <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="w-36">{t("BUDGET_ALLOCATED_THIS_PERIOD")} <FontAwesomeIcon icon={faEdit} /></div>
            <div><input 
             {...register("budget", { required: true })}
             disabled={!(project?.status == false)}
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            type="number" />
            </div>
          </div>
          </div>
        </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4">
          <div>
              {(project?.status == false) && <button type="button" data-modal-target="popup-modal" data-modal-toggle="popup-modal"
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
              onClick={() => onDelete()}>
              {t("DELETE")} {project?.name}
              </button>}
           
          </div>
  <div>
   <Link href={paths.decide.$url()}> <button 
   className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
   > {t("DECISION_HOME")} </button></Link>
  </div>
  <div>
  <Link href={paths.decide.researchAndDevelopment.$url()}>
    <button
    className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
    > {t("R&D_OVERVIEW")} </button></Link>
  </div>
          <div className="flex justify-end">
          {(project?.status == false) && <button
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600"
                type="submit"
              >
                {loading ? t("...SAVING") : t("SAVE")}
              </button>
}
          </div>
        </div>

      </form>
    </div>
      </>
      );
}

export default ProjectPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};