import React, { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { AuthLayout } from "@/components/layout";
import axios from "axios";

type FormValues = {
  email: string;
  password1: string;
  password2: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Additional field for instructors
  jobTitle?: string; // Additional field for instructors
  school?: string; // Additional field for instructors
};


export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};

const Page = ({ locale }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation('common')
  const [choice, setChoice] = useState<string>();
  const [school,schoolSet] = useState([])
  const [functions,functionSet] = useState([])

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<FormValues>();

  useEffect(()=>{

    axios.get('http://127.0.0.1:8000/api/school/').then(res => {
      schoolSet(res.data)
                })
    axios.get('http://127.0.0.1:8000/api/function/').then(res => {
       functionSet(res.data)
                })
       },[])
  console.log(school)
  const watchPassword = watch("password1", "");

  const validatePasswordMatch = (value: string) => {
    return value === watchPassword || t("PASSWORDS_DO_NOT_MATCH");
  };

  const onSubmit = (data: FormValues) => {
   
  };

  return (
    <section>
     <div className="container mx-auto flex flex-col items-center">
    <h2 className="h2 mb-5 xl:mb-[50px] text-center xl:text-left">{t("Sign Up")}</h2>

     {/* Select input to pick if the user is an instructor or a student */}
     <div className="mb-4">
      <label
       className="block text-gray-700 text-sm font-bold mb-2"
      >{t("You are")}</label>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className="input"
          >
            <option value={""}>{t('Please select...')}</option>
            <option value={"1"}>{t('Student')}</option>
            <option value={"2"}>{t('Instructor')}</option>
          </select>
        </div>

     {( choice==="1" || choice==="2") &&
     <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-4">
            <input
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("INVALID_EMAIL_FORMAT"),
                },
              })}
              id="email"
              placeholder={t("Email")}
              type="text"
              className="input"
            />
            {!!errorsForm.email && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.email?.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("password1", {
                required: true,
              })}
              spellCheck={false}
              id="password1"
              placeholder={t("Password")}
              type="password"
              className="input"
            />
            {!!errorsForm.password1 && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.password1?.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("password2", {
                required: true,
                validate: validatePasswordMatch,
              })}
              spellCheck={false}
              id="password2"
              type="password"
              placeholder={t("Confirm Password")}
              className="input"
            />
            {!!errorsForm.password2 && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.password2?.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("firstName", {
                required: true,
              })}
              id="firstname"
              placeholder={t("Firstname")}
              type="text"
              className="input"
            />
            {!!errorsForm.firstName && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.firstName?.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("lastName", {
                required: true,
              })}
              id="lastname"
              placeholder={t("Lastname")}
              type="text"
              className="input"
            />
            {!!errorsForm.lastName && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.lastName?.message}
              </p>
            )}
          </div>

          {/* Additional fields for instructors */}
          {choice==="2" && (
              <>
                <div className="mb-4">
                  <input
                    {...register('phoneNumber')} // You can add validation rules as needed
                    id="phoneNumber"
                    placeholder={t('Phone Number')}
                    type="text"
                    className="input"
                  />
                  {/* Add error handling for phone number field if needed */}
                </div>
                <div className="mb-4">
                  <input
                    {...register('jobTitle')}
                    id="jobTitle"
                    placeholder={t('Job Title')}
                    type="text"
                    className="input"
                  />
                  {/* Add error handling for job title field if needed */}
                </div>
                <div className="mb-4">
                  <input
                    {...register('school')}
                    id="school"
                    placeholder={t('School')}
                    type="text"
                    className="input"
                  />
                  {/* Add error handling for school field if needed */}
                </div>
              </>
            )}

          <div className="mb-4">
            <button
              className="btn btn-lg btn-accent self-start" 
              type="submit"
            >
             {t("Sign Up")}
            </button>
          </div>
        </div>
      </form>}
    </div>
    </section>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};



