import { ChartData, ChartOptions } from "chart.js";

export interface decideStatusProps {
    id: number,
    active_period: number,
    status: number,
    industry: number

}

export interface ParticipantState {
  loading: boolean;
  success: string | null;
  error: string | null;
  user: string | null;
  team: string | null;
  teamname?: string;
  courseid?: string;
  coursecode?: string;
  industryname?: string | null;
  industry?: string | null;
  activeperiod?: string | null;
  instructor?: string | null;
  firmid?: string | null;
}

export interface authProps {
  email: string;
  password: string;
}

export interface signupProps {
  email: string;
  password1: string;
  password2: string;
  firstName: string;
  lastName: string;
  prefix?: string;
  jobTitle?: string;
  funct?: string;
  school?: string;
  country?: string;
  phone?: string;
  objective?: string;
  userType?: string;
}

interface CommercialProps {
  channel_1: number;
  channel_2: number;
  channel_3: number;
}

interface ProjectBasicProps {
  project_name: string;
  feature_1: number;
  feature_2: number;
  feature_3: number;
  feature_4: number;
  feature_5: number;
  base_cost: number;
  available_period: number;
  [key: string]: any;
}

export interface markertingMixProps {
  id: number;
  team_name: string;
  firm_id: number;
  brand_id: number;
  brand_name: string;
  period_id: number;
  production: number;
  price: number;
  advertising: number;
  ads_share_1: number;
  ads_share_2: number;
  ads_share_3: number;
  ads_share_4: number;
  ads_share_5: number;
  perceptual_obj: number;
  dimension_1: null | any; // Change 'any' to the specific type if available
  dimension_name_1: string;
  dimension_2: null | any; // Change 'any' to the specific type if available
  dimension_name_2: string;
  objective_1: null | any; // Change 'any' to the specific type if available
  objective_2: null | any; // Change 'any' to the specific type if available
  channel_1: number;
  channel_2: number;
  channel_3: number;
  commercial_cost: CommercialProps;
  project: ProjectBasicProps;
  is_active?: boolean,
  [key: string]: any;
}

export interface firmProps {
  period_id: number;
  stockprice: number;
  revenue: number;
  net_contribution: number;
  market_share: number;
  unit_market_share: number;
  team_name: string,
  [key: string]: any;
}

export interface brandProps {
  period_id: number;
  brand_name: string;
  firm_id: number;
  revenue: number;
  contribution: number;
  [key: string]: any;
}

export interface featureProps {
  id: number;
  name: string;
  abbrev: string;
  surname: string;
  unit: string;
  range_inf: number,
  range_sup: number,
  abbrev_fr:string,
  name_fr: string,
  unit_fr: string
}

export interface marketProps {
  id: number;
  name: string;
}

export interface channelProps {
  id: number;
  name: string;
  channel_size: number;
  markup: string;
  discount: string;
  color: string;
  surname: string;
  name_fr:string;
}

export interface segmentProps {
  id: number;
  name: string;
  name_fr:string;
}

export interface projectProps {
  id: number;
  name: string;
  creation_period: number;
  ready_period: number;
  feature_1: number;
  feature_2: number;
  feature_3: number;
  feature_4: number;
  feature_5: number;
  base_cost: number;
  min_cost: number;
  accumulated_budget: number;
  status: boolean;
  brand_id: number;
  brand_name: string;
  market_name:string;
  objective:string | null;
  required_budget:number;
  budget_required_for_completion:number;
  allocated_budget_for_current_period:number;
  [key: string]: any;
  choice?:string | number;
  allocated_budget?:number,
  available_period?:number,
  market?:number,
}


export interface rndProjectProps {
  now?: projectProps[];
  past?: projectProps[];
  shelved?: projectProps[];
  going?: projectProps[];
}

export interface onlineQueryProps {
  period: number;
  feature_1: number;
  feature_2: number;
  feature_3: number;
  feature_4: number;
  feature_5: number;
  req_base_cost: number;
  req_budget: number;
  min_cost: number;
  [key: string]: any;
}



export interface industryDataProps{
  team_name: string,
  stockprice: number,
  revenue: number,
  net_contribution: number,
  cum_nc: number,
  [key: string]: any;
}

export interface industryInfoProps {
    id: number,
    value: number,
    period_id: number,
    industry_id: number,
    economic_id: number,
    label: { name: string, desc: string ,name_fr: string, desc_fr: string},
    [key: string]: any;
  }

  export interface valueMsProps {
    name: string,
    market_share: number,
    revenue: number,
    variation: number,
    brand_name: string,
    value_market_share: number,
      [key: string]: any;
  }
  export interface unitMsProps {
    name: string,
      market_share: number,
      unit_sold: number,
      variation: number,
      brand_name: string,
      unit_market_share: number,
    [key: string]: any;
  }

  export interface salesProps {
    period_id: number;
    market_id: number;
    market_name: string;
    industry_id: number;
    brand_name: string;
    brand_id: number;
    team_name: string;
    team_id: number;
    firm_id: number;
    channel_name: string;
    channel_id: number;
    segment_name: string;
    segment_id: number;
    volume: number;
    price: number;
  }

  export interface brandAwarenessProps {
    id: number;
    period_id: number;
    industry_id: number;
    firm_id: number;
    team_name: string;
    brand_id: number;
    brand_name: string;
    segment_name: string;
    segment_id: number;
    value: number;
    [key: string]: any;
  }

  export interface shoppingHabitProps {
    id: number;
    period_id: number;
    industry_id: number;
    channel_name: string;
    channel_id: number;
    segment_name: string;
    segment_id: number;
    percent: number;
    [key: string]: any;
  }

  export interface demandProps {
      id: number,
      period_id: number,
      industry_id: number,
      segment_id: number,
      segment_name: string,
      size: number,
    
  }

  export interface distributionCoverageProps {
      id: number,
      period_id: number,
      industry_id: number,
      brand_name: string,
      brand_id: number,
      channel_name: string,
      channel_id: number,
      value: number;
      [key: string]: any;
  }

type PropObject<T> = { data: T; error?: string | null; loading?: boolean; success?:boolean};

type Props<T> = {
    [K in keyof T]: PropObject<T[K]>;
};

export interface decideProps extends Props<{
  marketingMix: markertingMixProps[];
  queryCount:number;
  queryResult:{
      projectCost:number,
      minCost:number,
      baseCost:number,
      projectID?:number,
      runs?:number
    } | null
  project:projectProps | null;
  brands: brandPortofolioProps[];
  brand: brandPortofolioProps | null
  marketingMixById:markertingMixProps | null;
  marketResearchChoices:marketResearchProps[];
  marketResearchChoice:marketResearchProps | null;
  budget:BudgetDetailsProps |null;
  costReduction:{project_id:number, project_name:string}|null;
}>{
  loading?: boolean;
  success?: boolean;
  error?: string | null;
  decisionStatus:decideStatusProps|null;
}

export interface analyzeProps extends Props<{
    firm: firmProps[];
    brand: brandProps[];
    projects: rndProjectProps;
    features: featureProps[];
    markets: marketProps[];
    channels: channelProps[];
    segments: segmentProps[];
    allProjects: projectProps[];
    onlineQuery: onlineQueryProps[];
    industryInfo:industryInfoProps[];
    sales:salesProps[];
    brandAwareness:brandAwarenessProps[];
    purchaseIntent:brandAwarenessProps[];
    shoppingHabit:shoppingHabitProps[];
    marketDemand:demandProps[];
    distributionCoverage:distributionCoverageProps[];
    semanticScales:SemanticScalesProps[];
    semanticIdeals:SemanticIdealsProps[];
    dimensionScales:DimensionScalesProps[];
    dimensionIdeals:DimensionIdealsProps[];
    forecats:forecastProps[];
    utilities:utilitiesProps[];
    levels:levelProps[];
    dimensions: {
        id: number,
        name: string,
        name_fr:string,
        name_en:string
    }[]
    
  }>{}

  export interface SemanticScalesProps {
    id: number;
    period_id: number;
    industry_id: number;
    firm_id: number;
    team_name: string;
    brand_name: string;
    brand_id: number;
    feature_name: string;
    feature_id: number;
    rating: number;
    [key: string]: any;
  }
  
  export interface SemanticIdealsProps {
    id: number;
    period_id: number;
    industry_id: number;
    feature_name: string;
    feature_id: number;
    segment_name: string;
    segment_id: number;
    rating: number;
    [key: string]: any;
  }
  
  export interface DimensionScalesProps {
    id: number;
    period_id: number;
    industry_id: number;
    firm_id: number;
    team_name: string;
    brand_name: string;
    brand_id: number;
    dimension_name: string;
    dimension_id: number;
    rating: number;
    [key: string]: any;
  }
  
  export interface DimensionIdealsProps {
    id: number;
    period_id: number;
    industry_id: number;
    dimension_name: string;
    dimension_id: number;
    segment_name: string;
    segment_id: number;
    rating: number;
    [key: string]: any;
  }

  export interface forecastProps {
    last_period: number,
    current_period: number,
    next_period: number,
    five_period: number,
    period_id: number,
    industry_id: number,
    segment_name: string,
    segment_id: number,
    [key: string]: any;
  }

  export interface utilityProps {
    id: number;
    u_1: number;
    u_2: number;
    u_3: number;
    u_4: number;
    feature: number;
    customer: number;
    course: number;
    feature_name: string;
  }
  
  export interface utilitiesProps {
    customer_id: number;
    segment_name: string;
    utilities: utilityProps[];
  }

  export interface levelProps {
    l_1: number;
    l_2: number;
    l_3: number;
    l_4: number;
    feature_name: string;
    segment_name: string;
  }


 export interface brandPortofolioProps {
    id: number,
    name: string,
    is_active: boolean,
    market: number,
    since: string,
    role: string,
    project: number,
    operation: string,
    operation_fr: string,
    market_name: string,
    project_name: string,
    last_project_name: string | null
  }

  export interface marketResearchProps{
    id: number;
    choice: boolean;
    study: number;
    market: number;
    period: number;
    firm: number;
    industry: number;
    cost:number,
    research_name:string,
    research_name_fr:string,

}

export interface BudgetDetailsProps {
  budget: number;
  expenses: number;
  deviation: number;
  loans:number;
};

export interface paramsQueryType { firmID: string; industryID: string; selectedPeriod: string,courseID:string }

export interface UserType {
  id:number,
  username:string,
  email:string,
  firstname:string,
  lastname:string,
  usertype:number,
  country:number,
  school:number
}

export interface CourseType{
        simulation: number,
        courseName: string,
        description:string,
        school: number,
        country: number,
        startDate: string,
        endDate: string,
        participantCount: number,
        purchaser: number,
}

//*************************/
// types for dashboard 
//*************************/

export interface course 
    {
        id:number,
        course_name: string,
        courseid: string,
        simulation_id: number,
        simulation_name: string,
        creation_date:string
    }

export interface country {
    id: number,
    name: string
}

export interface school {
    id: number,
    name: string,
    country_id: number
}

export interface Team {
    id: number;
    name: string;
    firm: number;
    password: string;
    participant_list: number[];
    industry: number;
  }
  
  export interface Industry {
    id: number;
    name: string;
    number_of_teams: number;
    course: number;
    is_active: boolean;
    teams: Team[];
    participant_count: number;
  }
  
  export interface CourseDetails {
    id: number;
    simulation: number;
    courseid: string;
    creation_date: string;
    course_name: string;
    course_description: string;
    school: number;
    country: number;
    start_date: string;
    end_date: string;
    participant_count: number;
    registered_participants: number;
    purchaser: number;
    scenario: number;
    scenario_name: string;
    user: number;
    is_active: boolean;
    industry: Industry[];
    simulation_name: string;
  }


  export interface CoursePartial {
    courseName:string,
    description:string,
    startDate:string,
    endDate: string,
    participantCount:number,
  }

  export interface Participant {
    id: number;
    team: number[]; 
    user: number;
    course: number; 
    courseid: string;
    course_name:string;
    puk: string; 
    first_name: string; 
    last_name: string; 
    team_name: string; 
    industry_name: string; 
    industry_id: number; 
    active_period: number;
    instructor: string; 
    firm_id: number; 
    team_password: string;
}

export interface Decision {
  active_period: number,
  status: number,
  progress: string,
  action: string
}

export interface Job {
  task_id:string, 
  task_name:string
}

export interface JobProgress {
  task_id: string,
  status: string,
  task_name: string,
  course_id: number,
  industry_id: number,
  duration: string,
  progress: number
}

export interface IsErrorLog {
  id: number,
  name: string,
  has_active_errorlog: boolean,
  firm_id:number
}


export interface ChartDataType {
  chartType: string;
  data: ChartData<"bar", number[], string> | ChartData<"line", any[], string>,
  options: ChartOptions<'bar' | 'line'>,
  displayType?: string;
  title?:string
};

interface CommercialCost {
  channel_1: number;
  channel_2: number;
  channel_3: number;
}

export interface Project {
  project_name: string;
  feature_1: number;
  feature_2: number;
  feature_3: number;
  feature_4: number;
  feature_5: number;
  base_cost: number;
  available_period: number;
}

export interface MarketingMixType {
  id: number;
  team_name: string;
  firm_id: number;
  brand_id: number;
  brand_name: string;
  period_id: number;
  production: number;
  price: number;
  advertising: number;
  ads_share_1: number;
  ads_share_2: number;
  ads_share_3: number;
  ads_share_4: number;
  ads_share_5: number;
  perceptual_obj: number;
  dimension_1: number | null;
  dimension_name_1: string | null;
  dimension_2: number | null;
  dimension_name_2: string | null;
  objective_1: number | null;
  objective_2: number | null;
  channel_1: number;
  channel_2: number;
  channel_3: number;
  commercial_cost: CommercialCost;
  project: Project;
  role: string;
  market_name: string;
  launched_period: string;
  is_active: boolean;
}

export interface ErrorLog {
  id: number;
  period_id: number;
  team_id: number;
  team_name: string;
  brand_id: number;
  brand_name: string;
  message_id: number;
  is_active: boolean;
  title: string;
  content: string;
  by: number;
  severity: number;
  content_fr: string;
  title_fr: string;
}


export interface BudgetDetails {
  budget: number;
  expenses: number;
  deviation: number;
  loans:number;
};

export interface Loans {
  id: number,
  rate: number,
  principal: number,
  number_of_periods: number,
  period: number,
  team: number,
  industry: number,
  is_active?: boolean
}

export interface Reimbursement {
  id: number,
  interest: number,
  principal: number,
  period: number,
  loan: number,
  paid: boolean
}

export interface dimensionProps {
  id: number,
  name: string,
  name_fr: string,
  name_en: string
}

export interface queryResultProps {
  projectCost:number,
  minCost:number,
  baseCost:number,
  projectID?:number,
  runs?:number
}

export interface costReductionProps {
  project_id:number, 
  project_name:string
}

export interface projectCostEstimateProps {
  projectCost: number;
  minCost: number;
  baseCost: number;
  runs: number;
}

export interface CourseProps {
     id: number;
     courseid: string;
     creation_date: string;
     course_name: string;
     course_description: string;
     start_date: string;
     end_date: string;
     participant_count: string;
     purchaser: number;
     is_active: boolean;
     simulation: number;
     school: number;
     country: number;
     scenario: number;
     user: number;
     instructor_first_name:string,
     instructor_last_name:string
   } 

  export interface UserBasicType {
      id: number,
      username: string,
      email: string,
      first_name: string,
      last_name: string
  }