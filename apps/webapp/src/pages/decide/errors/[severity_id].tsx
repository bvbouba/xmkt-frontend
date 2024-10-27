import { BlockHeader } from "@/components/blockHeader";
import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";
import Title from "@/components/title";
import { getErrorLogByTeam } from "features/data";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { ErrorLog } from "types";

export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || 'fr';
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        locale,
      },
    };
  };

  
function Page({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session, status } = useSession()
  const [errors, setErrors] = useState<ErrorLog[]>([]);
const { t } = useTranslation('common')
const [modalContent, setModalContent] = useState<ErrorLog[]>([]);
const router = useRouter();
const { severity_id } = router.query;
const id = typeof severity_id === 'string' ? parseInt(severity_id, 10) : null;
const [loading,setLoading] = useState(true)


useEffect(()=>{
    if ( status === "authenticated" && session.teamID) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const errorData = await getErrorLogByTeam({
            teamId: session.teamID,
            token: session.accessToken,
            period: session.activePeriod
          });
          setErrors(errorData.filter((error: any) => error.severity === id)
        );
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setLoading(false)
      }
      fetchData();
    }

  }, [status,session?.teamID,session?.accessToken,session?.activePeriod])

  if (status === "loading" || loading) {
    return <Loading />;
  }
  
 
  return ( 
        
        <>
      <Title pageTitle={`${t("DECISION")} ${id===1 ? t("ERRORS"): t("WARNINGS")} `} />
      <div className="">
        <div className="container mx-auto">
          <BlockHeader title={`${t("DECISION")} ${id===1 ? t("ERRORS"): t("WARNINGS")} - ${t("PERIOD")} ${session?.activePeriod}`}  />
          <div className="grid gap-7">

          <div className='text-sm'>
            {t("INFORMATION_ABOUT_ERROR_MESSAGES")}
          </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-500">
          
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("TITLE")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("CONTENT")}
                </th>
              </tr>
            </thead>
            <tbody>
              {errors.map((item, index) => {
                const content = (locale === "fr") ? item.content_fr : item.content
                const title = (locale === "fr") ? item.title_fr : item.title
                const message = content.replace("<brand>", item.brand_name)
                return (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {title}
                    </td>
                    <td className="px-6 py-4">
                      {message}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
            
          </div>
        </div>
      </div>
    </>
     );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});


export default Page;

