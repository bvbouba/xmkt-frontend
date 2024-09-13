import { ChartData, ChartOptions } from "chart.js";

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
    puk: string; 
    first_name: string; 
    last_name: string; 
    team_name: string; 
    industry_name: string; 
    industry_id: number; 
    active_period: number;
    instructor: string; 
    firm_id: number; 
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

