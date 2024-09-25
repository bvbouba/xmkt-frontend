import { Layout } from "@/components/Layout";
import { CardBasic } from "@/components/card/Card";
import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};


function DecidePage({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const paths = usePaths()
    const { t } = useTranslation('common')
    const contentItems = [
        {
          url: paths.decide.teamIdentity.$url(),
          image: "/images/team-identity-logo.png",
          alt: "team_identity",
          title: t("TEAM_IDENTITY"),
        },
        {
          url: paths.decide.researchAndDevelopment.$url(),
          image: "/images/rnd-logo.png",
          alt: "research_and_d",
          title: t("RESEARCH_&_DEVELOPMENT"),
        },
        {
          url: paths.decide.brandPortofolio.$url(),
          image: "/images/brand-portofolio-logo.png",
          alt: "brand_portofolio",
          title: t("BRAND_PORTFOLIO"),
        },
        {
          url: paths.decide.marketingMix.$url(),
          image: "/images/marketing-mix-logo.png",
          alt: "marketing_mix",
          title: t("MARKETING_MIX"),
        },
        {
            url: paths.decide.commercialTeam.$url(),
            image: "/images/commercial-team-logo.png",
            alt: "commercial_team",
            title: t("COMMERCIAL_TEAM"),
          },
          {
            url: paths.decide.marketResearchStudies.$url(),
            image: "/images/market-research-studies-logo.png",
            alt: "market_research_studies",
            title: t("MARKET_RESEARCH_STUDIES"),
          },
        //   {
        //     url: paths.decide.marketingPlan.$url(),
        //     image: "/images/marketing-plan-logo.png",
        //     alt: "marketing_plan",
        //     title: "MARKETING PLAN",
        //   },
      ];

    return ( 
        <>
         
         <div className="grid grid-cols-4 gap-6">
            {contentItems.map((item,index) =><CardBasic key={index} menu={item} />)
            }
         </div>
        </>
     );
}

export default DecidePage;

DecidePage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  