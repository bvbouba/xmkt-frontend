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
import { useAuth } from "@/lib/providers/AuthProvider";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useRouter } from "next/router";
import { logout } from "features/authSlices";

function MobileNav() {
  const { t } = useTranslation("common");
  const paths = usePaths()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const menus = [
    {
      label:t("about"),
      url:"#"
    },
    {
      label:t("simulations"),
      url:"#"
    },
    {
      label:t("resources"),
      url:"#"
    },
    {
      label:t("sign_in"),
      url:paths.auth.login.$url()
    },
    {
      label:t("register"),
      url:paths.auth.signup.$url()
    }
  ]

  const onLogout = () => {
    dispatch(logout());
    void router.push(paths.auth.login.$url());
  };

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
          <img src={`${basePath}/logo.svg`} alt="" />
        </Link>
        <ul className="flex flex-col gap-y-5">
          {menus.map((menu,idx)=>{
            if(isAuthenticated && (idx===menus.length-1 || idx===menus.length-2)) return<></>
            return(<li key={idx}>
            <Link
              href={menu.url}
              className="text-secondary hover:text-accent transition-all duration-300"
            >
              {menu.label}
            </Link>
          </li>)})}
          {isAuthenticated && (
        <li>
       <button className="text-secondary hover:text-accent transition-all duration-300" onClick={() => onLogout()}>{t("Logout")}</button>
        </li>)
}
        </ul>
        <form className="relative flex gap-x-[10px]">
          <label htmlFor="mnav-search-input">
            <FontAwesomeIcon className="text-2xl text-accent" icon={faSearch} />
          </label>
          <input
            type="text"
            id="mnav-search-input"
            placeholder={`${t("search")}....`}
            className="outline-none w-[160px] border-b-2 focus:border-b-2 focus:border-accent placeholder:italic"
          />
        </form>
      </div>
    </nav>
  );
}

export default MobileNav;
