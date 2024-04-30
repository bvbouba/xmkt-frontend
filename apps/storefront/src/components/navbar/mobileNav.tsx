import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import usePaths from "@/lib/paths";

function MobileNav() {
  const { t } = useTranslation("common");
  const paths = usePaths()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const menus = [
    {
      label:t("About"),
      url:"#"
    },
    {
      label:t("Simulations"),
      url:"#"
    },
    {
      label:t("Resources"),
      url:"#"
    },
    {
      label:t("Sign In"),
      url:paths.auth.login.$url()
    },
    {
      label:t("Register"),
      url:paths.auth.signup.$url()
    }
  ]

  return (
    <nav
      className={`mnav bg-white fixed w-[300px] top-0 h-screen ${
        isMobileNavOpen ? "left-0" : "-left-[300px]"
      } shadow-2xl lg:hidden transition-all duration-300 z-20`}
    >
      <div
        onClick={toggleMobileNav}
        className="mnav__close-btn bg-primary w-8 h-8 relative -right-full top-8 flex justify-center items-center rounded-tr-lg rounded-br-lg cursor-pointer transition-all"
      >
        <FontAwesomeIcon
          className="mnav__close-btn-icon text-2xl text-white"
          icon={isMobileNavOpen ? faAngleLeft : faAngleRight}
        />
      </div>
      <div className="px-12 flex flex-col gap-y-12 h-full">
        <Link href={paths.$url()}>
          <img src="/logo.svg" alt="" />
        </Link>
        <ul className="flex flex-col gap-y-5">
          {menus.map((menu,idx)=><li key={idx}>
            <Link
              href={menu.url}
              className="text-secondary hover:text-accent transition-all duration-300"
            >
              {menu.label}
            </Link>
          </li>)}
         
        </ul>
        <form className="relative flex gap-x-[10px]">
          <label htmlFor="mnav-search-input">
            <FontAwesomeIcon className="text-2xl text-accent" icon={faSearch} />
          </label>
          <input
            type="text"
            id="mnav-search-input"
            placeholder={t("Search....")}
            className="outline-none w-[160px] border-b-2 focus:border-b-2 focus:border-accent placeholder:italic"
          />
        </form>
      </div>
    </nav>
  );
}

export default MobileNav;
