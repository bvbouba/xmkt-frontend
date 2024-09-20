import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {  fetchCoursesById } from "features/data";

type FormValues = {
  courseid: string;
};



export function SectionBanner() {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false)

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setError: setErrorForm,
  } = useForm<FormValues>();
  const { data: session, status } = useSession();
  
  const onSubmit = async (data: FormValues) => {
    const {
      courseid
    } = data;

      setLoading(true)
        try {
           fetchCoursesById({ courseid })
        } catch (error) {
          console.error('Error fetching course:', error);
        }finally{
          setLoading(false)
        }

    
  };
  
  return (
    <section className="hero bg-banner bg-no-repeat py-12 xl:pt-12 xl:pb-12 overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="">
          <div className="flex flex-col items-center">
            <h2 className="h2 mb-6">{t("Welcome to the simulation Store")}</h2>
            <div className="col-md-6 col-md-offset-3">
              <div className="">
                <form className="flex items-center max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative w-full">
                    <div className="items-center space-y-5 w-full">
                      <input
                      {...register("courseid", {
                        required: true,
                      })}
                        type="text"
                        className="input focus:outline-none focus:border-blue-500"
                        placeholder={t("Enter the class code")}
                      />

                      <button className="btn btn-lg btn-accent mx-auto xl:mx-0"  type="submit">
                      {loading ?  t("Searching..."):t("Search")}
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
