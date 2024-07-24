import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice.js";
import forgotPasswordReducer from "./forgotPasswordSlice.js";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "portfolio",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});
