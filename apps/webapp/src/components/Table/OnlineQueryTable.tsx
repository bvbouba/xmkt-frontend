import { featureProps, onlineQueryProps } from "@/lib/type";
import { useTranslation } from "next-i18next";

interface props {
    onlineQueryData:onlineQueryProps[]
    features:featureProps[]
}

export const OnlineQueryTable = ({ onlineQueryData, features }:props) => {
  const { t } = useTranslation('common')
    return (
        <div className="relative overflow-x-auto p-4">
          {onlineQueryData && onlineQueryData.length > 0 ? (
            <>
              <table className="w-full border text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-2 py-1" align="center">#</th>
                    {features.map((entry) => (
                      <th key={entry.id} scope="col" className="px-2 py-1" align="center">{entry.abbrev}</th>
                    ))}
                    <th scope="col" className="px-2 py-1" align="center">{t("Requested Base Cost ($)")}</th>
                    <th scope="col" className="px-2 py-1" align="center">{t("Requested Budget (K$)")}</th>
                    <th scope="col" className="px-2 py-1" align="center">{t("MIN_COST")} </th>
                  </tr>
                </thead>
                <tbody>
                  {onlineQueryData.map((entry, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td align="center" className="x-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {index}</td>
                      {features.map((feature) => (
                        <td key={feature.id} className="px-2 py-1"  align="center">
                          {entry[feature.surname]}
                        </td>
                      ))}
                      <td className="px-2 py-1"  align="center">{Math.round(entry.req_base_cost)}</td>
                      <td className="px-2 py-1"  align="center">{Math.round(entry.req_budget)}</td>
                      <td className="px-2 py-1"  align="center">{Math.round(entry.min_cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="f_annotation">
                {/* {pTitle.map((entry) => (
                  <span key={entry.id}>
                    {entry.abbrev} ({entry.unit}): From {entry.range_inf} To {entry.range_sup}.{' '}
                  </span>
                ))} */}
              </span>
            </>
          ) : (
            <p className="italic">{t("NO_QUERY_MADE_THIS_PERIOD")}</p>
          )}
        </div>
    );
  };