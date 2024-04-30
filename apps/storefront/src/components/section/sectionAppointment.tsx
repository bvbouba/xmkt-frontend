import { useTranslation } from "react-i18next";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SectionAppointment() {
    const { t } = useTranslation("common");

    return (<section className="appointment section">
      <div className="container mx-auto">
        <h2 className="appointment__title h2 mb-5 xl:mb-[50px] text-center xl:text-left">
            {t("Book or call")}:
            <span className="text-accent-tertiary">+225 0702 4682 53</span>
        </h2>
        <form className="appointment__form flex flex-col gap-y-5">
         <div className="flex flex-col xl:flex-row gap-5">
         <div className="select relative flex items-center">
            <div className="absolute right-4">
            <FontAwesomeIcon
                className="text-[20px] text-primary"
                icon={faChevronDown}
              />
            </div>
            <select className="appearance-none outline-none h-full w-full bg-transparent px-4">
                <option value={1}>{t("Select Organization Type")}</option>
                <option value={2}>{t("Academic")}</option>
                <option value={2}>{t("Corporate")}</option>
            </select>
         </div>
         <div className="select relative flex items-center">
            <div className="absolute right-4">
            <FontAwesomeIcon
                className="text-[20px] text-primary"
                icon={faChevronDown}
              />
            </div>
            <select className="appearance-none outline-none h-full w-full bg-transparent px-4">
                <option value={1}>{t("Select Area of interest")}</option>
                <option value={2}>{t("Strategy")}</option>
                <option value={2}>{t("Innovation")}</option>
                <option value={2}>{t("Targeting & Positioning")}</option>
                <option value={2}>{t("Marketing & Mix")}</option>
            </select>
         </div>
         </div>
         <div className="flex flex-col xl:flex-row gap-5">
            <input type="text" className="input" placeholder={t("First Name")}/>
            <input type="text" className="input" placeholder={t("Last Name")}/>
         </div>

         <div className="flex flex-col xl:flex-row gap-5">
            <input type="email" className="input" placeholder={t("Email")}/>
            <input type="text" className="input" placeholder={t("Phone Number")}/>
         </div>

         <button className="btn btn-lg btn-accent self-start" type="submit">
            {t("Submit")}
         </button>

        </form>
      </div>
    </section>  );
}

export default SectionAppointment;