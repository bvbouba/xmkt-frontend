import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "myconstants"

export const loadInfo = createAsyncThunk(
  `participant/loadInfo`,
  async ({ pak }: { pak?: string }) => {

    const  pass = pak || localStorage.getItem(`pak`); 
    if (!pass) {
      return {
        error:{
          message:`Please fill in the PAK field before retrieving data.`
        }
      }
    }
    try {
      const response = await axios.get(
        `${API_URI}api/participant_detail/${pass}/`
      );
      
      const userID = response.data.user;
      const teamID = response.data.team[0] ?? null;
      const teamName = response.data.team_name;
      const courseID = response.data.course;
      const courseCode = response.data.courseid;
      const industryName = response.data.industry_name;
      const industryID = response.data.industry_id;
      const activePeriod = response.data.active_period;
      const instructorID = response.data.instructor;
      const firmID = response.data.firm_id;
      
      localStorage.setItem('pak',pass);
      return {
        userID,
        teamID,
        teamName,
        courseID,
        industryName,
        industryID,
        activePeriod,
        instructorID,
        firmID,
        courseCode
      };
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const overtakeAccess = createAsyncThunk(
  `participant/overtakeAccess`,
  async ({ id }: { id: string }) => {
    try {
      const token = localStorage.getItem(`token`);
      await axios.patch(
        `${API_URI}api/online_user/${id}/`,
        {
          decide: false,
        },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      

    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const getErrorLog = createAsyncThunk(
  `participant/getErrorLog`,
  async ({ teamID,period }: { teamID: number,period:number }) => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(
        `${API_URI}api/analyze/errorlog/${teamID}/${period}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      
      return response.data

    } catch (error: any) {
      throw error.response.data;
    }
  }
);



export interface errorLogProps{
  id: number,
  period_id: number,
  team_id: number,
  team_name: string,
  brand_id: number,
  brand_name: string,
  message_id: number,
  is_active: boolean,
  title: string,
  content: string,
  title_fr: string,
  content_fr: string,
  title_en: string,
  content_en: string,
  by:string,
  severity:number
}

interface props {
    token: string | null;
    error?: string | null;
    loading: boolean;
    success: boolean;
    userID: number | null;
    teamID: number | null;
    teamName: string | null;
    courseID: number | null;
    courseCode: string | null;
    industryName: string | null;
    industryID: number | null;
    activePeriod: number | null;
    instructorID: number | null;
    firmID: number | null;
    ErrorLog:errorLogProps[] | [];
    selectedPeriod:number;
  }


const initialState: props = {
    token: null,
    error: null,
    loading: false,
    success: false,
    userID:  null,
    teamID:  null,
    teamName: null,
    courseID:  null,
    courseCode:null,
    industryName:  null,
    industryID:  null,
    activePeriod:  null,
    instructorID:  null,
    firmID:  null,
    ErrorLog:[],
    selectedPeriod:0
  };
  
  
  const participantSlice = createSlice({
    name: `participant`,
    initialState,
    reducers: {
      setInfo: (state, action) => {
        state.courseCode = action.payload.courseCode;
        state.courseID = action.payload.courseID;
        state.industryName = action.payload.industryName;
        state.teamName = action.payload.teamName;
        state.activePeriod = action.payload.activePeriod;
      },
      setSelectedPeriod: (state, action) => {
        state.selectedPeriod = action.payload;
    },
          
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadInfo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loadInfo.fulfilled, (state, action) => {
          state.error = null;
          state.loading = false;
          state.userID = action.payload.userID;
          state.teamName = action.payload.teamName;
          state.courseID = action.payload.courseID;
          state.courseCode = action.payload.courseCode;
          state.industryName = action.payload.industryName;
          state.industryID = action.payload.industryID;
          state.teamID = action.payload.teamID;
          state.activePeriod = action.payload.activePeriod;
          state.instructorID = action.payload.instructorID;
          state.firmID = action.payload.firmID;
          state.error = action.payload.error?.message
          state.selectedPeriod = action.payload.activePeriod-1;

        })
        .addCase(loadInfo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(overtakeAccess.pending, (state) => {
          state.loading = true;
        })
        .addCase(overtakeAccess.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(overtakeAccess.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(getErrorLog.pending, (state) => {
          state.loading = true;
        })
        .addCase(getErrorLog.fulfilled, (state,action) => {
          state.loading = false;
          state.ErrorLog = action.payload
        })
        .addCase(getErrorLog.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
    },
  });
  
  export const { setSelectedPeriod } = participantSlice.actions;


  export default participantSlice.reducer;
  