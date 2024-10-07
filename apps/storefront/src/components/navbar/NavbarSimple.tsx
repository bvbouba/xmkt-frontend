import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import usePaths from "@/lib/paths";
import { signOut, useSession } from "next-auth/react";
import { logout } from "features/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBook } from "@fortawesome/free-solid-svg-icons";

export const NavbarSimple: React.FC = () => {
  const { t } = useTranslation("common");
  const paths = usePaths();
  const { data: session, status } = useSession();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/store";

  const menus = [
    {
      label: t("sign_in"),
      url: paths.auth.login.$url(),
    },
  ];

  const onLogout = async () => {
    if (status === "authenticated") {
      try {
        await logout(session?.accessToken);
        await signOut();
      } catch (error) {
        console.log("Couldn't logout");
      }
    }
  };

  return (
    <header className="py-8 lg:pt-6 lg:pb-14">
      <div
        className="container mx-auto lg:relative flex flex-col lg:flex-row
              lg:justify-between gap-y-4 lg:gap-y-0"
      >
        {/* Logo Section */}
        <div className="flex justify-center lg:justify-normal">
          <Link href={paths.$url()}>
            <img src={`${basePath}/logo.svg`} alt="Logo" />
          </Link>
        </div>

        {/* Menu and Actions Section */}
        <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0">
          {menus.map((menu, idx) => {
            if (status === "authenticated" && idx === menus.length - 1)
              return <div key={idx}></div>;
            return (
              <div
                key={idx}
                className="flex justify-center items-center gap-x-2 lg:justify-normal"
              >
                <Link href={menu.url}>{menu.label}</Link>
              </div>
            );
          })}

          {/* Show "My Courses" link and Logout button only when authenticated */}
          {status === "authenticated" && (
            <div className="flex items-center space-x-6">
              {/* My Courses Link */}
              <div className="flex justify-center items-center gap-x-2 lg:justify-normal">
                <Link href={"/my-courses"} className="text-gray-700 hover:text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faBook} className="h-5 w-5 me-2" />
                    {t("my_courses")}
                  
                </Link>
              </div>

              {/* Logout Button with Icon */}
              <div className="flex justify-center items-center gap-x-2 lg:justify-normal">
                <button
                  onClick={onLogout}
                  className="text-gray-700 hover:text-gray-900 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="h-5 w-5 me-2"
                  />
                  {t("logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarSimple;
