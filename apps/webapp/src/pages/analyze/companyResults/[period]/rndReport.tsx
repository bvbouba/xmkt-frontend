import { Loading } from "@/components/Loading";
import { ProjectTable } from "@/components/Table";
import { HeaderContainer } from "@/components/container";
import { getFeaturesData, getProjectData } from "@/lib/features/analyzeSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useAuth } from "@/lib/providers/AuthProvider";
import { translateFeatures } from "@/lib/utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {  useEffect } from "react";

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
  const router = useRouter()
  const { period } = router.query as { period: string};
  const selectedPeriod = parseInt(period)
  const {participant} = useAuth();
  const dispatch = useAppDispatch();
  const { teamName, industryID, firmID } = participant || {};
    const { t } = useTranslation('common')

    useEffect(() => {
        // Dispatch actions to get firm and brand data when the component mounts
        if (firmID && industryID) {
          dispatch(getProjectData({ industryID, firmID,period:selectedPeriod }));
          dispatch(getFeaturesData());
        }
      }, [dispatch,selectedPeriod,firmID,industryID]);
    
  const {data:projectData, loading:ploading} = useAppSelector((state) => state.analyze.projects);
  const {data:featureData, loading:floading} = useAppSelector((state) => state.analyze.features);

  const selectedFeatures = featureData?.filter(feature=>['feature_1','feature_2',
  'feature_3','feature_4','feature_5'].includes(feature.surname))

  const title = t("R&D_REPORT_-_FIRM", {teamName,selectedPeriod})

    return (<>
    
        
    <div>
    <div className="container mx-auto">

      <HeaderContainer title={title} content={`${t("THIS_REPORT_PROVIDES_INFORMATION_ON_THE_ACTIVITIES_CONDUCTED_FOR_")} ${selectedPeriod}`}/>
      {
      ploading && floading ? <Loading />:
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
  