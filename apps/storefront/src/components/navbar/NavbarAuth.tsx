import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import usePaths from "@/lib/paths";

export const NavbarAuth: React.FC = () => {
  const { t } = useTranslation("common");
  const paths = usePaths();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'

  return (
    <header className="py-8 lg:pt-6 lg:pb-14">
      <div
        className="container mx-auto lg:relative flex flex-col lg:flex-row
              lg:justify-between gap-y-4 lg:gap-y-0"
      >
        <div className="flex justify-center lg:justify-normal">
          <Link href={paths.$url()}>
            <img src={`${basePath}/logo.svg`} alt="" />
          </Link>
        </div>
   
      </div>
    </header>
  );
};

export default NavbarAuth;
