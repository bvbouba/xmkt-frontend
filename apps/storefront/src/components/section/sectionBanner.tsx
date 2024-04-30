import { useTranslation } from "react-i18next";


export function SectionBanner() {
  const { t } = useTranslation("common");

  return (
    <section className="hero bg-banner py-12 xl:pt-12 xl:pb-12 overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="">
          <div className="flex flex-col items-center">
            <h2 className="h2 mb-6">{t("Welcome to the simulation Store")}</h2>
            <div className="col-md-6 col-md-offset-3">
              <div className="">
                <form className="flex items-center max-w-sm mx-auto">
                  <div className="relative w-full">
                    <div className="items-center space-y-5">
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-96 ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 
                        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        name="input_value"
                        placeholder={t("Enter the class code (eg. 57AB832E).")}
                      />

                      <button className="btn btn-lg btn-accent mx-auto xl:mx-0">
                        {t("Enter")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionBanner;
