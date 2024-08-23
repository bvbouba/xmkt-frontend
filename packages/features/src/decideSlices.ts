import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decideProps } from "types";
import {API_URI} from "myconstants"

export const getMarketingMixData = createAsyncThunk(
  `decide/getMarketingMixData`,
  async ({
    industryID,
    firmID,
    period,
  }: {
    industryID: number;
    firmID: number;
    period: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/decide/marketingmix/${industryID}/${firmID}/${period}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

// Create an async thunk for fetching decision status
export const fetchDecisionStatus = createAsyncThunk(
  `decide/fetchDecisionStatus`,
  async ({ industryID }: { industryID: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/decision_status/?industry_id=${industryID}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

////

export const fetchMarketResearchChoices = createAsyncThunk(
  `decide/fetchMarketResearchChoices`,
  async ({
    industry,
    firm,
    period,
  }: {
    industry: number;
    firm: number;
    period: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/market-research-choices/?industry=${industry}&firm=${firm}&period=${period}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const updateMarketResearchChoice = createAsyncThunk(
  `decide/updateMarketResearchChoice`,
  async ({ id, choice }: { id: number; choice: boolean }) => {
    try {
      const token = localStorage.getItem(`token`);
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
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchBudgetDetails = createAsyncThunk(
  `decide/fetchBudgetDetails`,
  async ({ teamId, periodId }: { teamId: number; periodId: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/budget-details/${teamId}/${periodId}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

// Fetch MarketingMix by ID
export const fetchMarketingMixById = createAsyncThunk(
  `decide/fetchMarketingMixById`,
  async ({ id }: { id: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/marketing_mix/${id}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const partialUpdateMarketingMix = createAsyncThunk(
  `decide/partialUpdateMarketingMix`,
  async ({
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
  }: {
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
    objective_1?: number | null;
    dimension_2?: number | null;
    objective_2?: number | null;
    channel_1?: number;
    channel_2?: number;
    channel_3?: number;
    team_id: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
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
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  `decide/fetchProjectById`,
  async ({ id, period }: { id: number; period: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/projects/${id}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
          params: {
            current_period_id: period,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchBrandById = createAsyncThunk(
  `decide/fetchBrandById`,
  async ({ id }: { id: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/brands/${id}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const partialUpdateProject = createAsyncThunk(
  `decide/partialUpdate`,
  async ({
    projectID,
    objective,
    allocatedBudget,
    period,
  }: {
    projectID: number;
    objective?: string;
    allocatedBudget: number;
    period: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.patch(
        `${API_URI}api/projects/update/${projectID}/`,
        {
          objective,
          allocated_budget: allocatedBudget,
          period_id: period,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const deleteProject = createAsyncThunk(
  `decide/deleteProject`,
  async ({ projectID }: { projectID: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.delete(
        `${API_URI}api/projects/update/${projectID}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchBrands = createAsyncThunk(
  `decide/fetchBrands`,
  async ({ industryID, firmID }: { industryID: number; firmID: number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/brands/${industryID}/${firmID}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

// Thunks
export const submitBrand = createAsyncThunk(
  `decide/submitBrand`,
  async ({
    name,
    market,
    since,
    role,
    project,
    industry,
    team,
  }: {
    name: string;
    since: number;
    role: string;
    market: number;
    project: number;
    industry: number;
    team: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
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
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const updateBrand = createAsyncThunk(
  `decide/updateBrand`,
  async ({
    id,
    name,
    role,
    isActive,
    project,
    period,
  }: {
    id: number;
    name: string;
    role: string;
    isActive: boolean;
    project: number;
    period: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
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
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const updateTeamName = createAsyncThunk(
  `decide/updateTeamName`,
  async ({ teamID, newName }: { teamID: number; newName: string }) => {
    try {
      const token = localStorage.getItem(`token`);
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
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchNumberOfQueries = createAsyncThunk(
  `decide/fetchNumberOfQueries`,
  async ({
    industryID,
    firmID,
    period,
    marketID,
  }: {
    industryID: number;
    firmID: number;
    period: number;
    marketID: number;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/queries/${industryID}/${firmID}/${period}/${marketID}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const runOnlineQueries = createAsyncThunk(
  `decide/fetchOnlineQueries`,
  async ({
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
  }) => {
    try {
      const token = localStorage.getItem(`token`);
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
    } catch (error: any) {
      throw Error(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  `decide/createProject`,
  async ({
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
  }) => {
    try {
      const token = localStorage.getItem(`token`);
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
    } catch (error: any) {
      throw Error(error.message);
    }
  }
);

export const checkCostReduction = createAsyncThunk(
  `decide/checkCostReduction`,
  async (projectData: {
    feature_1: string;
    feature_2: string;
    feature_3: string;
    feature_4: string;
    feature_5: string;
  }) => {
    try {
      const queryParams = new URLSearchParams(projectData).toString();
      const url = `${API_URI}api/check_cost_reduction/?${queryParams}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      throw Error(error.message);
    }
  }
);

const initialState: decideProps = {
  marketingMix: { data: [], error: null, loading: false },
  queryResult: { data: null, error: null, loading: false },
  queryCount: { data: 0, error: null, loading: false },
  project: { data: null, error: null, loading: false },
  brand: { data: null, error: null, loading: false },
  brands: { data: [], error: null, loading: false },
  marketingMixById: { data: null, error: null, loading: false },
  marketResearchChoices: { data: [], error: null, loading: false },
  marketResearchChoice: {
    data: null,
    error: null,
    loading: false,
    success: false,
  },
  budget: { data: null, error: null, loading: false, success: false },
  decisionStatus: null,
  costReduction: { data: null, error: null, loading: false, success: false },
};

const decideSlice = createSlice({
  name: `decide`,
  initialState,
  reducers: {
    resetState: (state, action) => {
      state.marketResearchChoice.success = false;
      state.marketingMixById.success = false;
      state.brand.success = false;
      state.project.success = false;
      state.queryResult.success = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarketingMixData.pending, (state) => {
        state.marketingMix.loading = true;
        state.marketingMix.error = null;
      })
      .addCase(getMarketingMixData.fulfilled, (state, action) => {
        state.marketingMix.error = null;
        state.marketingMix.loading = false;
        state.marketingMix.data = action.payload;
      })
      .addCase(getMarketingMixData.rejected, (state, action) => {
        state.marketingMix.loading = false;
        state.marketingMix.error = action.error.message;
      })

      .addCase(updateTeamName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTeamName.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
      })
      .addCase(updateTeamName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchNumberOfQueries.pending, (state) => {
        state.queryCount.loading = true;
        state.queryCount.error = null;
      })
      .addCase(fetchNumberOfQueries.fulfilled, (state, action) => {
        state.queryCount.error = null;
        state.queryCount.loading = false;
        state.queryCount.data = action.payload.count;
      })
      .addCase(fetchNumberOfQueries.rejected, (state, action) => {
        state.queryCount.loading = false;
        state.queryCount.error = action.error.message;
      })

      .addCase(runOnlineQueries.pending, (state) => {
        state.queryResult.loading = true;
        state.queryResult.error = null;
      })
      .addCase(runOnlineQueries.fulfilled, (state, action) => {
        state.queryResult.error = null;
        state.queryResult.loading = false;
        state.queryResult.data = action.payload;
        state.queryCount.data = action.payload.runs;
      })
      .addCase(runOnlineQueries.rejected, (state, action) => {
        state.queryResult.loading = false;
        state.queryResult.error = action.error.message;
      })

      .addCase(createProject.pending, (state) => {
        state.queryResult.loading = true;
        state.queryResult.error = null;
        state.queryResult.success = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.queryResult.error = null;
        state.queryResult.loading = false;
        state.queryResult.data = action.payload;
        state.queryResult.success = true;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.queryResult.loading = false;
        state.queryResult.error = action.error.message;
      })

      .addCase(fetchProjectById.pending, (state) => {
        state.project.loading = true;
        state.project.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.project.error = null;
        state.project.loading = false;
        state.project.data = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.project.loading = false;
        state.project.error = action.error.message;
      })

      .addCase(partialUpdateProject.pending, (state) => {
        state.project.loading = true;
        state.project.error = null;
        state.project.success = false;
      })
      .addCase(partialUpdateProject.fulfilled, (state, action) => {
        state.project.error = null;
        state.project.loading = false;
        state.project.data = action.payload;
        state.project.success = true;
      })
      .addCase(partialUpdateProject.rejected, (state, action) => {
        state.project.loading = false;
        state.project.error = action.error.message;
      })

      .addCase(deleteProject.pending, (state) => {
        state.project.loading = true;
        state.project.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.project.error = null;
        state.project.loading = false;
        state.project.data = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.project.loading = false;
        state.project.error = action.error.message;
      })

      .addCase(fetchBrands.pending, (state) => {
        state.brands.loading = true;
        state.brands.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands.error = null;
        state.brands.loading = false;
        state.brands.data = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brands.loading = false;
        state.brands.error = action.error.message;
      })

      .addCase(submitBrand.pending, (state) => {
        state.brand.loading = true;
        state.brand.error = null;
        state.brand.success = false;
      })
      .addCase(submitBrand.fulfilled, (state, action) => {
        state.brand.error = null;
        state.brand.loading = false;
        state.brand.data = action.payload;
        state.brand.success = true;
      })
      .addCase(submitBrand.rejected, (state, action) => {
        state.brand.loading = false;
        state.brand.error = action.error.message;
      })
      .addCase(updateBrand.pending, (state) => {
        state.brand.loading = true;
        state.brand.error = null;
        state.brand.success = false;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.brand.error = null;
        state.brand.loading = false;
        state.brand.data = action.payload;
        state.brand.success = true;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.brand.loading = false;
        state.brand.error = action.error.message;
      })

      .addCase(fetchBrandById.pending, (state) => {
        state.brand.loading = true;
        state.brand.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.brand.error = null;
        state.brand.loading = false;
        state.brand.data = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.brand.loading = false;
        state.brand.error = action.error.message;
      })

      .addCase(fetchMarketingMixById.pending, (state) => {
        state.marketingMixById.loading = true;
        state.marketingMixById.error = null;
      })
      .addCase(fetchMarketingMixById.fulfilled, (state, action) => {
        state.marketingMixById.error = null;
        state.marketingMixById.loading = false;
        state.marketingMixById.data = action.payload;
      })
      .addCase(fetchMarketingMixById.rejected, (state, action) => {
        state.marketingMixById.loading = false;
        state.marketingMixById.error = action.error.message;
      })

      .addCase(partialUpdateMarketingMix.pending, (state) => {
        state.marketingMixById.loading = true;
        state.marketingMixById.error = null;
        state.marketingMixById.success = false;
      })
      .addCase(partialUpdateMarketingMix.fulfilled, (state, action) => {
        state.marketingMixById.error = null;
        state.marketingMixById.loading = false;
        state.marketingMixById.data = action.payload;
        state.marketingMixById.success = true;
      })
      .addCase(partialUpdateMarketingMix.rejected, (state, action) => {
        state.marketingMixById.loading = false;
        state.marketingMixById.error = action.error.message;
      })

      .addCase(fetchMarketResearchChoices.pending, (state) => {
        state.marketResearchChoices.loading = true;
        state.marketResearchChoices.error = null;
      })
      .addCase(fetchMarketResearchChoices.fulfilled, (state, action) => {
        state.marketResearchChoices.error = null;
        state.marketResearchChoices.loading = false;
        state.marketResearchChoices.data = action.payload;
      })
      .addCase(fetchMarketResearchChoices.rejected, (state, action) => {
        state.marketResearchChoices.loading = false;
        state.marketResearchChoices.error = action.error.message;
      })

      .addCase(updateMarketResearchChoice.pending, (state) => {
        state.marketResearchChoice.loading = true;
        state.marketResearchChoice.error = null;
        state.marketResearchChoice.success = false;
      })
      .addCase(updateMarketResearchChoice.fulfilled, (state, action) => {
        state.marketResearchChoice.error = null;
        state.marketResearchChoice.loading = false;
        state.marketResearchChoice.data = action.payload;
        state.marketResearchChoice.success = true;
      })
      .addCase(updateMarketResearchChoice.rejected, (state, action) => {
        state.marketResearchChoice.loading = false;
        state.marketResearchChoice.error = action.error.message;
      })

      .addCase(fetchBudgetDetails.pending, (state) => {
        state.budget.loading = true;
        state.budget.error = null;
      })
      .addCase(fetchBudgetDetails.fulfilled, (state, action) => {
        state.budget.error = null;
        state.budget.loading = false;
        state.budget.data = action.payload;
      })
      .addCase(fetchBudgetDetails.rejected, (state, action) => {
        state.budget.loading = false;
        state.budget.error = action.error.message;
      })

      .addCase(fetchDecisionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecisionStatus.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.decisionStatus = action.payload;
      })
      .addCase(fetchDecisionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(checkCostReduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCostReduction.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.costReduction = action.payload;
      })
      .addCase(checkCostReduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState } = decideSlice.actions;

export default decideSlice.reducer;
