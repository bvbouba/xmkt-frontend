import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import usePaths from "@/lib/paths";
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";

interface FormValues {
  teamName: string;
  industryName: string;
  password: string;
}


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
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

  const {
    handleSubmit,
    register,
    formState: { errors: errorsForm },
    setValue,
  } = useForm<FormValues>();


  
  const onSubmit = (data: FormValues) => {
  
  };

 

  return (
    <div className="container mx-auto mt-8">
      <h5 className="text-2xl font-bold mb-4">{t("LOG_IN")} </h5>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-4">
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
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600 inline-flex items-center"
              type="button"
            >
              
            
            </button>
            </div>
           
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("TEAM")}
            </label>
            <input
              {...register("teamName")}
              id="team"
              placeholder=""
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("INDUSTRY")}
            </label>
            <input
              {...register("industryName")}
              id="industry"
              placeholder=""
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
          </div>
          <div className="mb-4">
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
          <div className="mb-4"> 
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              type="submit"
            >
       
            </button>
          </div>
       
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
