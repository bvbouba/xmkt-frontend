import { useTranslation } from "react-i18next";
import { faBriefcase,faPieChart,faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SectionService() {
  const { t } = useTranslation("common");
  const concepts = [
    {
        title:t("Brand Management"),
        description:t("Explore the intricate dynamics of brand management, understanding how to cultivate and enhance brand identity amidst competitive landscapes"),
        icon:faBriefcase
    },
    {
        title:t("Segmentation"),
        description:t("Dissect markets, identifying distinct consumer groups and tailoring strategies to meet their unique needs and preferences"),
        icon:faPieChart
    },
    {
        title:t("Positioning"),
        description:t(" Learn how to strategically position their products or services in the market to effectively differentiate themselves from competitors and resonate with their target audience"),
        icon:faBullseye
    }
  ]
  return (
    <section className="services">
      <div className="bg-services bg-cover bg-no-repeat max-w-[1466px] mx-4 xl:mx-auto
          rounded-[20px] xl:pt-[70px] px-6 xl:px-0 relative h-[368px] flex items-center
          xl:items-start -z-10">
        <div className="container mx-auto">
          <div className="services__top flex items-center flex-col xl:flex-row xl:mb-[60px]">
            <h2 className="h2 text-white flex-1 mb-4 xl:mb-0 text-center xl:text-left">
              {t("Key Concepts")}
            </h2>
            <p className="text-white flex-1 text-center xl:text-left max-w-2xl xl:max-w-none">
            Our simulation tool is designed to provide clients with a comprehensive understanding of essential business concepts 
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 xl:-mt-[144px]">
      <div className="grid xl:grid-cols-3 gap-5 px-8 xl:px-0">
        {concepts.map((concept,idx)=><div key={idx} className="services__item bg-white p-[30px] rounded-[10px] shadow-custom2 
         min-h-[288px] flex flex-col items-center text-center">
        <div className="mb-[15px]"> 
        <FontAwesomeIcon
                className="text-2xl text-accent-tertiary"
                icon={concept.icon}
              />
        </div>
        <h3 className="h3 mb-[10px]">{concept.title}</h3>
        <p className="font-light leading-normal max-w-[300px]">{concept.description}</p>
         </div>)}
      </div>

      </div>
    </section>
  );
}

export default SectionService;
