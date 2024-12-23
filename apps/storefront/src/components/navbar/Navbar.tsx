import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone,faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import MobileNav from "./mobileNav";
import DesktopNav from "./DesktopNav";
import usePaths from "@/lib/paths";

export const Navbar: React.FC = () => {
  const { t } = useTranslation("common");
  const paths = usePaths()


  return (
    <header className="py-8 lg:pt-6 lg:pb-14">
      <div
        className="container mx-auto lg:relative flex flex-col lg:flex-row
              lg:justify-between gap-y-4 lg:gap-y-0"
      >
        <div className="flex justify-center lg:justify-normal">
          <Link href={paths.$url()}>
            <img src={`/logo.svg`} alt="" />
          </Link>
        </div>
        <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0">
          <div className="flex justify-center items-center gap-x-2 lg:justify-normal">
            <FontAwesomeIcon className="text-2xl text-accent" icon={faLocationDot} />
            {"Abidjan, Cote d'Ivoire"}
          </div>
          <div className="flex justify-center items-center gap-x-2 lg:justify-normal">
            <FontAwesomeIcon className="text-2xl text-accent" icon={faPhone} />
            +225 0702 4682 53
          </div>
          <Link href={paths.$url()}>
          <button className="btn btn-sm btn-outline w-[240px] lg:w-auto mx-auto lg:mx-0">
            {t("purchase_online")}
          </button>
          </Link>
         <MobileNav  />
         <DesktopNav />
       
        </div>
      </div>
    </header>
  );
};

export default Navbar;
