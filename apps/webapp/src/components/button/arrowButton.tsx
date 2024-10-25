import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
  };


export const ArrowButton: React.FC<Props> = ({children,...props}) => {
    return (
   <>
   <button type="submit" 
   {...props}
   className="inline-block relative drop-shadow-lg bg-blue-500 text-white border-blue-300 py-2 px-3 rounded-lg  text-center font-bold  before:content-[' '] before:absolute before:z-0 before:bg-blue-500 before:border-blue-300 before:w-8 before:h-8 before:transform before:rotate-45 before:top-[5px] before:-right-[10px] before:origin-[50%] before:rounded-lg">
     <span className="pr-10 -mr-6">
     {children}
     </span>
   </button>
   </>
    )
}

export default ArrowButton;