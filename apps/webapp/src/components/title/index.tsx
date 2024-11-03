import { useTranslation } from "next-i18next";
import Head from "next/head";

export const Title = ({pageTitle,period}:{pageTitle:string,period?:number}) => {
const { t } = useTranslation('common')

return (
<Head>
<title>{` ${pageTitle} ${period!==undefined ? `- ${t('PERIOD')} ${period}` : ""} | ${t('APP_TITLE')} `}</title>
</Head>)}

export default Title;
    