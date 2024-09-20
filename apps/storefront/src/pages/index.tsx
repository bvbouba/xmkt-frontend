import { ReactElement } from "react";
import {StoreLayout} from "@/components/layout";
import {
  SectionBanner,
  SectionCourseDetail,
} from "@/components/section";

export default function Page(): JSX.Element {
  return (
    <>
      <SectionCourseDetail />
      
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <StoreLayout>{page}</StoreLayout>;
};
