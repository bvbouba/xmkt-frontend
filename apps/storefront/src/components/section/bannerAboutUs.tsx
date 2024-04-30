import { useTranslation } from "react-i18next";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export function BannerAboutUs() {
  const { t } = useTranslation("common");
  


  return (
    <section className="hero bg-grey py-12 xl:pt-12 xl:pb-12 overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between h-full">
          <div className="hero__text xl:w-[48%] text-center xl:text-left">
       
            <h1 className="h1 mb-6">
              {t("About Us")}
            </h1>
    
          </div>
    
        </div>
      </div>
    </section>
  );
}

export default BannerAboutUs;
