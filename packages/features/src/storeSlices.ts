import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URI} from "myconstants";

type PropObject<T> = { data: T;  error?: string | null ; loading?: boolean; success?:boolean};

type Props<T> = {
    [K in keyof T]: PropObject<T[K]>;
};

interface props extends Props <{
     course: {
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
      } | null,
      enroll:{}
}>{}

const initialState:props = {
  course: {data:null},
  enroll:{data:{}}
};

// Define the async thunk to fetch course details by courseid
export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async ({courseid}:{courseid:string}) => {
    try {
      const response = await axios.get(`${API_URI}api/courses/${courseid}/`);
      return response.data;
    } catch (error: any) {
        throw error.response.data;
      }
  }
);

export const registerForCourse = createAsyncThunk(
    'courses/registerForCourse',
    async ({courseCode}:{ courseCode:string }) => {
      try {
        const response = await axios.post(`${API_URI}api/course-participant/`, { course_code: courseCode });
        return response.data.message;
      } catch (error:any) {
        throw error.response.data;
      }
    }
  );

// Create the course slice
const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.course.loading = true;
        state.course.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.course.loading = false;
        state.course.success = true;
        state.course.data = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.course.loading = false;
        state.course.error = action.error.message;
      })

      .addCase(registerForCourse.pending, (state) => {
        state.enroll.loading = true;
        state.enroll.error = null;
      })
      .addCase(registerForCourse.fulfilled, (state, action) => {
        state.enroll.loading = false;
        state.enroll.success = true;
      })
      .addCase(registerForCourse.rejected, (state, action) => {
        state.enroll.loading = false;
        state.enroll.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const { } = courseSlice.actions;
export default courseSlice.reducer;