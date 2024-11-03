import { useAppSelector } from '@/lib/hooks/redux';
import { brandProps, firmProps, industryDataProps, markertingMixProps, unitMsProps, valueMsProps } from '@/lib/type';
import { formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';

interface itemProps{
    label:string, id: string, bold?:boolean, sign?:number
}

interface props {
    data:firmProps[] | brandProps[] | markertingMixProps[]| industryDataProps[] | valueMsProps[] | unitMsProps[],
    items:itemProps[],
    heads:string[] | number[],
    lookup:string,
    percent?:boolean,
    headerless?:boolean
}

export const Table = ({ data, items,heads,lookup,percent,headerless }:props) => {
  const { data: session } = useSession()
  const selectedPeriod = session?.selectedPeriod || 0
  return (
    <div className="relative overflow-x-auto">
    <table className="min-w-fit border border-0 text-xs text-right rtl:text-right text-gray-500 dark:text-gray-400">

      {!headerless && <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr className=''>
          <th scope="col" className="px-2 py-1 bg-white border border-0"></th>
          {heads.map((head,index) => (
            <th key={index} scope="col" className="px-2 py-1 border border-l">
               {(lookup === "period_id") ? `${(selectedPeriod < 4 ) ? "Period": "Per"} ${head}` : head }
            </th>
          ))}
        </tr>
      </thead>}


      <tbody>
        {items.map((item,index) => {
          return(
          <tr key={item.id} className={`bg-white border dark:bg-gray-800 dark:border-gray-700 ${(headerless && index === 0)? "font-bold" : ""}`}>
            <th scope="row" className={`px-2 py-1 text-left border font-medium ${ item.bold ? "font-bold" : ""} text-gray-900 whitespace-nowrap dark:text-white`}>
              {item.label}
            </th>
            {heads.map((head,index) => {
                let value = data.find((entry) => entry[lookup] === head)?.[item.id]
                if (value === null) return <td key={index} className='px-2 py-1'></td>
                if (typeof value ==="string") return <td key={index} className='px-2 py-1 border'>{value}</td>
                if (typeof value === 'number' && !Number.isNaN(value) && percent) {
                  return <td key={index} className='px-2 py-1'>{`${Math.round(value * 100)}%`}</td>
                }
                return(
              <td key={index} className={`border  w-20 px-2 py-1  ${ item.bold ? "font-bold" : ""}`}>
              { (item.sign === -1 && value !== 0) ? "-" : ""}{formatPrice(Math.round(value))}
              </td>
            )})}
          </tr>
        )})}
      </tbody>
    </table>
  </div>
  );
};

export interface columnProps {
  id: string;
  numeric: boolean;
  label: string;
  percent?: boolean;
}

interface propTS {
  columns:columnProps[],
  rows:{[key: string]: any;}[]
}
export const TableSimple=({columns,rows}:propTS)=>(
  <table className="w-full text-xs border text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columns.map((column,index) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={`px-2 py-1 border ${(index===0 ? "text-left pl-5" : "")}`}
                      align="center"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`bg-white border dark:bg-gray-800 dark:border-gray-700 ${
                      index === rows.length - 1 ? "font-weight-bold" : ""
                    }`}
                  >
                    {columns.map((column,index1) => (
                      <td key={column.id} className={`px-2 py-1 border ${(index1===0 ? "text-left pl-5" : "")}`} align="center">
                        {column.percent
                          ? `${Math.round(row[column.id])} %`
                          : column.numeric
                          ? row[column.id]
                          : row[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
)

export default Table;