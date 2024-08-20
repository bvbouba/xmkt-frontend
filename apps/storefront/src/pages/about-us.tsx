import { ReactElement } from "react";
import {HomeLayout} from "@/components/layout";
import {
    BannerAboutUs,
} from "@/components/section";

export default function Page(): JSX.Element {
  return (
    <>
      <BannerAboutUs />
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
