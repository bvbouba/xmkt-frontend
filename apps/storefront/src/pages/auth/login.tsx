import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { AuthLayout } from "@/components/layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { login } from "features/authSlices";
import Link from "next/link";
import usePaths from "@/lib/paths";

interface FormValues {
  email: string;
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

const Page = ({ locale }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const paths = usePaths()
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { loginState } = useAppSelector((state) => state.auth);
  const { error, success, loading } = loginState;

  const {
    handleSubmit,
    register,
    formState: { errors: errorsForm },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;
    try {
      await dispatch(login({ email, password }));
    } catch (error) {
      console.error(`${t('Login error')}:`, error);
    }
  };

  if (success) router.push(paths.$url());

  return (
    <section>
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="h2 mb-5 xl:mb-[50px] text-center xl:text-left">
          {t('Log in')}
        </h2>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-4">
              <input
                {...register('email', {
                  required: true,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('Invalid email format.'),
                  },
                })}
                id="email"
                placeholder={t('Email')}
                type="text"
                className="input focus:outline-none focus:border-blue-500"
              />
              {!!errorsForm.email && (
                <p className="text-sm text-red-500 pt-2">
                  {errorsForm.email?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <input
                {...register('password', {
                  required: true,
                })}
                spellCheck={false}
                id="password"
                type="password"
                placeholder={t('Password')}
                className="input focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <button
                className="btn btn-lg btn-accent self-start"
                type="submit"
              >
                {loading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {t('Submit')}
              </button>
            </div>
            {error && (
              <div className="text-red-500">
                {t('There was an issue with the login. Please try again.')}
              </div>
            )}
            <div className="text-blue-500 underline">
              <Link href={paths.auth.signup.$url()}>
                {t('Create an account?')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
