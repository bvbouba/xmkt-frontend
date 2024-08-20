import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone,faLocationDot,faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram,faTwitter,faLinkedin } from "@fortawesome/free-brands-svg-icons";
import usePaths from '@/lib/paths';

const Footer: React.FC = () => {
  const paths = usePaths()
  const { t } = useTranslation("common");

  return (
    <footer className="footer pt-12 xl:pt-[150px]">
      <div className="container mx-auto pb-12 xl:pb-[100px]">
      <div className="flex flex-col xl:flex-row gap-x-5 gap-y-10">
        <div className="footer__item flex-1">
          <Link href={paths.$url()}>
          <img className="mb-[30px]" src="/logo.svg" alt=''/>
          </Link>
          <p className="mb-[20px]">
            {t("Start transforming your courses with our simulations today. Contact us")}
          </p>
          <div className="flex flex-col gap-y-3 mb-10">
            <div className="flex items-center gap-x-[6px]">
            <FontAwesomeIcon className="text-[24px] text-accent" icon={faLocationDot} />
            <div>{"Abidjan, Cote d'Ivoire"}</div>
            </div>
            <div className="flex items-center gap-x-[6px]">
            <FontAwesomeIcon className="text-[24px] text-accent" icon={faEnvelope} />
            <div>simuprof@gmail.com</div>
            </div>
            <div className="flex items-center gap-x-[6px]">
            <FontAwesomeIcon className="text-[24px] text-accent" icon={faPhone} />
            <div>+225 0702 4682 53</div>
            </div>
          </div>

          <div className="flex gap-[14px] text-[30px]">
            <div 
            className="p-[10px] rounded-[10px] shadow-custom2 text-accent-tertiary
            hover:text-accent cursor-pointer transition-all">
                <FontAwesomeIcon className="" icon={faFacebook} />
            </div>
            <div 
            className="p-[10px] rounded-[10px] shadow-custom2 text-accent-tertiary
            hover:text-accent cursor-pointer transition-all">
                <FontAwesomeIcon className="" icon={faInstagram} />
            </div>
            <div 
            className="p-[10px] rounded-[10px] shadow-custom2 text-accent-tertiary
            hover:text-accent cursor-pointer transition-all">
                <FontAwesomeIcon className="" icon={faTwitter} />
            </div>
            <div 
            className="p-[10px] rounded-[10px] shadow-custom2 text-accent-tertiary
            hover:text-accent cursor-pointer transition-all">
                <FontAwesomeIcon className="" icon={faLinkedin} />
            </div>
          </div>
        </div>
        <div className="footer__item flex-1">
          <h4 className="h4 mb-5">{t("Quick links")}</h4>
          <div className="flex gap-x-5">
            <ul className="flex-1 flex flex-col gap-y-5">
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Home")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Simulations")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Stores")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Resources")}</a>
              </li>
            </ul>

            <ul className="flex-1 flex flex-col gap-y-5">
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Contact")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Faqs")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Privacy Policy")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all">{t("Careers")}</a>
              </li>
            </ul>

          </div>
          </div>
        {/* <div className="footer__item flex-1">{t("Resources")}</div> */}
      </div>
      </div>
      <div className="py-[30px] border-t">
        <div className="container mx-auto text-center">
           <div className="font-light text-base">&copy; 2024 Simuprof - {t("All rights reserved")}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;