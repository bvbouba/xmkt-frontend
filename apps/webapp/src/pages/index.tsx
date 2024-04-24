import { Layout } from "@/components/Layout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { ReactElement } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

export default function Home({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation('common')
  return (
    <h1>{t("WELCOME_TO_YOUR_APP")}</h1>
  );
}


Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
