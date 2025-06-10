import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
  token: "",
  isAdmin: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    removeUser: (state, action) => {
      state.userName = "";
      state.email = "";
      state.token = "";
      state.isAdmin = false;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
