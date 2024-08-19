import { useTranslation } from "next-i18next";
import { ParagraphContainer } from "../container";
import { formatPrice, lowercase } from '@/lib/utils';
import { featureProps, projectProps } from "@/lib/type";

interface props {
    projects?:projectProps[]
    title:string,
    subtitle:string,
    features?:featureProps[]
}


export const ProjectTable = ({ projects, title, subtitle,features }:props) => {
  const { t } = useTranslation('common')
    return (
      <div className="pt-5">
        <ParagraphContainer title={title} content={subtitle}/>
  
       {(projects && projects?.length > 0) ? <div className="relative overflow-x-auto p-5">
            <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-1"> </th>
                  <th scope="col" className="px-2 py-1" rowSpan={2} align="center">
                    {t("AVAILABLE_SINCE")}
                  </th>
                  <th scope="col" className="px-2 py-1" colSpan={5} align="center">
                    {t("PHYSICAL_CHARACTERISTICS")}
                  </th>
                  <th scope="col" className="px-2 py-1" colSpan={2} align="center">
                    {t("BASE_COST")}
                  </th>
                  <th scope="col" className="px-2 py-1" rowSpan={2} align="center">
                    {t("CUMULATIVE_BUDGET")}
                  </th>
                  
                </tr>
                <tr>
                  <th scope="col"> </th>
                  {features?.map((feature) => (
                    <th key={feature.id} scope="col" className="px-2 py-1" align="center">
                      {feature.abbrev}
                    </th>
                  ))}
                  <th scope="col" className="px-2 py-1" align="center"> {t("CURRENT")} </th>
                  <th scope="col" className="px-2 py-1" align="center"> {t("MINIMUM")} </th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td scope="row" align="center" className="x-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {entry.name}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.ready_period}
                    </td>
                    {features?.map((feature) => (
                      <td key={feature.id} className="px-2 py-1" align="center">
                        {entry[feature.surname]}
                      </td>
                    ))}
                    <td className="px-2 py-1" align="center">
                      {entry.base_cost}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {entry.min_cost}
                    </td>
                    <td className="px-2 py-1" align="center">
                      {formatPrice(entry.accumulated_budget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          <span className="f_annotation text-xs">
              {features?.map((feature) => (
                <span className="pr-5" key={feature.id}>
                  {feature.abbrev} ({feature.unit}): {t("FROM")} {feature.range_inf} {lowercase(t("TO"))} {feature.range_sup}.
                </span>
              ))}
            </span> 
          </div> : 
          <div className="p-5 italic"> {t("YOU_HAVE_NO_PROJECT_COMPLETED_THIS_PERIOD")}</div>}
        </div>
    );
  };