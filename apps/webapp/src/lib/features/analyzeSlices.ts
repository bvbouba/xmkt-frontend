import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { analyzeProps } from "../type";

export const getFirmData = createAsyncThunk(
  "analyze/getFirmData",
  async ({ firmID,industryID }: { firmID: number,industryID:number }) => {
    try {
      const token = localStorage.getItem("token");
      const response  = await axios.get(`http://127.0.0.1:8000/api/analyze/firm/${ industryID }/${firmID}`,
      {
        headers: {
                 'Authorization': `token ${token}`
                 }
      });

        return response.data

    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const getBrandData = createAsyncThunk(
    "analyze/getBrandData",
    async ({ firmID,industryID }: { firmID: number,industryID:number }) => {
      try {
        const token = localStorage.getItem("token");
        const response  = await axios.get(`http://127.0.0.1:8000/api/analyze/brand/${ industryID }/${firmID}`,
        {
          headers: {
                   'Authorization': `token ${token}`
                   }
        });
  
          return response.data
  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getProjectData = createAsyncThunk(
    "analyze/getProjectData",
    async ({ firmID,industryID,period }: { firmID: number,industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/decide/project/now/${industryID}/${firmID}/${period}/`,
      {
        headers: {
                 'Authorization': `token ${token}`
                 }
      })
  const response1 = await axios.get(`http://127.0.0.1:8000/api/decide/project/past/${industryID}/${firmID}/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })
    const response2 = await axios.get(`http://127.0.0.1:8000/api/decide/project/shelved/${industryID}/${firmID}/${period}/`,
      {
        headers: {
                 'Authorization': `token ${token}`
                 }
      })

      const response3 = await axios.get(`http://127.0.0.1:8000/api/decide/project/going/${industryID}/${firmID}/${period}/`,
        {
          headers: {
                   'Authorization': `token ${token}`
                   }
        })

          return {
            now:response.data,
                past:response1.data,
                shelved:response2.data,
                going:response3.data,
            }
  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getFeaturesData = createAsyncThunk(
    "analyze/getFeaturesData",
    async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/features/1/`)
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const fetchDimensions = createAsyncThunk(
    "analyze/fetchDimensions",
    async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/dimensions/`)
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getMarketsData = createAsyncThunk(
    "analyze/getMarketsData",
    async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/markets/`)
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getChannelsData = createAsyncThunk(
    "analyze/getChannelsData",
    async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/channels/`)
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getSegmentsData = createAsyncThunk(
    "analyze/getSegmentsData",
    async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/segments/`)
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getProjectAllData = createAsyncThunk(
    "analyze/getProjectAllData",
    async ({ firmID,industryID,period }: { firmID: number,industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/decide/project/all/${industryID}/${firmID}/${period}/`,
        {
          headers: {
                  'Authorization': `token ${token}`
                  }
        })
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getOnlineQueryInfoData = createAsyncThunk(
    "analyze/getOnlineQueryInfoData",
    async ({ firmID,industryID,period }: { firmID: number,industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/decide/onlinequery/${industryID}/${firmID}/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getIndustryInfoData = createAsyncThunk(
    "analyze/getIndustryInfoData",
    async ({ industryID }: { industryID:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/industry_information/${ industryID }/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })   
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getSalesData = createAsyncThunk(
    "analyze/getSalesData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/analyze/sales/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getBrandAwarenessData = createAsyncThunk(
    "analyze/getBrandAwarenessData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/brand_awareness/${ industryID }/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getPurchaseIntentData = createAsyncThunk(
    "analyze/getPurchaseIntentData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/purchase_intent/${ industryID }/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })    
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getShoppingHabitData = createAsyncThunk(
    "analyze/getShoppingHabitData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/shopping_habit/${ industryID }/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getMarketDemandData = createAsyncThunk(
    "analyze/getMarketDemandData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/market_demand/${ industryID }/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    })           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getDistributionCoverageData = createAsyncThunk(
    "analyze/getDistributionCoverageData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/distribution_coverage/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getSemanticScalesData = createAsyncThunk(
    "analyze/getSemanticScalesData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/semantic_scales/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getSemanticIdealsData = createAsyncThunk(
    "analyze/getSemanticIdealsData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/semantic_ideals/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getDimensionalScalesData = createAsyncThunk(
    "analyze/getDimensionalScalesData",
    async ({ industryID,period }: { industryID:number,period: number}) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/dimensional_scales/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getDimensionalIdealsData = createAsyncThunk(
    "analyze/getDimensionalIdealsData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/dimensional_ideals/${ industryID }/${period}`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )           
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getForecastsData = createAsyncThunk(
    "analyze/getForecastsData",
    async ({ industryID,period }: { industryID:number,period:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/market_forecast/${industryID}/${period}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )       
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  export const getUtilitiesData = createAsyncThunk(
    "analyze/getUtilitiesData",
    async ({ courseID }: { courseID:number }) => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/utilities/${courseID}/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )         
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );


  export const getLevelsData = createAsyncThunk(
    "analyze/getLevelsData",
    async () => {
      try {
        const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:8000/api/levels/`,
    {
      headers: {
               'Authorization': `token ${token}`
               }
    }
  )          
          return response.data  
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  const initialState: analyzeProps = {
    firm: { data: [], error: null, loading: false },
    brand: { data: [], error: null, loading: false },
    projects: { data: {}, error: null, loading: false },
    features: { data: [], error: null, loading: false },
    markets: { data: [], error: null, loading: false },
    channels: { data: [], error: null, loading: false },
    segments: { data: [], error: null, loading: false },
    allProjects: { data: [], error: null, loading: false },
    onlineQuery: { data: [], error: null, loading: false },
    industryInfo: { data: [], error: null, loading: false },
    sales: { data: [], error: null, loading: false },
    brandAwareness: { data: [], error: null, loading: false },
    purchaseIntent: { data: [], error: null, loading: false },
    shoppingHabit: { data: [], error: null, loading: false },
    marketDemand: { data: [], error: null, loading: false },
    distributionCoverage: { data: [], error: null, loading: false },
    semanticScales: { data: [], error: null, loading: false },
    semanticIdeals: { data: [], error: null, loading: false },
    dimensionScales: { data: [], error: null, loading: false },
    dimensionIdeals: { data: [], error: null, loading: false },
    forecats: { data: [], error: null, loading: false },
    utilities: { data: [], error: null, loading: false },
    levels: { data: [], error: null, loading: false },
    dimensions: { data: [], error: null, loading: false },
};
  
  
  const analyzeSlice = createSlice({
    name: "analyze",
    initialState,
    reducers: {          
    },
    extraReducers: (builder) => {
      builder
        .addCase(getFirmData.pending, (state) => {
          state.firm.loading = true;
          state.firm.error = null;
        })
        .addCase(getFirmData.fulfilled, (state, action) => {
          state.firm.error = null;
          state.firm.loading = false;
          state.firm.data = action.payload;
          
        })
        .addCase(getFirmData.rejected, (state, action) => {
          state.firm.loading = false;
          state.firm.error = action.error.message;
        })
        .addCase(getBrandData.pending, (state) => {
            state.brand.loading = true;
            state.brand.error = null;
          })
          .addCase(getBrandData.fulfilled, (state, action) => {
            state.brand.error = null;
            state.brand.loading = false;
            state.brand.data = action.payload;
            
          })
          .addCase(getBrandData.rejected, (state, action) => {
            state.brand.loading = false;
            state.brand.error = action.error.message;
          })
          .addCase(getProjectData.pending, (state) => {
            state.projects.loading = true;
            state.projects.error = null;
          })
          .addCase(getProjectData.fulfilled, (state, action) => {
            state.projects.error = null;
            state.projects.loading = false;
            state.projects.data = action.payload;
            
          })
          .addCase(getProjectData.rejected, (state, action) => {
            state.projects.loading = false;
            state.projects.error = action.error.message;
          })
          .addCase(getFeaturesData.pending, (state) => {
            state.features.loading = true;
            state.features.error = null;
          })
          .addCase(getFeaturesData.fulfilled, (state, action) => {
            state.features.error = null;
            state.features.loading = false;
            state.features.data = action.payload;
            
          })
          .addCase(getFeaturesData.rejected, (state, action) => {
            state.features.loading = false;
            state.features.error = action.error.message;
          })
          .addCase(getProjectAllData.pending, (state) => {
            state.allProjects.loading = true;
            state.allProjects.error = null;
          })
          .addCase(getProjectAllData.fulfilled, (state, action) => {
            state.allProjects.error = null;
            state.allProjects.loading = false;
            state.allProjects.data = action.payload
            
          })
          .addCase(getProjectAllData.rejected, (state, action) => {
            state.allProjects.loading = false;
            state.allProjects.error = action.error.message;
          })
          .addCase(getOnlineQueryInfoData.pending, (state) => {
            state.onlineQuery.loading = true;
            state.onlineQuery.error = null;
          })
          .addCase(getOnlineQueryInfoData.fulfilled, (state, action) => {
            state.onlineQuery.error = null;
            state.onlineQuery.loading = false;
            state.onlineQuery.data = action.payload
            
          })
          .addCase(getOnlineQueryInfoData.rejected, (state, action) => {
            state.onlineQuery.loading = false;
            state.onlineQuery.error = action.error.message;
          })

          .addCase(getMarketsData.pending, (state) => {
            state.markets.loading = true;
            state.markets.error = null;
          })
          .addCase(getMarketsData.fulfilled, (state, action) => {
            state.markets.error = null;
            state.markets.loading = false;
            state.markets.data = action.payload
            
          })
          .addCase(getMarketsData.rejected, (state, action) => {
            state.markets.loading = false;
            state.markets.error = action.error.message;
          })
          .addCase(getSegmentsData.pending, (state) => {
            state.segments.loading = true;
            state.segments.error = null;
          })
          .addCase(getSegmentsData.fulfilled, (state, action) => {
            state.segments.error = null;
            state.segments.loading = false;
            state.segments.data = action.payload
            
          })
          .addCase(getSegmentsData.rejected, (state, action) => {
            state.segments.loading = false;
            state.segments.error = action.error.message;
          })
          .addCase(getChannelsData.pending, (state) => {
            state.channels.loading = true;
            state.channels.error = null;
          })
          .addCase(getChannelsData.fulfilled, (state, action) => {
            state.channels.error = null;
            state.channels.loading = false;
            state.channels.data = action.payload
            
          })
          .addCase(getChannelsData.rejected, (state, action) => {
            state.channels.loading = false;
            state.channels.error = action.error.message;
          })

          .addCase(getIndustryInfoData.pending, (state) => {
            state.industryInfo.loading = true;
            state.industryInfo.error = null;
          })
          .addCase(getIndustryInfoData.fulfilled, (state, action) => {
            state.industryInfo.error = null;
            state.industryInfo.loading = false;
            state.industryInfo.data = action.payload
            
          })
          .addCase(getIndustryInfoData.rejected, (state, action) => {
            state.industryInfo.loading = false;
            state.industryInfo.error = action.error.message;
          })

          .addCase(getSalesData.pending, (state) => {
            state.sales.loading = true;
            state.sales.error = null;
          })
          .addCase(getSalesData.fulfilled, (state, action) => {
            state.sales.error = null;
            state.sales.loading = false;
            state.sales.data = action.payload
            
          })
          .addCase(getSalesData.rejected, (state, action) => {
            state.sales.loading = false;
            state.sales.error = action.error.message;
          })

          .addCase(getBrandAwarenessData.pending, (state) => {
            state.brandAwareness.loading = true;
            state.brandAwareness.error = null;
          })
          .addCase(getBrandAwarenessData.fulfilled, (state, action) => {
            state.brandAwareness.error = null;
            state.brandAwareness.loading = false;
            state.brandAwareness.data = action.payload
            
          })
          .addCase(getBrandAwarenessData.rejected, (state, action) => {
            state.brandAwareness.loading = false;
            state.brandAwareness.error = action.error.message;
          })

          .addCase(getPurchaseIntentData.pending, (state) => {
            state.purchaseIntent.loading = true;
            state.purchaseIntent.error = null;
          })
          .addCase(getPurchaseIntentData.fulfilled, (state, action) => {
            state.purchaseIntent.error = null;
            state.purchaseIntent.loading = false;
            state.purchaseIntent.data = action.payload
            
          })
          .addCase(getPurchaseIntentData.rejected, (state, action) => {
            state.purchaseIntent.loading = false;
            state.purchaseIntent.error = action.error.message;
          })

          .addCase(getShoppingHabitData.pending, (state) => {
            state.shoppingHabit.loading = true;
            state.shoppingHabit.error = null;
          })
          .addCase(getShoppingHabitData.fulfilled, (state, action) => {
            state.shoppingHabit.error = null;
            state.shoppingHabit.loading = false;
            state.shoppingHabit.data = action.payload
            
          })
          .addCase(getShoppingHabitData.rejected, (state, action) => {
            state.shoppingHabit.loading = false;
            state.shoppingHabit.error = action.error.message;
          })

          .addCase(getMarketDemandData.pending, (state) => {
            state.marketDemand.loading = true;
            state.marketDemand.error = null;
          })
          .addCase(getMarketDemandData.fulfilled, (state, action) => {
            state.marketDemand.error = null;
            state.marketDemand.loading = false;
            state.marketDemand.data = action.payload
            
          })
          .addCase(getMarketDemandData.rejected, (state, action) => {
            state.marketDemand.loading = false;
            state.marketDemand.error = action.error.message;
          })

          .addCase(getDistributionCoverageData.pending, (state) => {
            state.distributionCoverage.loading = true;
            state.distributionCoverage.error = null;
          })
          .addCase(getDistributionCoverageData.fulfilled, (state, action) => {
            state.distributionCoverage.error = null;
            state.distributionCoverage.loading = false;
            state.distributionCoverage.data = action.payload
            
          })
          .addCase(getDistributionCoverageData.rejected, (state, action) => {
            state.distributionCoverage.loading = false;
            state.distributionCoverage.error = action.error.message;
          })

          .addCase(getSemanticScalesData.pending, (state) => {
            state.semanticScales.loading = true;
            state.semanticScales.error = null;
          })
          .addCase(getSemanticScalesData.fulfilled, (state, action) => {
            state.semanticScales.error = null;
            state.semanticScales.loading = false;
            state.semanticScales.data = action.payload
            
          })
          .addCase(getSemanticScalesData.rejected, (state, action) => {
            state.semanticScales.loading = false;
            state.semanticScales.error = action.error.message;
          })

          .addCase(getSemanticIdealsData.pending, (state) => {
            state.semanticIdeals.loading = true;
            state.semanticIdeals.error = null;
          })
          .addCase(getSemanticIdealsData.fulfilled, (state, action) => {
            state.semanticIdeals.error = null;
            state.semanticIdeals.loading = false;
            state.semanticIdeals.data = action.payload
            
          })
          .addCase(getSemanticIdealsData.rejected, (state, action) => {
            state.semanticIdeals.loading = false;
            state.semanticIdeals.error = action.error.message;
          })

          .addCase(getDimensionalScalesData.pending, (state) => {
            state.dimensionScales.loading = true;
            state.dimensionScales.error = null;
          })
          .addCase(getDimensionalScalesData.fulfilled, (state, action) => {
            state.dimensionScales.error = null;
            state.dimensionScales.loading = false;
            state.dimensionScales.data = action.payload
            
          })
          .addCase(getDimensionalScalesData.rejected, (state, action) => {
            state.dimensionScales.loading = false;
            state.dimensionScales.error = action.error.message;
          })

          .addCase(getDimensionalIdealsData.pending, (state) => {
            state.dimensionIdeals.loading = true;
            state.dimensionIdeals.error = null;
          })
          .addCase(getDimensionalIdealsData.fulfilled, (state, action) => {
            state.dimensionIdeals.error = null;
            state.dimensionIdeals.loading = false;
            state.dimensionIdeals.data = action.payload
            
          })
          .addCase(getDimensionalIdealsData.rejected, (state, action) => {
            state.dimensionIdeals.loading = false;
            state.dimensionIdeals.error = action.error.message;
          })

          .addCase(getForecastsData.pending, (state) => {
            state.forecats.loading = true;
            state.forecats.error = null;
          })
          .addCase(getForecastsData.fulfilled, (state, action) => {
            state.forecats.error = null;
            state.forecats.loading = false;
            state.forecats.data = action.payload
            
          })
          .addCase(getForecastsData.rejected, (state, action) => {
            state.forecats.loading = false;
            state.forecats.error = action.error.message;
          })


          .addCase(getUtilitiesData.pending, (state) => {
            state.utilities.loading = true;
            state.utilities.error = null;
          })
          .addCase(getUtilitiesData.fulfilled, (state, action) => {
            state.utilities.error = null;
            state.utilities.loading = false;
            state.utilities.data = action.payload
            
          })
          .addCase(getUtilitiesData.rejected, (state, action) => {
            state.utilities.loading = false;
            state.utilities.error = action.error.message;
          })

          .addCase(getLevelsData.pending, (state) => {
            state.levels.loading = true;
            state.levels.error = null;
          })
          .addCase(getLevelsData.fulfilled, (state, action) => {
            state.levels.error = null;
            state.levels.loading = false;
            state.levels.data = action.payload
            
          })
          .addCase(getLevelsData.rejected, (state, action) => {
            state.levels.loading = false;
            state.levels.error = action.error.message;
          })

          .addCase(fetchDimensions.pending, (state) => {
            state.dimensions.loading = true;
            state.dimensions.error = null;
          })
          .addCase(fetchDimensions.fulfilled, (state, action) => {
            state.dimensions.error = null;
            state.dimensions.loading = false;
            state.dimensions.data = action.payload
            
          })
          .addCase(fetchDimensions.rejected, (state, action) => {
            state.dimensions.loading = false;
            state.dimensions.error = action.error.message;
          })
    },
  });
  
  export default analyzeSlice.reducer;
  
  