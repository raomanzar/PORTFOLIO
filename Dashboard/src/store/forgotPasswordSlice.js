import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const forgotPassowrdSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    message: "",
    error: "",
  },
  reducers: {
    forgotPasswordLoading: (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.error = "";
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.message = "";
      state.error = action.payload;
    },
    resetPasswordLoading: (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = true;
      state.message = action.payload;
      state.error = "";
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.message = "";
      state.error = action.payload;
    },
    clearAllError: (state) => {
      state.error = "";
    },
  },
});

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPassowrdSlice.actions.forgotPasswordLoading());
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/password/forgot",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    if (data) {
      dispatch(forgotPassowrdSlice.actions.forgotPasswordSuccess(data.message));
      toast.success(data.message);
    }
  } catch (error) {
    dispatch(
      forgotPassowrdSlice.actions.forgotPasswordFailure(
        error.response.data.message
      )
    );
  }
};

export const resetPassword =
  (token, password, confirmPassword) => async (dispatch) => {
    try {
      dispatch(forgotPassowrdSlice.actions.resetPasswordLoading());
      const { data } = await axios.patch(
        `http://localhost:4000/api/v1/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data) {
        dispatch(
          forgotPassowrdSlice.actions.resetPasswordSuccess(data.message)
        );
        toast.success(data.message);
      }
    } catch (error) {
      dispatch(
        forgotPassowrdSlice.actions.resetPasswordFailure(
          error.response.data.message
        )
      );
    }
  };
export const clearAllForgotPasswordErrors = () => (dispatch) => {
  dispatch(forgotPassowrdSlice.actions.clearAllError());
};

export default forgotPassowrdSlice.reducer;
