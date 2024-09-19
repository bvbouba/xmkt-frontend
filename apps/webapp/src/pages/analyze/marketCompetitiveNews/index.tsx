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

function MarketCompetitveNewsPage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session,status } = useSession()
  const selectedPeriod = session?.selectedPeriod || 0


    const paths = usePaths();
    const { t } = useTranslation('common')

    if (status === "loading") {
      return <p>Loading...</p>;
    }
  
    const industryItems = [
        { url: paths.analyze.marketCompetitiveNews.industryDashboard.$url(), image: '/images/company-dashboard-logo.png', alt: 'industry_dashboard', title: t("INDUSTRY_DASHBOARD") },
        { url: paths.analyze.marketCompetitiveNews.industryInformation.$url(), image: '/images/industry-information-logo.png', alt: 'industry_information', title: t("INDUSTRY_INFORMATION") },
        { url: paths.analyze.marketCompetitiveNews.marketReport.$url(), image: '/images/market-report-logo.png', alt: 'market_report', title: t("MARKET_REPORT") },
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
  