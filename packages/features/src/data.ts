import axios from 'axios';
import { API_URI } from 'myconstants';
import { brandAwarenessProps, brandPortofolioProps, brandProps, BudgetDetailsProps, channelProps, costReductionProps, CourseProps, CourseType, decideStatusProps, demandProps, DimensionIdealsProps, dimensionProps, DimensionScalesProps, distributionCoverageProps, featureProps, firmProps, forecastProps, industryInfoProps, levelProps, markertingMixProps, marketProps, marketResearchProps, onlineQueryProps, projectCostEstimateProps, projectProps, queryResultProps, rndProjectProps, salesProps, segmentProps, SemanticIdealsProps, SemanticScalesProps, shoppingHabitProps, signupProps, UserBasicType, utilitiesProps } from 'types';
import { ChartDataType, country, course, CourseDetails, CoursePartial, Decision, IsErrorLog, Industry, Job, JobProgress, MarketingMixType, Participant, school, ErrorLog, BudgetDetails, Loans, Reimbursement } from 'types';


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

export const fetchCourseById = async (courseId: number, token: string) => {
  const response = await axios.get(`${API_URI}api/course/${courseId}/`,
    {
      headers: {
        'Authorization': `token ${token}`
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

export const loadInfo = async ({ pak }: { pak: string }): Promise<Participant> => {
  const response = await axios.get(
    `${API_URI}api/participant_detail/${pak}/`,
    {}
  );
  return response.data;
};

export const getFirmData = async ({ firmID, industryID, token,fields,period }: { firmID: number, industryID: number, token: string, fields?:string,period?:number }): Promise<firmProps[]> => {
  const url = new URL(`${API_URI}api/analyze/firm/${industryID}/${firmID}`);

  if (fields) url.searchParams.append('fields', fields);
  if (period) url.searchParams.append('period', period.toString());

  const response = await axios.get(url.toString(), {
    headers: { 'Authorization': `token ${token}` }
  })
  return response.data
}



export const getBrandResultByFirm = async ({ firmID,industryID,token,fields,period }: { firmID: number,industryID:number,token:string,fields?:string,period?:number }): Promise<brandProps[]> => {
      const url = new URL(`${API_URI}api/brand-result-list/${ industryID }/${firmID}`);
      if (fields) url.searchParams.append('fields', fields);
      if (period) url.searchParams.append('period', period.toString());

      const response = await axios.get(url.toString(), {
        headers: { 'Authorization': `token ${token}` }
      })
        return response.data
  }

  export const getPeriodResultByBrand = async ({ brandID,period,token }: { brandID: number,period:number,token:string }): Promise<brandProps> => {
    const response  = await axios.get(`${API_URI}api/brand-result-detail/${ brandID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    });
      return response.data
}

export const getProjectData = async ({ firmID, industryID, period, token }: { token: string, firmID: number, industryID: number, period: number }): Promise<rndProjectProps> => {

  const response = await axios.get(`${API_URI}api/decide/project/now/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  const response1 = await axios.get(`${API_URI}api/decide/project/past/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  const response2 = await axios.get(`${API_URI}api/decide/project/shelved/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })

  const response3 = await axios.get(`${API_URI}api/decide/project/going/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })

  return {
    now: response.data,
    past: response1.data,
    shelved: response2.data,
    going: response3.data,
  }
}

export const getFeaturesData = async (): Promise<featureProps[]> => {
  const response = await axios.get(`${API_URI}api/features/1/`)
  return response.data
}


export const fetchDimensions = async (): Promise<dimensionProps[]> => {
  const response = await axios.get(`${API_URI}api/dimensions/`)
  return response.data
}

export const getMarketsData = async (): Promise<marketProps[]> => {
  const response = await axios.get(`${API_URI}api/markets/`)
  return response.data
}


export const getChannelsData = async (): Promise<channelProps[]> => {
  const response = await axios.get(`${API_URI}api/channels/`)
  return response.data

}


export const getSegmentsData = async (): Promise<segmentProps[]> => {
  const response = await axios.get(`${API_URI}api/segments/`)
  return response.data
}



export const getProjectAllData = async ({ firmID, industryID, period, token }: { token: string, firmID: number, industryID: number, period: number }): Promise<projectProps[]> => {
  const response = await axios.get(`${API_URI}api/decide/project/all/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  return response.data
}



export const getOnlineQueryInfoData = async ({ firmID, industryID, period, token }: { token: string, firmID: number, industryID: number, period: number }): Promise<onlineQueryProps[]> => {
  const response = await axios.get(`${API_URI}api/decide/onlinequery/${industryID}/${firmID}/${period}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  return response.data
}



export const getIndustryInfoData = async ({ industryID, token }: { industryID: number, token: string }): Promise<industryInfoProps[]> => {
  const response = await axios.get(`${API_URI}api/industry_information/${industryID}/`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  return response.data
}


export const getSalesData = async ({ industryID, period, token }: { token: string, industryID: number, period: number }): Promise<salesProps[]> => {
  const response = await axios.get(`${API_URI}api/analyze/sales/${industryID}/${period}`,
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
  return response.data
}

export const getBrandAwarenessData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<brandAwarenessProps[]> => {
  const response = await axios.get(`${API_URI}api/brand_awareness/${industryID}/${period}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getPurchaseIntentData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<brandAwarenessProps[]> => {
  const response = await axios.get(`${API_URI}api/purchase_intent/${industryID}/${period}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getShoppingHabitData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<shoppingHabitProps[]> => {
  const response = await axios.get(`${API_URI}api/shopping_habit/${industryID}/${period}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getMarketDemandData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<demandProps[]> => {
  const response = await axios.get(`${API_URI}api/market_demand/${industryID}/${period}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getDistributionCoverageData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<distributionCoverageProps[]> => {
  const response = await axios.get(`${API_URI}api/distribution_coverage/${industryID}/${period}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getSemanticScalesData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<SemanticScalesProps[]> => {
  const response = await axios.get(`${API_URI}api/semantic_scales/${industryID}/${period}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getSemanticIdealsData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<SemanticIdealsProps[]> => {
  const response = await axios.get(`${API_URI}api/semantic_ideals/${industryID}/${period}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getDimensionalScalesData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<DimensionScalesProps[]> => {
  const response = await axios.get(`${API_URI}api/dimensional_scales/${industryID}/${period}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getDimensionalIdealsData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<DimensionIdealsProps[]> => {
  const response = await axios.get(`${API_URI}api/dimensional_ideals/${industryID}/${period}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getForecastsData = async ({ industryID, period, token }: { industryID: number, period: number, token: string }): Promise<forecastProps[]> => {
  const response = await axios.get(`${API_URI}api/market_forecast/${industryID}/${period}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getUtilitiesData = async ({ courseID, token }: { courseID: number, token: string }): Promise<utilitiesProps[]> => {
  const response = await axios.get(`${API_URI}api/utilities/${courseID}/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}

export const getLevelsData = async ({ token }: { token: string }): Promise<levelProps[]> => {
  const response = await axios.get(`${API_URI}api/levels/`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return response.data;
}


export const getMarketingMixData = async ({
  industryID,
  firmID,
  period,
  token,
  fields
}: {
  token: string;
  industryID: number;
  firmID: number;
  period: number;
  fields?:string
}): Promise<markertingMixProps[]> => {
  const url = new URL(`${API_URI}api/decide/marketingmix/${industryID}/${firmID}/${period}/`);
  if (fields) url.searchParams.append('fields', fields);

  // Make the API request
  const response = await axios.get(url.toString(), {
    headers: { 'Authorization': `token ${token}` }
  });

  return response.data;
};

export const fetchDecisionStatus = async ({
  industryID,
  token,
}: {
  token: string;
  industryID: number;
}): Promise<decideStatusProps> => {
  const response = await axios.get(
    `${API_URI}api/decision_status/?industry_id=${industryID}`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchMarketResearchChoices = async ({
  industry,
  firm,
  period,
  token,
}: {
  token: string;
  industry: number;
  firm: number;
  period: number;
}): Promise<marketResearchProps[]> => {
  const response = await axios.get(
    `${API_URI}api/market-research-choices/?industry=${industry}&firm=${firm}&period=${period}`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const updateMarketResearchChoice = async ({
  id,
  choice,
  token,
}: {
  token: string;
  id: number;
  choice: boolean;
}) => {
  const response = await axios.patch(
    `${API_URI}api/market-research-choices/${id}/`,
    { choice },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchBudgetDetails = async ({
  teamId,
  periodId,
  token,
}: {
  token: string;
  teamId: number;
  periodId: number;
}): Promise<BudgetDetailsProps> => {
  const response = await axios.get(
    `${API_URI}api/budget-details/${teamId}/${periodId}/`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchMarketingMixById = async ({
  id,
  token,
}: {
  token: string;
  id: number;
}): Promise<markertingMixProps> => {
  const response = await axios.get(`${API_URI}api/marketing_mix/${id}/`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.data;
};

export const partialUpdateMarketingMix = async ({
  id,
  production,
  price,
  advertising,
  ads_research,
  ads_share_1,
  ads_share_2,
  ads_share_3,
  ads_share_4,
  ads_share_5,
  perceptual_obj,
  dimension_1,
  dimension_2,
  objective_1,
  objective_2,
  channel_1,
  channel_2,
  channel_3,
  team_id,
  token,
}: {
  token: string;
  id: number;
  production?: number;
  price?: number;
  advertising?: number;
  ads_research?: number;
  ads_share_1?: number;
  ads_share_2?: number;
  ads_share_3?: number;
  ads_share_4?: number;
  ads_share_5?: number;
  perceptual_obj?: number;
  dimension_1?: number | null;
  dimension_2?: number | null;
  objective_1?: number | null;
  objective_2?: number | null;
  channel_1?: number;
  channel_2?: number;
  channel_3?: number;
  team_id: number;
}) => {
  const response = await axios.patch(
    `${API_URI}api/marketing_mix/update/${id}/`,
    {
      production,
      price,
      advertising,
      ads_research,
      ads_share_1,
      ads_share_2,
      ads_share_3,
      ads_share_4,
      ads_share_5,
      perceptual_obj,
      dimension_1,
      dimension_2,
      objective_1,
      objective_2,
      channel_1,
      channel_2,
      channel_3,
      team_id,
    },
    { 
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  console.log(response.data)
  return response.data;
};


export const fetchProjectById = async ({
  id,
  period,
  token,
}: {
  id: number;
  period: number;
  token: string;
}): Promise<projectProps> => {
  const response = await axios.get(`${API_URI}api/projects/${id}/`, {
    headers: {
      Authorization: `token ${token}`,
    },
    params: {
      current_period_id: period,
    },
  });
  return response.data;
};

export const fetchBrandById = async ({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<brandPortofolioProps> => {
  const response = await axios.get(`${API_URI}api/brands/${id}/`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.data;
};

export const partialUpdateProject = async ({
  projectID,
  objective,
  allocatedBudget,
  period,
  token,
}: {
  projectID: number;
  objective?: string;
  allocatedBudget: number;
  period: number;
  token: string;
}) => {
  const response = await axios.patch(
    `${API_URI}api/projects/update/${projectID}/`,
    {
      objective,
      allocated_budget: allocatedBudget,
      period_id: period,
    },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteProject = async ({
  projectID,
  token,
}: {
  projectID: number;
  token: string;
}) => {
  const response = await axios.delete(
    `${API_URI}api/projects/update/${projectID}/`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchBrands = async ({
  industryID,
  firmID,
  token,
}: {
  industryID: number;
  firmID: number;
  token: string;
}): Promise<brandPortofolioProps[]> => {
  const response = await axios.get(
    `${API_URI}api/brands/${industryID}/${firmID}/`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const submitBrand = async ({
  name,
  market,
  since,
  role,
  project,
  industry,
  team,
  token,
}: {
  name: string;
  market: number;
  since: number;
  role: string;
  project: number;
  industry: number;
  team: number;
  token: string;
}) => {
  const response = await axios.put(
    `${API_URI}api/brands/add/`,
    {
      name,
      is_active: 1,
      market,
      since,
      role,
      project,
      team,
      industry,
    },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const updateBrand = async ({
  id,
  name,
  role,
  isActive,
  project,
  period,
  token,
}: {
  id: number;
  name: string;
  role: string;
  isActive: boolean;
  project: number;
  period: number;
  token: string;
}) => {
  const response = await axios.patch(
    `${API_URI}api/brands/update/${id}/`,
    {
      name,
      role,
      project,
      is_active: isActive,
      period,
    },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const updateTeamName = async ({
  teamID,
  newName,
  token,
}: {
  teamID: number;
  newName: string;
  token: string;
}) => {
  const response = await axios.put(
    `${API_URI}api/decide/teams/${teamID}/`,
    { name: newName },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};




export const fetchNumberOfQueries = async ({
  industryID,
  firmID,
  period,
  marketID,
  token,
}: {
  industryID: number;
  firmID: number;
  period: number;
  marketID: number;
  token: string;
}): Promise<{count:number}> => {
  const response = await axios.get(
    `${API_URI}api/queries/${industryID}/${firmID}/${period}/${marketID}/`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return response.data;
};

export const runOnlineQueries = async ({
  industryID,
  firmID,
  period,
  marketID,
  choice,
  feature1,
  feature2,
  feature3,
  feature4,
  feature5,
  crID,
  baseCost,
  token,
}: {
  industryID: number;
  firmID: number;
  period: number;
  marketID: number;
  choice: number;
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  crID?: number;
  baseCost?: number;
  token: string;
}): Promise<projectCostEstimateProps> => {
  const response = await axios.get(
    `${API_URI}api/online-query/${industryID}/${firmID}/${period}/${marketID}/`,
    {
      params: {
        choice,
        feature_1: feature1,
        feature_2: feature2,
        feature_3: feature3,
        feature_4: feature4,
        feature_5: feature5,
        cr_id: crID,
        base_cost: baseCost || 0,
      },
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  return {
    projectCost: response.data.project_cost,
    minCost: response.data.min_cost,
    baseCost: response.data.base_cost,
    runs: response.data.number_of_runs,
  };
};

export const createProject = async ({
  industryID,
  firmID,
  period,
  marketID,
  choice,
  feature1,
  feature2,
  feature3,
  feature4,
  feature5,
  baseCost,
  name,
  objective,
  allocatedBudget,
  token,
}: {
  name: string;
  objective: string;
  industryID: number;
  firmID: number;
  period: number;
  marketID: number;
  choice: string;
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  baseCost?: number;
  allocatedBudget: number;
  token: string;
}) => {
  const response = await axios.put(
    `${API_URI}api/projects/add/`,
    {
      industry_id: industryID,
      firm_id: firmID,
      period_id: period,
      market_id: marketID,
      name,
      objective: objective || ``,
      choice,
      feature_1: feature1,
      feature_2: feature2,
      feature_3: feature3,
      feature_4: feature4,
      feature_5: feature5,
      base_cost: baseCost || 0,
      allocated_budget: allocatedBudget,
    },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  return {
    projectCost: response.data.required_budget,
    minCost: response.data.min_cost,
    baseCost: response.data.base_cost,
    projectID: response.data.project_id,
  };
};



export const checkCostReduction = async (
  projectData: {
    feature_1: string;
    feature_2: string;
    feature_3: string;
    feature_4: string;
    feature_5: string;
  }
): Promise<costReductionProps> => {
  const queryParams = new URLSearchParams(projectData).toString();
  const url = `${API_URI}api/check_cost_reduction/?${queryParams}`;
  const response = await axios.get(url);
  return response.data;
};


export const logout = async (token:string) => {
  const response = await axios.get(`${API_URI}rest-auth/logout/`,{
    headers: {
             'Authorization': `token ${token}`
             }
  })

  return response.data
}


export const fetchCoursesById = async ({courseid}:{courseid:string}): Promise<CourseProps>  => {
const response = await axios.get(`${API_URI}api/courses/${courseid}/`);
      return response.data;
}

export const registerForCourse = async ({courseCode,token}:{ courseCode:string,token:string }) => {
     const response = await axios.post(`${API_URI}api/course-participant/`, 
      { course_code: courseCode },
      {
        headers: {
          'Authorization': `token ${token}`,
        }
      }
    
    );
        return response.data;
    
    }
  


  export const signup = async ({
        email,
        password1,
        password2,
        firstName,
        lastName,
        userType,
        school=``,
        phone=``
      }: signupProps): Promise<{key:string}> => {
          const response = await axios.post(
            `${API_URI}rest-auth/registration/`,
            {
              email,
              password1,
              password2,
              first_name:firstName,
              last_name:lastName,
              profile: {
                prefix:null,
                job: null,
                function: null,
                school,
                country:1,
                phone,
                objective: ``,
                user_type:userType,
              },
            }
          );
          return response.data;
        }
      
  
    
    export const checkEmail = async ({ token }: { token: string }) => {
          const response = await axios.post(
            `${API_URI}account-confirm-email/`,
            {
              key: token,
            }
          );
          return response.data;
      }
    
    
    export const authChangePassword = async ({
        password1,
        password2,
        token,
      }: {
        password1: string;
        password2: string;
        token:string
      }) => {

          const response = await axios.post(
            `${API_URI}rest-auth/password/change/`,
            {
              new_password1: password1,
              new_password2: password2,
            },
            {
              headers: {
                Authorization: `token ${token}`,
              },
            }
          );
  
          return response.data
  
      }
    
    
    export const resetPassword = async ({ email }: { email: string }) => {
          const response = await axios.post(
            `${API_URI}rest-auth/password/reset/`,
            {
              email,
            }
          );
          return response.data;
      }
    
    
    export const resetPasswordConfirm = async ({
        uid,
        token,
        password1,
        password2,
      }: {
        uid: string;
        token: string;
        password1: string;
        password2: string;
      }) => {
          const response = await axios.post(
            `${API_URI}rest-auth/password/reset/confirm/`,
            {
              uid,
              token,
              new_password1: password1,
              new_password2: password2,
            }
          );
    
          return response.data;
      }

  export const getUserByEmail = async (email: string): Promise<UserBasicType> => {
        const response = await axios.get(`${API_URI}api/users/email/${email}/`,
        );
        return response.data;
      };
  
  export const getParticipant = async ({courseID,token}:{courseID: string, token: string;}): Promise<Participant> => {
        const response = await axios.get(`${API_URI}api/participant/by-course-and-user/?course_id=${courseID}`,
          {
            headers: {
              'Authorization': `token ${token}`
            }
          }
        
        );
        return response.data;
      };


  export const getAllEnrolledCourses = async (token: string): Promise<Participant[]> => {
        const response = await axios.get(`${API_URI}api/participant/enrolled-courses/`,
          {
            headers: {
              'Authorization': `token ${token}`
            }
          }
        );
        return response.data;
      };