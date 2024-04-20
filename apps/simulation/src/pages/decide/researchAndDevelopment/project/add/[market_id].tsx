import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { BlockHeader } from "@/components/blockHeader";
import {
  Budget,
  Characteristics,
  Description,
  FormData,
} from "@/components/wizard/project";
import { fetchDecisionStatus } from "@/lib/features/decideSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useAuth } from "@/lib/providers/AuthProvider";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useEffect, useState } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function AddProject({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useAppDispatch();
  const {participant} = useAuth()
  const {industryID  } = participant || {};
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const { t } = useTranslation('common')
  
  const handleNextStep = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if(industryID){
    dispatch(fetchDecisionStatus({industryID})); // Replace 'industryId' with the actual industry ID
    }
  }, [dispatch,industryID]);
  
  const decisionStatus  = useAppSelector((state) => state.decide.decisionStatus);
  const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);
  // if(isDecisionInProgress) return<> Decision is in Progress</>

  
  return (
    <>
     
      <BlockHeader title={t("R&D_DECISIONS")} />
        {step === 1 && <Description onNext={handleNextStep} formData={formData} />}
        {step === 2 && <Characteristics onNext={handleNextStep} onPrevious={handlePreviousStep} formData={formData} locale={locale} />}
        {step === 3 && <Budget onPrevious={handlePreviousStep} formData={formData} locale={locale} />}
    
    </>
  );
}

export default AddProject;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

AddProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
