import Link from "next/link";
import { menuProps } from "../Section/Section";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'

export function Card({ menu,locale }: { menu: menuProps,locale?:string }) {
   
  const openNewWindow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { pathname } = menu.url;
    if (!pathname )  {
      return;
    }
    const url = `${basePath}/${locale}${menu.url.pathname}`;

    const newWindowFeatures = 'height=600,width=1200,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
    const newWindow = window.open(url, '_blank', newWindowFeatures);
    
    if (newWindow) {
      newWindow.focus();
    }
  };

  return ( 
    <div className="max-w-sm bg-gray-500 border p-2 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link 
        href={"#"}
        passHref
        legacyBehavior
      >
         <a onClick={openNewWindow} className="d-flex flex-column items-center text-center">
        <div className="grid grid-rows-6 h-52">
          <div className="row-span-5">
            <img className="rounded-t-lg object-cover w-full h-full" src={`${basePath}${menu.image}`} alt={menu.alt} />
          </div>
          <div className="inline-block align-middle">
            <h5 className="mb-2 text-md font-bold tracking-tight text-white dark:text-white">
              {menu.title}
            </h5>
          </div>
        </div>
        </a>
      </Link>
    </div>
  );
}


export function CardBasic({menu}:{menu:menuProps}) {
  return ( 
      <div
        className="max-w-sm   p-2 "
      >
        <Link
          href={menu.url}
          className="d-flex flex-column items-center text-center"
        >
          <div className="grid grid-rows-6 h-52 p-6">
          <div className="row-span-5 border border-gray-200 rounded-lg shadow">
            <img className="rounded-t-lg object-cover w-full h-full" src={`${basePath}${menu.image}`} alt={menu.alt} /></div>
          <div className="p-2">
            <h5 className="mb-2 text-ms font-bold tracking-tight text-gray dark:text-white">
              {menu.title}
            </h5>
          </div>
          </div>
        
        </Link>
      </div>
   );
}

export default Card;