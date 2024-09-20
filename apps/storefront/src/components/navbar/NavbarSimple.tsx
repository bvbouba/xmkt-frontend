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

  const router = useRouter()
  const menus = [
    // {
    //   label: t("Home"),
    //   url: paths.$url(),
    // },
    {
      label: t("Sign In"),
      url: paths.auth.login.$url(),
    },
  ];

  const onLogout = async () => {
    if(status ==="authenticated"){
      try {
       await logout(session?.accessToken)
       signOut()
      } catch (error) {
        console.log("Couldn't logout")
      }
     }
    void router.push(paths.auth.login.$url());
  };

  return (
    <header className="py-8 lg:pt-6 lg:pb-14">
      <div
        className="container mx-auto lg:relative flex flex-col lg:flex-row
              lg:justify-between gap-y-4 lg:gap-y-0"
      >
        <div className="flex justify-center lg:justify-normal">
          <Link href={paths.$url()}>
            <img src="/logo.svg" alt="" />
          </Link>
        </div>
        <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0">
          {menus.map((menu, idx) => {
            if(status ==="authenticated" && idx===menus.length-1) return<></>
            return(
            <div
              key={idx}
              className="flex justify-center items-center gap-x-2 lg:justify-normal"
            >
              <Link href={menu.url}>{menu.label}</Link>
            </div>
          )})}
          {status ==="authenticated" && (
       
             <div
             className="flex justify-center items-center gap-x-2 lg:justify-normal"
           >
             <button onClick={() => onLogout()}>{t("Logout")}</button>
           </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarSimple;
