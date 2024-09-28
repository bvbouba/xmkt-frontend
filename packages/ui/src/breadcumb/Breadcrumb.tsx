import Link from "next/link";
import { UrlObject } from "url";

export interface ILink {
  title: string;
  url: UrlObject;
}
export const Breadcrumb = ({ items }: { items: ILink[]}) => {
  return (
    <div className="bg-gray-500 text-white uppercase p-2">
      <ol className="flex items-center">
        {items?.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          return (
            <li key={index}>
              {isLast && <span className="mr-2">{item.title}</span>}
              {!isLast && item.url && (
                <>
                  <Link href={isFirst ? "#" : item.url} className="">
                    {item.title}
                  </Link>
                  <span className="mr-2"> {`>`} </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
