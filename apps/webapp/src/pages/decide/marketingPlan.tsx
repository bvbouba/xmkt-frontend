import { Layout } from "@/components/Layout";
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

  
function MarketingPlan({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { t } = useTranslation('common')
    return ( 
        <div>
       {t("MARKETING_PLAN")}
        </div>
     );
}

export default MarketingPlan;

MarketingPlan.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  