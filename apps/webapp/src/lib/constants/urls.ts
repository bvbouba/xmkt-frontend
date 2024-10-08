export const authRoutes = {
    instructor: {
      COACHING:'/instructor/coaching/',
      CONFIGURATION:'/instructor/configuration/',
      CONTACT_US:'/instructor/contactus/',
      COURSE_ADD:'/instructor/course-add/',
      COURSE_EDIT:'/instructor/course-edit/',
      COURSE_DETAIL:'/instructor/course-detail/',
      COURSE_LIST:'/instructor/course-list/',
      DATA_COMPARE:'/instructor/data-compare/',
      DECISION:'/instructor/decision/',
      HOME:'/instructor/home/',
      INDUSTRY:'/instructor/industry/',
      PROFILE:'/instructor/profile/',
      QUESTIONNAIRE:'/instructor/questionnaire/',
      SCENARIO:'/instructor/scenario/',
      TEAM:'/instructor/team/',
        },
  participant:{
        HOME:'/participant/home/',
        CHARTING_TOOL:'/participant/charting-tool/',
        COMPANY_DASHBOARD:'/participant/company-dashboard/',
        COMPETITIVE_ADCOM:'/participant/competitive-adcom/',
        CONJOINT_ANALYSIS:'/participant/conjoint-analysis/',
        CONSUMER_PANEL:'/participant/consumer-panel/',
        CONSUMER_SURVEY:'/participant/consumer-survey/',
        DECISION_REVIEW:'/participant/decision-review/',
        DISTRIBUTION_PANEL:'/participant/distribution-panel/',
        FINANCIAL_REPORT:'/participant/financial-report/',
        ANALYZE:'/participant/analyze/',
        INDUSTRY_BENCHMARKING:'/participant/industry-benchmarking/',
        INDUSTRY_DASHBOARD:'/participant/industry-dashboard/',
        INDUSTRY_INFORMATION:'/participant/industry-information/',
        MARKET_FORECAST:'/participant/market-forecast/',
        MARKET_REPORT:'/participant/market-report/',
        MULTIDIMENSIONAL_SCALING:'/participant/multidimensional-scaling/',
        PRODUCTION_REPORT:'/participant/production-report/',
        RND_REPORT:'/participant/rnd-report/',
        SEMANTIC_SCALES:'/participant/semantic-scales/',
        BRAND_EDIT:'/participant/brand-edit/',
        BRAND_LIST:'/participant/brand-list/',
        BRAND_NEW:'/participant/Brand-new/',
        BRAND_PORTOFOLIO:'/participant/brand-portofolio/',
        COMMERCIAL_TEAM:'/participant/commercial-team/',
        DECIDE:'/participant/decide/',
        MARKETING_MIX_EDIT:'/participant/marketing-mix-edit/',
        MARKETING_MIX_LIST:'/participant/marketing-mix-list/',
        MARKETING_MIX:'/participant/marketing-mix/',
        MARKETING_PLAN:'/participant/marketing-plan/',
        PROJECT_NEW:'/participant/project-new/',
        RESEARCH_STUDIES:'/participant/research-studies/',
        RND:'/participant/rnd/',
        TEAM_IDENTITY:'/participant/team-identity/',
      }
     }
  
  export const nonAuthRoutes = {
    PASSWORD_RESET:'/password-reset/',
    PASSWORD_RESET_CONFIRM:'/password-reset-confirm/:uid/:token/',
    INSTRUCTOR_LOGIN:'/instructor/login/',
    PARTICIPANT_LOGIN:'/participant/login/',
    SIGNUP:'/signup/',
    CONFIRMATION_EMAIL:'/account-confirm-email/:token/',
    UNAUTHORIZED:'/unauthorized/',
  }