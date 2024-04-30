import { useTranslation } from "react-i18next";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollReveal from "scrollreveal";
import { useEffect } from "react";


export function SectionHero() {
  const { t } = useTranslation("common");
  


  return (
    <section className="hero bg-grey py-12 xl:pt-12 xl:pb-12 overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between h-full">
          <div className="hero__text xl:w-[48%] text-center xl:text-left">
            <div className="flex items-center bg-white py-[10px] px-[20px] w-max gap-x-2 mb-[26px] rounded-full mx-auto xl:mx-0">
              <FontAwesomeIcon
                className="text-2xl text-accent"
                icon={faSmile}
              />
              <div className="uppercase text-base font-medium text-[#9ab4b7] tracking-[2.24px]">
                {t("Practice with no risk")}
              </div>
            </div>
            <h1 className="h1 mb-6">
              {t("Marketing Strategy with our simulation tool")}
            </h1>
            <p className="mb-[42px] md:max-w-xl">
              {t("Our simulation software offers students and professionals a risk-free platform to test strategic theories and make decisions.")}</p>
            <button className="btn btn-lg btn-accent mx-auto xl:mx-0">{t("Contact Us")}</button>
          </div>
          <div className="hero__img hidden xl:flex max-w-[814px] self-end">
            <img src="hero/img5.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionHero;
