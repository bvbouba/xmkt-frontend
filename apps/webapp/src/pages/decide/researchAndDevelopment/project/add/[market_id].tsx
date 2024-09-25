import { Layout } from "@/components/Layout";
import { BlockHeader } from "@/components/blockHeader";
import {
  Budget,
  Characteristics,
  Description,
  FormData,
} from "@/components/wizard/project";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { decideStatusProps } from "@/lib/type";
import { fetchDecisionStatus } from "features/data";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

function AddProject({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession();
const { industryID } = session || {};
const [step, setStep] = useState<number>(1);
const [formData, setFormData] = useState<Partial<FormData>>({});
const { t } = useTranslation('common');
const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
const [loading, setLoading] = useState(false);

// Function to handle the next step
const handleNextStep = (data: Partial<FormData>) => {
  setFormData({ ...formData, ...data });
  setStep(step + 1);
};

// Function to handle the previous step
const handlePreviousStep = () => {
  setStep(step - 1);
};

// Fetch decision status based on industryID when the session is authenticated
useEffect(() => {
  if (status === 'authenticated' && industryID) {
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

// Check if a decision is in progress
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
