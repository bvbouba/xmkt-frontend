import { ReactElement } from "react";
import {StoreLayout} from "@/components/layout";
import {
  SectionBanner,
} from "@/components/section";

export default function Page(): JSX.Element {
  return (
    <>
      <SectionBanner />
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <StoreLayout>{page}</StoreLayout>;
};
