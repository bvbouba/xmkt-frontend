import { Layout } from "@/components/Layout";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { Section } from "@/components/Section";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
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

function MarketCompetitveNewsPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const {selectedPeriod} = useAuth();

    const paths = usePaths();
    const { t } = useTranslation('common')
  
    const industryItems = [
        { url: paths.analyze.marketCompetitiveNews._period(selectedPeriod).industryDashboard.$url(), image: '/images/company-dashboard-logo.png', alt: 'industry_dashboard', title: t("INDUSTRY_DASHBOARD") },
        { url: paths.analyze.marketCompetitiveNews._period(selectedPeriod).industryInformation.$url(), image: '/images/industry-information-logo.png', alt: 'industry_information', title: t("INDUSTRY_INFORMATION") },
        { url: paths.analyze.marketCompetitiveNews._period(selectedPeriod).marketReport.$url(), image: '/images/market-report-logo.png', alt: 'market_report', title: t("MARKET_REPORT") },
        // Add more items as needed
      ];
  
    return (
        <>
        
      <Section menuItems={industryItems} locale={locale}/>
      </>
    );
  }

export default MarketCompetitveNewsPage;

MarketCompetitveNewsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  