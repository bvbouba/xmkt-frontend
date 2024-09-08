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

export interface ErrorLog {
  id: number,
  name: string,
  has_active_errorlog: boolean
}
