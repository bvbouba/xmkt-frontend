import usePaths from "@/lib/paths";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { Breadcrumb, ILink } from "../breadcumb/Breadcrumb";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";

export const NavBar: React.FC = () => {
  const router = useRouter();
  const paths = usePaths();
  const { t } = useTranslation('common')
  const { data: session, update } = useSession()
  const {activePeriod} = session || {}
  const selectedPeriod = session?.selectedPeriod
  
 
  useEffect(() => {
    if (!session?.selectedPeriod && typeof activePeriod === "number") {
      update({
        ...session,
        selectedPeriod: activePeriod - 1, // Set to activePeriod - 1
      });
    }
  }, [session, activePeriod, update]);

  
  const menuItems = [
    {
      id: 1,
      label: t("COMPANY_RESULTS"),
      url: paths.analyze.companyResults.$url(),
    },
    {
      id: 2,
      label: t("MARKET_&_COMPETITIVE_NEWS"),
      url: paths.analyze.marketCompetitiveNews.$url(),
    },
    {
      id: 3,
      label: t("MARKET_RESEARCH"),
      url: paths.analyze.marketResearch.$url(),
    },
    // {
    //   id: 4,
    //   label: "tools",
    //   url: paths.analyze.tools.$url(),
    // },
  ];
  const submenuItems = [
    {
      url: paths.analyze.companyResults.companyDashboard.$url(),
      label: t("COMPANY_DASHBOARD"),
    },
    {
      url: paths.analyze.companyResults.financialReport.$url(),
      label: t("FINANCIAL_REPORT"),
    },
    {
      url: paths.analyze.companyResults.productionReport.$url(),
      label: t("PRODUCTION_REPORT"),
    },
    {
      url: paths.analyze.companyResults.rndReport.$url(),
      label: t("R&D_REPORT"),
    },
    {
      url: paths.analyze.companyResults.decisionReview.$url(),
      label: t("DECISION_REVIEW"),
    },
    {
      url: paths.analyze.marketCompetitiveNews.industryDashboard.$url(),
      label: t("INDUSTRY_DASHBOARD"),
    },
    {
      url: paths.analyze.marketCompetitiveNews.industryInformation.$url(),
      label: t("INDUSTRY_INFORMATION"),
    },
    {
      url: paths.analyze.marketCompetitiveNews.marketReport.$url(),
      label: t("MARKET_REPORT"),
    },
    {
      url: paths.analyze.marketResearch.industryBenchmarking.$url(),
      label: t("INDUSTRY_BENCHMARKING"),
    },
    {
      url: paths.analyze.marketResearch.consumerSurvey.$url(),
      label: t("CONSUMER_SURVEY"),
    },
    {
      url: paths.analyze.marketResearch.consumerPanel.$url(),
      label: t("CONSUMER_PANEL"),
    },
    {
      url: paths.analyze.marketResearch.distributionPanel.$url(),
      label: t("DISTRIBUTION_PANEL"),
    },
    {
      url: paths.analyze.marketResearch.semanticScales.$url(),
      label: t("SEMANTIC_SCALES"),
    },
    {
      url: paths.analyze.marketResearch.multidimensionalScaling.$url(),
      label: t("MULTIDIMENSIONAL_SCALING"),
    },
    {
      url: paths.analyze.marketResearch.competitiveAds.$url(),
      label: t("COMPETITIVE_ADVERSTISING_AND_COMMERCIAL_TEAM_ESTIMATES"),
    },
    {
      url: paths.analyze.marketResearch.marketForecast.$url(),
      label: t("MARKET_FORCAST"),
    },
    {
      url: paths.analyze.marketResearch.conjointAnalysis.$url(),
      label: t("CONJOINT_ANALYSIS"),
    },

    {
      url: paths.decide.teamIdentity.$url(),
      label: t("TEAM_IDENTITY"),
    },
    {
      url: paths.decide.researchAndDevelopment.$url(),
      label: t("RESEARCH_&_DEVELOPMENT"),
    },
    {
      url: paths.decide.brandPortofolio.$url(),
      label: t("BRAND_PORTFOLIO"),
    },
    {
      url: paths.decide.marketingMix.$url(),
      label: t("MARKETING_MIX"),
    },
    {
        url: paths.decide.commercialTeam.$url(),
        label: t("COMMERCIAL_TEAM"),
      },
      {
        url: paths.decide.marketResearchStudies.$url(),
        label: t("MARKET_RESEARCH_STUDIES"),
      },
  ];

  const periods = Array.from(Array(activePeriod || 0).keys())

  const pageHeader = useMemo(() => {
    const breadcrumb: ILink[] = [];
    if (router.pathname.includes("/analyze")) {
      breadcrumb.push({
        title: t("ANALYZE"),
        url: paths.analyze.companyResults.$url(),
      });
    } else if (router.pathname.includes(paths.decide.$url().pathname)) {
      breadcrumb.push({ title: t("DECIDE"), url: paths.decide.$url() });
      breadcrumb.push({ title: t("HOME"), url: paths.decide.$url() });
    }
    menuItems.map((menu) => {
      if (router.pathname.includes(menu.url.pathname)) {
        breadcrumb.push({ title: menu.label, url: menu.url });
      }
    });

    submenuItems.map((menu) => {
      if (router.pathname.includes(menu.url.pathname)) {
        breadcrumb.push({ title: menu.label, url: menu.url });
      }
    });

    return <Breadcrumb items={breadcrumb} />;
  }, [router.pathname,menuItems,submenuItems,t,paths.decide,paths.analyze.companyResults]);


  const matchingItem = submenuItems.find(item => item.url.pathname === router.pathname);
  const correspondingLabel = matchingItem ? matchingItem.label : ((router.pathname === paths.decide.$url().pathname ) ? "DECIDE HOME" :"Label Not Found");
  
  return (
    <>
    <Head>
        <title>{correspondingLabel}</title>
      </Head>
    <div>
      <div>
        <nav className="bg-blue-900 text-white h-16 flex justify-between">
          {/* Analyze Section */}
          <div className="flex">
            <div
              className="uppercase flex items-center  font-bold text-lg px-4"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                fontSize: "1.25rem",
              }}
            >
             {(!router.pathname.includes(paths.decide.$url().pathname)) ? <div>{t("ANALYZE")}</div> : <div><Link href={paths.analyze.companyResults.$url()}>{t("ANALYZE")}</Link></div>}
            </div>
            {(!router.pathname.includes(paths.decide.$url().pathname)) && menuItems.map((menu) => (
              <div
                key={menu.id}
                className={`flex items-center  cursor-pointer border-r border-white ${
                  router.pathname.includes(menu.url.pathname) ? "selected" : ""
                }`}
              >
                <Link href={menu.url} className={` px-4 uppercase`}>
                  {menu.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Last 2 Menus */}
          <div className="flex ">
            <div
              className={`border-r flex items-center border-white px-4 uppercase cursor-pointer pr-8 ${
                router.pathname.includes(paths.decide.$url().pathname)
                  ? "selected"
                  : ""
              } `}
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                fontSize: "1.25rem",
              }}
            >
              <Link href={paths.decide.$url()}> {t("DECIDE")} </Link>
            </div>
            <div
              className={`border-r flex items-center border-white px-4 uppercase cursor-pointer`}
            >
              <div>
                <div>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => update({
                      ...session,
                      selectedPeriod:parseInt(e.target.value)})} // Handle the selected period
                    value={selectedPeriod}
                  >
                    <option value="" disabled>
                      {t("SELECT_PERIOD")}
                    </option>
                    {selectedPeriod && periods.map((period, index) => (
                      <option key={index} value={index}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {pageHeader}
    </div>
    </>
  );
};

export default NavBar;
