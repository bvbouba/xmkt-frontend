import { useAppDispatch } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "features/authSlices";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

function DesktopNav() {
  const { t } = useTranslation("common");
  const paths = usePaths()
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter()

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
    <nav className="bg-white absolute w-full left-0 -bottom-[86px] shadow-custom1 h-16 rounded-[10px] hidden lg:flex
               lg:items-center lg:justify-between lg:px-[50px]">
      <ul className="flex gap-x-4">
       {menus.map((menu,idx)=>{
          if(isAuthenticated && (idx===menus.length-1 || idx===menus.length-2)) return<></>
        return(<li key={idx}>
          <Link
            href={menu.url}
            className={`border-r ${idx === menus.length - 1 ? '' : 'pr-4'} text-secondary hover:text-accent transition-all duration-300`}
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
      <label htmlFor="search-input" className="flex justify-center items-center group">
            <FontAwesomeIcon className="text-2xl text-accent" icon={faSearch} />
          </label>
          <input
            type="text"
            id="search-input"
            placeholder={`${t("search")}....`}
            className="outline-none w-[100px] focus:w-[180px] focus:border-b-2 focus:border-accent placeholder:italic
            placeholder:text-base transition-all duration-150"
          />
      </form>
    </nav>
  );
}

export default DesktopNav;
