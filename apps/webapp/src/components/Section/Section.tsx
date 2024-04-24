import usePaths from "@/lib/paths";
import { UrlObject } from "url";
import Card from "../card/Card";


export interface menuProps{
     url:UrlObject,
    image:string,
    title:string,
    alt:string
    
}

export interface sectionProps {
    menuItems:menuProps[]
    locale?:string;
}


export function Section({menuItems,locale}:sectionProps) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <Card key={index} menu={item} locale={locale} />
        ))}
      </div>
    );
  }