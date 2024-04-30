// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SectionTeam() {
  const { t } = useTranslation("common");

  const teams = [
    {
      title: t("Founder"),
      fullName: "Bakayoko Vaflaly",
      img: "img/team/employee-1.jpeg",
      description:
        "Engineering background and an MBA. +15 years in tech and nonprofit sectors, expertise includes technology, marketing, and operations.",
      linkedin_link: "https://www.linkedin.com/in/vaflaly/",
    },
    {
      title: t("Associate"),
      fullName: "Damas Koulate",
      img: "img/team/employee-2.jpeg",
      description:
        "Bringing a blend of an MBA and a computer science degree, they offer 15 years of telecom management expertise.",
      linkedin_link: "linkedin.com/in/koulate-damas-mba-27087726",
    },
    
  ];

  return (
    <section className="team section">
      <div className="container mx-auto">
        <h2 className="team__title h2 mb-[50px] text-center xl:text-left">
          {t("Our Team")}
        </h2>
        <div className="team__slider swiper min-h-[400px]">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
                768: {
                  slidesPerView: 1,
                },
                960: {
                  slidesPerView: 2,
                },
              }}
          >
            {teams.map((team, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col md:flex-row gap-9">
                <div className="flex-1 flex flex-col xl:flex-row">
                  <div className="flex flex-col xl:flex-row items-center gap-[30px]">
                    <div className="flex-1">
                      <img src={team.img} alt="" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h4 className="h4 mb-[10px]">{team.fullName}</h4>
                      <div className="font-medium uppercase tracking-[2.24px] text-[#9ab4b7] mb-[20px]">
                        {team.title}
                      </div>
                      <p className="font-light mb-[26px] max-w-[320px]">
                        {team.description}
                      </p>
                      <div className="flex items-center text-[30px] gap-x-5 text-accent-tertiary">
                        <Link
                          href={team.linkedin_link}
                          className="cursor-pointer hover:text-accent transition-all"
                        >
                          <FontAwesomeIcon
                            className="text-2xl text-accent-tertiary"
                            icon={faLinkedin}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default SectionTeam;
