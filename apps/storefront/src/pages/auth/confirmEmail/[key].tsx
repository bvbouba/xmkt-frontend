import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import usePaths from "@/lib/paths";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { AuthLayout } from "@/components/layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { confirmEmail, login } from "features/authSlices";
import Link from "next/link";


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
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');
  const {confirmState, message} = useAppSelector((state) => state.auth);
  const paths = usePaths()
  const { loading, error, success } = confirmState;
  const key = Array.isArray(router.query.key) ? router.query.key[0] : router.query.key;

  useEffect(() => {
    if (key) {
      dispatch(confirmEmail({ key }));
    }
  }, [dispatch, key]);

  return (
    <section className="container mx-auto p-4">
      {error && (
        <div className="text-red-800 px-4 py-2 mb-4 rounded">
          {t("The link is invalid.")}
        </div>
      )}
      {!error && message && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">
          {message.detail}
         <Link href={paths.auth.login.$url()}> <p className="mt-2">Please login.</p></Link>
        </div>
      )}
    </section>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
