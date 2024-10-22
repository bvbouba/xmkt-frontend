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
import { Loading } from "@/components/Loading";

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


if (session?.decisionStatus !== 1 && loading===false) {
  return <div>{t("DECISION_ROUND_NOT_ACTIVE")}</div>;
}

if (loading) {
  return <Loading />;
}

  
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
