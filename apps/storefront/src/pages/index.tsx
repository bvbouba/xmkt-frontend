import { ReactElement } from "react";
import {HomeLayout} from "@/components/layout";
import {
  SectionAppointment,
  SectionFaq,
  SectionHero,
  SectionService,
  SectionStats,
  SectionTeam,
  SectionTestimonial,
} from "@/components/section";

export default function Page(): JSX.Element {
  return (
    <>
      <SectionHero />
      <SectionStats />
      <SectionService />
      <SectionAppointment />
      <SectionTestimonial />
      <SectionTeam />
      <SectionFaq />
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
