import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
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
  const paths = usePaths();
  const { t } = useTranslation('common')
  const { data: session,status } = useSession()
  const selectedPeriod = session?.selectedPeriod || 0

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  const companyItems = [
    {
      url: paths.analyze.companyResults.companyDashboard.$url(),
      image: "/images/company-dashboard-logo.png",
      alt: "company_dashboard",
      title: t("COMPANY_DASHBOARD"),
    },
    {
      url: paths.analyze.companyResults.financialReport.$url(),
      image: "/images/financial-report-logo.png",
      alt: "financial_report",
      title: t("FINANCIAL_REPORT"),
    },
    {
      url: paths.analyze.companyResults.productionReport.$url(),
      image: "/images/production-report-logo.png",
      alt: "product_report",
      title: t("PRODUCTION_REPORT"),
    },
    {
      url: paths.analyze.companyResults.rndReport.$url(),
      image: "/images/rnd-report-logo.png",
      alt: "rnd_report",
      title: t("R&D_REPORT"),
    },
    {
      url: paths.analyze.companyResults.decisionReview.$url(),
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
