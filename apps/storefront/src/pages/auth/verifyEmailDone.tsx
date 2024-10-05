import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
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
    const paths = usePaths()
  
    return ( 
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("you_have_been_registered_succesfully")}</h3>
      <Link href={paths.auth.login.$url()}>
        <a className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
          {t("return_to_login")}
        </a>
      </Link>
    </div>
    );
  }
export default Page;