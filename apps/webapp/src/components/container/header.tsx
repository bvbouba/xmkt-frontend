import { useTranslation } from "next-i18next";
import { BlockHeader } from "../blockHeader";

export function HeaderContainer({title,content,period,teamName}:{title?:string,content?:string,period?:number,teamName?:string}) {
  const { t } = useTranslation('common')

  return (
        <>
        <BlockHeader title={`${title} ${teamName ? `- ${t("FIRM")} ${teamName}`:""} ${period!==undefined ? `- ${t("PERIOD")} ${period}`:""}`}/>
        <span className="g-comment">
        <p className="text-sm text-slate-500 ">
          {content}
        </p>
      </span>
        </>
    )
}

export default HeaderContainer;