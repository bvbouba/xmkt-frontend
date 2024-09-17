import { Loading } from "@/components/Loading";
import { ProjectTable } from "@/components/Table";
import { HeaderContainer } from "@/components/container";
import { translateFeatures } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {  useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getFeaturesData, getProjectData } from "features/data";
import { featureProps, projectProps, rndProjectProps } from "types";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function RndReportPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const { teamName, industryID, firmID,  } = session || {};
  const selectedPeriod = session?.selectedPeriod || 0
  const [featureData,setFeatureData] = useState<featureProps[]>([])
  const [projectData,setProjectData] = useState<rndProjectProps>({})
  const [loading,setLoading] = useState(false)

    const { t } = useTranslation('common')

    useEffect(() => {

      if (status === "authenticated" && firmID && industryID) {
        const loadData = async () => {
          setLoading(true)
          try {
            const response1 = await getProjectData({ industryID, firmID,period:selectedPeriod, token: session.accessToken });
            const response2  = await getFeaturesData();
            setProjectData(response1)
            setFeatureData(response2)
          } catch (error) {
            console.error('Error getting course:', error);
          }finally{
            setLoading(false)
          }
        }
        loadData()
         
        }
      }, [status,]);
    

  const selectedFeatures = featureData?.filter(feature=>['feature_1','feature_2',
  'feature_3','feature_4','feature_5'].includes(feature.surname))

  const title = t("R&D_REPORT_-_FIRM", {teamName,selectedPeriod})

    return (<>
    
        
    <div>
    <div className="container mx-auto">

      <HeaderContainer title={title} content={`${t("THIS_REPORT_PROVIDES_INFORMATION_ON_THE_ACTIVITIES_CONDUCTED_FOR_")} ${selectedPeriod}`}/>
      {
      loading ? <Loading />:
      <>
      <ProjectTable
        projects={projectData.now}
        title={t("PROJECT_COMPLETED_IN_PERIOD",{selectedPeriod})}
        features={translateFeatures(selectedFeatures,locale)}
        subtitle={t("THE_PROJECT_LISTED_BELOW_HAVE_JUST_BEEN_COMPLETED_AND_CAN_BE_LAUN")}
      />

      <ProjectTable
        projects={projectData.past}
        title={t("PROJECT_COMPLETED_IN_PAST_PERIOD")}
        features={translateFeatures(selectedFeatures,locale)}
        subtitle={t("THE_PROJECTS_LISTED_BELOW_HAVE_BEEN_COMPLETED_IN_THE_PAST_PERIOD.")}
      />

      <ProjectTable
        projects={projectData.going}
        title={t("PROJECT_PARTIALLY_DEVELOPED_IN_PERIOD", {period:selectedPeriod+1})}
        features={translateFeatures(selectedFeatures,locale)}
        subtitle={t("THE_PROJECTS_LISTED_BELOW_ARE_PARTIALLY_DEVELOPED_IN_THE_CURRENT_")}
      />

      <ProjectTable
        projects={projectData.shelved}
        title={t("SHELVED_PROJECTS")}
        features={translateFeatures(selectedFeatures,locale)}
        subtitle={t("THE_PROJECTS_LISTED_BELOW_HAVE_BEEN_SHELVED.")}
      /></>
     }
    </div>
    </div>

    </>  );
}

export default RndReportPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

// RndReportPage.getLayout = function getLayout(page: ReactElement) {
//     return <Layout>{page}</Layout>;
//   };
  