import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { AppThunk } from "./store";
import { authProps, signupProps } from "types";
import {API_URI} from "myconstants"

type PropObject<T> = {  error?: string | null ; loading?: boolean; success?:boolean};

type Props<T> = {
    [K in keyof T]: PropObject<T[K]>;
};
export interface props extends Props<{
  signupState:{},
  loginState:{},
  confirmState:{},
}>{
  loading?: boolean;
  error?: string | null;
  token: string | null;
  message:{detail:string} | null;
  userName: string | null;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  userType: string | null;
  country: string | null;
  school: string | null;
  success: boolean;
  schools:{id:number,name:string,country_id:number}[],
  functions:{id:number,name:string}[],
}
 
export const checkAuthTimeout =
  (expirationTime: number): AppThunk =>
  (dispatch) => {
    setTimeout(() => {
      // Dispatch the logout action after the expiration time
      dispatch(logout());
    }, expirationTime * 1000);
  };

export const authCheckState = (): AppThunk => async (dispatch) => {
    const token = localStorage.getItem(`token`); 
    if (!token)  {
      dispatch(logout());
      return;
    }

    const storedExpirationDate = localStorage.getItem(`expirationDate`);
    if (storedExpirationDate) {
      const expirationDate = new Date(storedExpirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
        return;
      }

      try {
        // Simulate fetching additional user data using the stored token (replace with actual logic)
        const response = await axios.get(
          `${API_URI}rest-auth/user/`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        );

        const userName = response.data.first_name;
        const lastName = response.data.last_name;
        const firstName = response.data.first_name;
        const usertype = response.data.profile.user_type;
        const country = response.data.profile.country;
        const school = response.data.profile.school;

        dispatch({
          type: 'auth/authCheckStateSuccess',
        payload: {
          token,
          userName,
          lastName,
          firstName,
          usertype,
          country,
          school,
        },
      });

      
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } catch (error) {
        console.error(`Error fetching user data:`, error);
      }
    }

};

export const logout = createAsyncThunk(`auth/logout`, async () => {
  // Clear user data from state (replace with actual logic)
  try {
    const token = localStorage.getItem(`token`);
    const response = await axios.get(
      `${API_URI}rest-auth/logout/`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    localStorage.removeItem(`token`);
    localStorage.removeItem(`expirationDate`);
    localStorage.removeItem(`pak`);

  } catch (error: any) {
    // Handle error (e.g., network error, 401 Unauthorized)
    throw error.response.data;
  }
  return { message: `Logout successful!` };
});

export const login = createAsyncThunk(
  `auth/login`,
  async ({ email, password }: authProps,{rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${API_URI}rest-auth/login/`,
        { email, password }
      );
      const { key:token}  = response.data;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem(`token`, token ?? ``);
      localStorage.setItem(`expirationDate`, expirationDate.toISOString());

      checkAuthTimeout(3600);
      return {
        token,
        expirationDate: expirationDate.toISOString(), // Serialize expirationDate
      };
    } catch (error: any) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data)
    }
  }
);


export const signup = createAsyncThunk(
  `auth/signup`,
  async ({
    email,
    password1,
    password2,
    firstName,
    lastName,
    userType,
    school=``,
    phone=``
  }: signupProps,{rejectWithValue}) => {
    try {
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
    } catch (error: any) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data)
    }
  }
);



export const checkEmail = createAsyncThunk(
  `auth/checkEmail`,
  async ({ token }: { token: string }) => {
    try {
      const response = await axios.post(
        `${API_URI}account-confirm-email/`,
        {
          key: token,
        }
      );
      localStorage.setItem(`token`, response.data.token);
      return response;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const authChangePassword = createAsyncThunk(
  `auth/changePassword`,
  async ({
    password1,
    password2,
  }: {
    password1: string;
    password2: string;
  }) => {
    try {
      const token = localStorage.getItem(`token`);
      await axios.post(
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

      const response = await axios.get(
        `${API_URI}rest-auth/user/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      const username = response.data.first_name;
      const lastname = response.data.last_name;
      const firstname = response.data.first_name;
      const email = response.data.email;
      const usertype = response.data.profile.user_type;
      const country = response.data.profile.country;
      const school = response.data.profile.school;
      const expirationDate = new Date(new Date().getTime() + 36000 * 1000);
      localStorage.setItem(`token`, token ?? ``);
      localStorage.setItem(`expirationDate`, expirationDate.toISOString());
      checkAuthTimeout(3600);

      return {
        username,
        lastname,
        firstname,
        email,
        usertype,
        country,
        school,
        expirationDate,
      };
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const resetPassword = createAsyncThunk(
  `auth/resetPassword`,
  async ({ email }: { email: string }) => {
    try {
      const response = await axios.post(
        `${API_URI}rest-auth/password/reset/`,
        {
          email,
        }
      );

      return response;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  `auth/resetPasswordConfirm`,
  async ({
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
    try {
      const response = await axios.post(
        `${API_URI}rest-auth/password/reset/confirm/`,
        {
          uid,
          token,
          new_password1: password1,
          new_password2: password2,
        }
      );

      return response;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const quickAccess = createAsyncThunk(
  `auth/quickAccess`,
  async ({
    teamID,
    userID,
    password,
  }: {
    teamID: number;
    userID: number;
    password: string;
  }) => {
    const params = {
      team: teamID,
      user: userID,
      password: password,
    }
    try {
      const response = await axios.post(
        `${API_URI}api/participant-auth-token/`,
        {
          ...params
        }
      );

      const token = response.data.key;

      const response2 = await axios.get(
        `${API_URI}rest-auth/user/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      const username = response2.data.first_name;
      const lastname = response2.data.last_name;
      const firstname = response2.data.first_name;
      const email = response2.data.email;
      const usertype = response2.data.profile.user_type;
      const country = response2.data.profile.country;
      const school = response2.data.profile.school;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem(`token`, token ?? ``);
      localStorage.setItem(`expirationDate`, expirationDate.toISOString());
      checkAuthTimeout(3600);

      return {
        token,
        username,
        lastname,
        firstname,
        email,
        usertype,
        country,
        school,
      };
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchSchools = createAsyncThunk(
  `auth/fetchSchools`,
  async () => {
    try {
      const response  = await axios.get(`${API_URI}api/school/`);
        return response.data
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const fetchFunctions = createAsyncThunk(
  `auth/fetchFunctions`,
  async () => {
    try {
      const response  = await axios.get(`${API_URI}api/function/`);
        return response.data
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const confirmEmail = createAsyncThunk(
  'auth/confirmEmail',
  async ({key}:{key:string}) => {
    try {
      // Call the confirm email API function
      const response = await axios.post(`${API_URI}api/confirm-email/`, { key })
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

const initialState: props = {
  token: null,
  error: null,
  loading: false,
  userName: null,
  lastName: null,
  firstName: null,
  email: ``,
  userType: null,
  country: null,
  school: null,
  success: false,
  schools:[],
  functions:[],
  message:null,
  signupState:{},
  loginState:{},
  confirmState:{},
};


const authSlice = createSlice({
  name: `auth`,
  initialState,
  reducers: {
    authCheckStateSuccess: (state, action) => {
        state.token = action.payload.token
        state.userName = action.payload.userName;
        state.lastName = action.payload.lastName;
        state.firstName = action.payload.firstName;
        state.email = action.payload.email;
        state.userType = action.payload.usertype;
        state.country = action.payload.country;
        state.school = action.payload.school;
      },
      setSuccess: (state, action) => {
        state.success = action.payload;
      },

  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginState.loading = true;
        state.loginState.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.loginState.success = true;
        state.loginState.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginState.loading = false;
        state.loginState.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.signupState.loading = true;
        state.signupState.success = false;
      })
      .addCase(signup.fulfilled, (state,action) => {
        state.signupState.loading = false;
        state.signupState.success = true;
        state.message = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupState.loading = false;
        state.signupState.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(quickAccess.pending, (state) => {
        state.loading = true;
      })
      .addCase(quickAccess.fulfilled, (state,action) => {
        state.loading = false;
        state.userName = action.payload.username;
        state.lastName = action.payload.lastname;
        state.firstName = action.payload.firstname;
        state.email = action.payload.email;
        state.userType = action.payload.usertype;
        state.country = action.payload.country;
        state.school = action.payload.school;
        state.token = action.payload.token;
      })
      .addCase(quickAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchools.fulfilled, (state,action) => {
        state.loading = false;
        state.schools = action.payload;
       
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchFunctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFunctions.fulfilled, (state,action) => {
        state.loading = false;
        state.functions = action.payload;

      })
      .addCase(fetchFunctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(confirmEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmEmail.fulfilled, (state,action) => {
        state.loading = false;
        state.message =  action.payload;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSuccess } = authSlice.actions;

export default authSlice.reducer;
