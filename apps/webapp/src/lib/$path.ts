export const pagesPath = {
  "analyze": {
    "companyResults": {
      "companyDashboard": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults/companyDashboard' as const, hash: url?.hash })
      },
      "decisionReview": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults/decisionReview' as const, hash: url?.hash })
      },
      "financialReport": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults/financialReport' as const, hash: url?.hash })
      },
      "productionReport": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults/productionReport' as const, hash: url?.hash })
      },
      "rndReport": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults/rndReport' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/companyResults' as const, hash: url?.hash })
    },
    "marketCompetitiveNews": {
      "industryDashboard": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketCompetitiveNews/industryDashboard' as const, hash: url?.hash })
      },
      "industryInformation": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketCompetitiveNews/industryInformation' as const, hash: url?.hash })
      },
      "marketReport": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketCompetitiveNews/marketReport' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketCompetitiveNews' as const, hash: url?.hash })
    },
    "marketResearch": {
      "competitiveAds": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/competitiveAds' as const, hash: url?.hash })
      },
      "conjointAnalysis": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/conjointAnalysis' as const, hash: url?.hash })
      },
      "consumerPanel": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/consumerPanel' as const, hash: url?.hash })
      },
      "consumerSurvey": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/consumerSurvey' as const, hash: url?.hash })
      },
      "distributionPanel": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/distributionPanel' as const, hash: url?.hash })
      },
      "industryBenchmarking": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/industryBenchmarking' as const, hash: url?.hash })
      },
      "marketForecast": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/marketForecast' as const, hash: url?.hash })
      },
      "multidimensionalScaling": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/multidimensionalScaling' as const, hash: url?.hash })
      },
      "semanticScales": {
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch/semanticScales' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/marketResearch' as const, hash: url?.hash })
    },
    "tools": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/analyze/tools' as const, hash: url?.hash })
    }
  },
  "auth": {
    "login": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/login' as const, hash: url?.hash })
    },
    "signup": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/signup' as const, hash: url?.hash })
    }
  },
  "decide": {
    "brandPortofolio": {
      "brand": {
        "add": {
          _market_id: (market_id: string | number) => ({
            $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/brandPortofolio/brand/add/[market_id]' as const, query: { market_id }, hash: url?.hash })
          })
        },
        "update": {
          _brand_id: (brand_id: string | number) => ({
            $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/brandPortofolio/brand/update/[brand_id]' as const, query: { brand_id }, hash: url?.hash })
          })
        }
      },
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/brandPortofolio' as const, hash: url?.hash })
    },
    "commercialTeam": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/commercialTeam' as const, hash: url?.hash })
    },
    "marketResearchStudies": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/marketResearchStudies' as const, hash: url?.hash })
    },
    "marketingMix": {
      _id: (id: string | number) => ({
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/marketingMix/[id]' as const, query: { id }, hash: url?.hash })
      }),
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/marketingMix' as const, hash: url?.hash })
    },
    "marketingPlan": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/marketingPlan' as const, hash: url?.hash })
    },
    "researchAndDevelopment": {
      "project": {
        "add": {
          _market_id: (market_id: string | number) => ({
            $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/researchAndDevelopment/project/add/[market_id]' as const, query: { market_id }, hash: url?.hash })
          })
        },
        "update": {
          _project_id: (project_id: string | number) => ({
            $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/researchAndDevelopment/project/update/[project_id]' as const, query: { project_id }, hash: url?.hash })
          })
        }
      },
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/researchAndDevelopment' as const, hash: url?.hash })
    },
    "teamIdentity": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide/teamIdentity' as const, hash: url?.hash })
    },
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/decide' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/' as const, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;
