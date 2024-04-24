import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { RegionProvider } from "@/lib/providers/RegionProvider";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

function CompanyResultsPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const {selectedPeriod} = useAuth();
  const paths = usePaths();
  const { t } = useTranslation('common')
  
  const companyItems = [
    {
      url: paths.analyze.companyResults._period(selectedPeriod).companyDashboard.$url(),
      image: "/images/company-dashboard-logo.png",
      alt: "company_dashboard",
      title: t("COMPANY_DASHBOARD"),
    },
    {
      url: paths.analyze.companyResults._period(selectedPeriod).financialReport.$url(),
      image: "/images/financial-report-logo.png",
      alt: "financial_report",
      title: t("FINANCIAL_REPORT"),
    },
    {
      url: paths.analyze.companyResults._period(selectedPeriod).productionReport.$url(),
      image: "/images/production-report-logo.png",
      alt: "product_report",
      title: t("PRODUCTION_REPORT"),
    },
    {
      url: paths.analyze.companyResults._period(selectedPeriod).rndReport.$url(),
      image: "/images/rnd-report-logo.png",
      alt: "rnd_report",
      title: t("R&D_REPORT"),
    },
    {
      url: paths.analyze.companyResults._period(selectedPeriod).decisionReview.$url(),
      image: "/images/decision-review-logo.png",
      alt: "decision_review",
      title: t("DECISION_REVIEW"),
    },
  ];


  return (
    <>
    <Section menuItems={companyItems} locale={locale}/>
    </>
  );
}

export default CompanyResultsPage;

CompanyResultsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
