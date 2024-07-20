import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticate: false,
    user: {},
    error: null,
  },

  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.isAuthenticate = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticate = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticate = false;
      state.user = {};
      state.error = action.payload;
    },
    clearAllError: (state) => {
      state.error = null;
    },
  },
});

export default userSlice.reducer;

export const login = (email, password) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/login",
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    dispatch(userSlice.actions.loginSuccess(data.user));
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const clearAllUserErrors = () => async (dispatch) => {
  dispatch(userSlice.actions.clearAllError());
};
