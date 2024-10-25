import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import usePaths from "@/lib/paths";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { loadInfo } from "features/data";
import { Participant } from "types";
import {  getSession, signIn, useSession } from "next-auth/react";
import { ArrowButton } from "@/components/button";

interface FormValues {
  teamName: string;
  industryName: string;
  password: string;
}


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'fr';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

const LoginPage = ({ locale }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [pak, setPak] = useState("");
  const router = useRouter(); // Next.js useRouter hook for navigation
  const paths = usePaths()
  const { t } = useTranslation('common')
  const [errors,setErrors] = useState("")
  const [loading,setLoading] = useState(false)
  const [errors1,setErrors1] = useState("")
  const [loading1,setLoading1] = useState(false)
  const basePath=process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'

  const {
    handleSubmit,
    register,
    setValue,
  } = useForm<FormValues>();


  const [participantData, setParticipantData] = useState<Participant>()
  

  const onSubmit = async (data: FormValues) => {
    const { password } = data;  
    setLoading1(true)
    const result = await signIn("credentials", {
        redirect: false,
        pak,
        teamID:participantData?.team,
        userID:participantData?.user,
        password,
      });
      setLoading1(false)
      if (result?.ok) {
        router.push(paths.$url());
      } else {
        setErrors1(t("INVALID_CREDENTIALS"));
      }
  };

  useEffect(() => {
    const teamName = participantData?.team_name
    const industryName = participantData?.industry_name
    if (teamName!== undefined && teamName) {
      setValue('teamName', teamName);
    }
    if (industryName !== undefined && industryName) {
      setValue('industryName', industryName);
    }

  }, [participantData]);

  const handleSubmit1 = async()=>{
     if(pak){
      setLoading(true)
      try {
        const response = await loadInfo({pak})
        setParticipantData(response)
        setErrors("")
      } catch (error) {
        setErrors(t("COULD_NOT_COLLECT_INFO"))
      }
      setLoading(false)
        
     }
  }

  return (
    <div className="container mx-auto mt-2">
  
      <div className="flex justify-center mb-5">
        <img src={`${basePath}/logo.svg`}  alt="Logo" className="h-12 w-auto" />
      </div>
      <h5 className="text-2xl flex justify-center font-bold mb-4 uppercase">{t("READY_TO_START")}</h5>

      <form className="max-w-md mx-auto border border-gray-300 p-7" onSubmit={handleSubmit(onSubmit)}>
        <div>
        <div className="mb-7">
          {t("FILL_IN_LOGIN_INFORMATION")}.
        </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="pak"
            >
              {t("PAK")}
            </label>
            <div className="flex flex-row">
            <input
              type="text"
              value={pak}
              onChange={(e) => setPak(e.target.value)}
              id="pak"
              placeholder={t("ENTER_PAK")}
              className="border border-gray-300 px-3 py-2 mr-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            <ArrowButton
              onClick={() => handleSubmit1()}
            >
              {loading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                :
            t("OK")
              }
            </ArrowButton>
            </div>
            {errors && (
                  <p className="text-sm text-red-500 pt-2">{errors}</p>
                )}
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("TEAM")}
            </label>
            <input
              {...register("teamName")}
              defaultValue={participantData?.team_name}
              id="team"
              placeholder=""
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("INDUSTRY")}
            </label>
            <input
              {...register("industryName")}
              defaultValue={participantData?.industry_name}
              id="industry"
              placeholder=""
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("PASSWORD")}
            </label>
            <input
              {...register("password", {
                required: true,
              })}
              spellCheck={false}
              id="password"
              type="password"
              placeholder=""
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className=""> 
            <ArrowButton
              type="submit"
            >
              {loading1 ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                : ""
              }
              {t("ACCESS_YOUR_TEAM")}
            </ArrowButton>
          </div>
          {errors1 && (
                  <p className="text-sm text-red-500 pt-2">{errors1}</p>
                )}
          
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
