import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?:string 
  };

export const ButtonNext: React.FC<Props> = ({ children,className,...props}) => {
    return ( 

        <button
      type="button"
      {...props}
      className={className ? className : "text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"}
    >
      {children}
     {" →"}
    </button>

     );
}

export const ButtonPrev: React.FC<Props> = ({ children,className,...props}) => {
  return ( 

      <button
    type="button"
    {...props}
    className={className ? className : "text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"}
  >
      {"← "}
    {children}
  </button>

   );
}


export default ButtonNext;