import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    token: "",
    error: "",
  },

  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.token = "";
      state.error = "";
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = "";
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.token = "";
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.token = state.token;
      state.error = "";
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.token = "";
      state.error = "";
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.token = state.token;
      state.error = action.payload;
    },
    clearAllError: (state) => {
      state.error = "";
    },
  },
});

export default userSlice.reducer;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.loginRequest());
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/login",
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    dispatch(
      userSlice.actions.loginSuccess({ user: data.user, token: data.token })
    );
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const Logout = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.logoutRequest);
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/user/logout",
      {
        withCredentials: true,
      }
    );
    console.log(data);
    dispatch(userSlice.actions.logoutSuccess());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const clearAllUserErrors = () => async (dispatch) => {
  dispatch(userSlice.actions.clearAllError());
};
