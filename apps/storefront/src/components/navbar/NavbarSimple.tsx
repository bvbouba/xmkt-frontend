import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import usePaths from "@/lib/paths";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { logout } from "features/data";

export const NavbarSimple: React.FC = () => {
  const { t } = useTranslation("common");
  const paths = usePaths();
  const { data: session, status } = useSession()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'

  const menus = [
    // {
    //   label: t("Home"),
    //   url: paths.$url(),
    // },
    {
      label: t("sign_in"),
      url: paths.auth.login.$url(),
    },
  ];

  const onLogout = async () => {
    if (status === "authenticated") {
      try {
        await logout(session?.accessToken)
        await signOut()
      } catch (error) {
        console.log("Couldn't logout")
      }
    }
  };

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
        <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0">
          {menus.map((menu, idx) => {
            if (status === "authenticated" && idx === menus.length - 1) return <div key={idx}></div>
            return (
              <div
                key={idx}
                className="flex justify-center items-center gap-x-2 lg:justify-normal"
              >
                <Link href={menu.url}>{menu.label}</Link>
              </div>
            )
          })}
          {status === "authenticated" && (

            <div
              className="flex justify-center items-center gap-x-2 lg:justify-normal"
            >
              <button onClick={() => onLogout()}>{t("logout")}</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarSimple;
