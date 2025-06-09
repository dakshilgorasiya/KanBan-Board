import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import taskReducer from "./features/taskSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export default store;
