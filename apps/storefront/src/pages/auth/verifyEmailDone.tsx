import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || "fr";
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        locale,
      },
    };
  };
  
  const Page = (
    { locale }: InferGetStaticPropsType<typeof getStaticProps>
  ) => {    
    const { t } = useTranslation("common");

    return ( 
        // <h3>{t("An email has been sent with instructions to verify your email")}</h3>
        <h3>{t("you_have_been_registered_succesfully")}</h3>
     );
}

export default Page;