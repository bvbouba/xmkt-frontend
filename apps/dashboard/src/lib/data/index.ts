import axios from 'axios';
import { API_URI } from 'myconstants';
import { useSession } from 'next-auth/react';
import { CourseType } from 'types';
import { ChartDataType, country, course, CourseDetails, CoursePartial, Decision, IsErrorLog, Industry, Job, JobProgress, MarketingMixType, Participant, school, ErrorLog, BudgetDetails, Loans, Reimbursement } from './type';


export const fetchCourses = async (token: string): Promise<course[]> => {
  const response = await axios.get(`${API_URI}api/user-courses/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};

export const getCourse = async ({ courseId, token, fields, industry_fields }: { courseId: number, token: string, fields?: string, industry_fields?: string }): Promise<CourseDetails> => {

  const url = new URL(`${API_URI}api/course/${courseId}`);
  if (fields) url.searchParams.append('fields', fields);
  if (industry_fields) url.searchParams.append('industry_fields', industry_fields);

  // Make the API request
  const response = await axios.get(url.toString(), {
    headers: { 'Authorization': `token ${token}` }
  });

  return response.data;
};

export const fetchCourseById = async (courseId: number) => {
  const { data: session } = useSession();
  const response = await axios.get(`${API_URI}api/course/${courseId}/`,
    {
      headers: {
        'Authorization': `token ${session?.accessToken}`
      }
    }
  );
  return response.data;
};

export const createCourse = async (courseData: CourseType, token: string) => {
  const response = await axios.post(`${API_URI}api/course/`, {
    simulation: courseData.simulation,
    course_name: courseData.courseName,
    course_description: courseData.description,
    school: courseData.school,
    country: courseData.country,
    start_date: courseData.startDate,
    end_date: courseData.endDate,
    participant_count: courseData.participantCount,
    purchaser: courseData.purchaser,
  },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    }

  );
  return response.data;
};

export const editCourse = async ({ courseId, course, token }: { courseId: number, course: CoursePartial, token: string }) => {
  const response = await axios.patch(`${API_URI}api/course/${courseId}/`,
    {
      course_name: course.courseName,
      course_description: course.description,
      start_date: course.startDate,
      end_date: course.endDate,
      participant_count: course.participantCount,
    },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    });
  return response.data;
};


export const deleteCourse = async (courseId: number, token: string) => {
  const response = await axios.delete(`${API_URI}api/course/${courseId}/`, {
    headers: {
      'Authorization': `token ${token}`,
    }
  });
  return response.data;
};

export const fetchCountries = async (): Promise<country[]> => {
  const response = await axios.get(`${API_URI}api/country/`,
  );
  return response.data;
};

export const fetchSchools = async (): Promise<school[]> => {
  const response = await axios.get(`${API_URI}api/school/`,
  );
  return response.data;
};

export const getIndustry = async (Id: number, token: string): Promise<Industry> => {
  const response = await axios.get(`${API_URI}api/industry/${Id}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};

export const deleteIndustry = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URI}api/industry/${id}/`, {
    headers: {
      'Authorization': `token ${token}`,
    }
  });
  return response.data;
};

export const createIndustry = async (industryData: Pick<Industry, 'name' | 'number_of_teams' | 'course'>, token: string) => {
  const response = await axios.post(`${API_URI}api/industry/`, {
    name: industryData.name,
    number_of_teams: industryData.number_of_teams,
    course: industryData.course,
  },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    }

  );
  return response.data;
};

export const fetchParticipants = async (courseId: number, token: string): Promise<Participant[]> => {
  const response = await axios.get(`${API_URI}api/participant_list/${courseId}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};


export const assignParticipantTeam = async ({ participantId, teamId, token }: { participantId: number, teamId?: number, token: string }) => {
  const response = await axios.patch(`${API_URI}api/participant/${participantId}/`,
    {
      team: teamId ? [teamId] : [],

    },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    });
  return response.data;
};

export const getDecision = async (Id: number, token: string): Promise<Decision> => {
  const response = await axios.get(`${API_URI}api/decision/${Id}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};

export const updateDecision = async ({ id, action, token }: { id: number, action: number, token: string }): Promise<Job> => {
  const response = await axios.patch(`${API_URI}api/decision/${id}/`,
    {
      action
    },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    });
  return response.data;
};

export const getTaskProgress = async (taskId: string, token: string): Promise<JobProgress> => {
  const response = await axios.get(`${API_URI}api/tasks/${taskId}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};

export const getTeamsErrors = async (Id: number, token: string): Promise<IsErrorLog[]> => {
  const response = await axios.get(`${API_URI}api/teams-errors/${Id}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    }
  );
  return response.data;
};


export const fetchChartData = async ({ chartType, period, industry, token }: { chartType: string, period: string, industry: string, token: string }): Promise<ChartDataType> => {
  const response = await axios.get(`${API_URI}api/get_chart_data/`,
    {
      headers: {
        'Authorization': `token ${token}`
      },
      params: {
        data_type: chartType,
        selected_period: period,
        industry_id: industry
      }
    }
  );
  return response.data;
};


export const fetchMarketingMixDecisionByTeam = async ({ teamId, period, token, fields }: { teamId: number, period: number, token: string, fields?: string }): Promise<MarketingMixType[]> => {

  const url = new URL(`${API_URI}api/marketingmix_decision_by_team/${teamId}/${period}`);
  if (fields) url.searchParams.append('fields', fields);

  const response = await axios.get(url.toString(), {
    headers: { 'Authorization': `token ${token}` }
  });

  return response.data;
};

export const getErrorLogByTeam = async ({ teamId, period, token }: { teamId: number, period: number, token: string }): Promise<ErrorLog[]> => {

  const response = await axios.get(`${API_URI}api/analyze/errorlog/${teamId}/${period}`, {
    headers: { 'Authorization': `token ${token}` }
  });

  return response.data;
};
export const getBudgetDetail = async ({ teamId, period, token }: { teamId: number, period: number, token: string }): Promise<BudgetDetails> => {
  const response = await axios.get(
    `${API_URI}api/budget-details/${teamId}/${period}/`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const getLoansByTeam = async ({ teamId, token }: { teamId: number, token: string }): Promise<Loans[]> => {

  const response = await axios.get(`${API_URI}api/loans_by_team/${teamId}`, {
    headers: { 'Authorization': `token ${token}` }
  });
  return response.data;
};

export const getReimbursementsByTeam = async ({ loanId, token }: { loanId: number, token: string }): Promise<Reimbursement[]> => {

  const response = await axios.get(`${API_URI}api/reimbursements_by_loan/${loanId}`, {
    headers: { 'Authorization': `token ${token}` }
  });
  return response.data;
};

export const createLoan = async ({ rate, principal, number_of_periods, period, team, industry, token }:
  {
    rate: number,
    principal: number,
    number_of_periods: number,
    period: number,
    team: number,
    industry: number,
    token: string
  }) => {
  const response = await axios.post(`${API_URI}api/loans_add/`, {
    rate,
    principal,
    number_of_periods,
    period,
    team,
    industry,
    is_active: true,
  },
    {
      headers: {
        'Authorization': `token ${token}`,
      }
    }

  );
  return response.data;
};