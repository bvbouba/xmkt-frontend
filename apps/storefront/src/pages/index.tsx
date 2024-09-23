import { ReactElement, useEffect, useState } from "react";
import {StoreLayout} from "@/components/layout";
import {
  SectionBanner,
  SectionCourseDetail,
} from "@/components/section";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || "en";
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      locale,
    },
  };
};

export default function Page({
  locale,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
 

  return (
    <>
      <SectionCourseDetail />
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <StoreLayout>{page}</StoreLayout>;
};
