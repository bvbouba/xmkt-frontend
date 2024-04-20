import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { AppThunk } from "../store";
import { authProps, signupProps } from "@/lib/type";

interface props {
  token: string | null;
  error?: any;
  loading: boolean;
  userName: string | null;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  userType: string | null;
  country: string | null;
  school: string | null;
  success: boolean;
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
    const token = localStorage.getItem("token"); 
    if (!token)  {
      dispatch(logout());
      return;
    }

    const storedExpirationDate = localStorage.getItem("expirationDate");
    if (storedExpirationDate) {
      const expirationDate = new Date(storedExpirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
        return;
      }

      try {
        // Simulate fetching additional user data using the stored token (replace with actual logic)
        const response = await axios.get(
          "http://127.0.0.1:8000/rest-auth/user/",
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
        console.error("Error fetching user data:", error);
      }
    }

};

export const logout = createAsyncThunk("auth/logout", async () => {
  // Clear user data from state (replace with actual logic)
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://127.0.0.1:8000/rest-auth/logout/",
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("pak");

  } catch (error: any) {
    // Handle error (e.g., network error, 401 Unauthorized)
    throw error.response.data;
  }
  return { message: "Logout successful!" };
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: authProps) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/rest-auth/login/",
        { email, password }
      );
      const { token } = response.data;

      const additionalDataResponse = await axios.get(
        "http://127.0.0.1:8000/rest-auth/user/",
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      const username = additionalDataResponse.data.first_name;
      const lastname = additionalDataResponse.data.last_name;
      const firstname = additionalDataResponse.data.first_name;
      const usertype = additionalDataResponse.data.profile.user_type;
      const country = additionalDataResponse.data.profile.country;
      const school = additionalDataResponse.data.profile.school;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem("token", token ?? "");
      localStorage.setItem("expirationDate", expirationDate.toISOString());

      checkAuthTimeout(3600);

      return {
        token,
        username,
        lastname,
        email,
        firstname,
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

export const signup = createAsyncThunk(
  "auth/signup",
  async ({
    email,
    password1,
    password2,
    firstName,
    lastName,
  }: signupProps,{rejectWithValue}) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/rest-auth/registration/",
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
            school:null,
            country:1,
            phone: null,
            objective: "",
            user_type: 2,
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
  "auth/checkEmail",
  async ({ token }: { token: string }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account-confirm-email/",
        {
          key: token,
        }
      );
      localStorage.setItem("token", response.data.token);
      return response;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const authChangePassword = createAsyncThunk(
  "auth/changePassword",
  async ({
    password1,
    password2,
  }: {
    password1: string;
    password2: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/rest-auth/password/change/",
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
        "http://127.0.0.1:8000/rest-auth/user/",
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
      localStorage.setItem("token", token ?? "");
      localStorage.setItem("expirationDate", expirationDate.toISOString());
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
  "auth/resetPassword",
  async ({ email }: { email: string }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/rest-auth/password/reset/",
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
  "auth/resetPasswordConfirm",
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
        "http://127.0.0.1:8000/rest-auth/password/reset/confirm/",
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
  "auth/quickAccess",
  async ({
    teamID,
    userID,
    password,
  }: {
    teamID: number;
    userID: number;
    password: string;
  },{rejectWithValue}) => {
    const params = {
      team: teamID,
      user: userID,
      password: password,
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/participant-auth-token/",
        {
          ...params
        }
      );

      const token = response.data.key;

      const response2 = await axios.get(
        "http://127.0.0.1:8000/rest-auth/user/",
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
      localStorage.setItem("token", token ?? "");
      localStorage.setItem("expirationDate", expirationDate.toISOString());
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
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data)
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
  email: "",
  userType: null,
  country: null,
  school: null,
  success: false,
};


const authSlice = createSlice({
  name: "auth",
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
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.error = null;
        state.loading = false;
        state.userName = action.payload.username;
        state.lastName = action.payload.lastname;
        state.firstName = action.payload.firstname;
        state.email = action.payload.email;
        state.userType = action.payload.usertype;
        state.country = action.payload.country;
        state.school = action.payload.school;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
      })
  },
});

export const { setSuccess } = authSlice.actions;

export default authSlice.reducer;
