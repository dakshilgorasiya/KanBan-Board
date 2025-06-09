import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
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
      state.isLoggedIn = true;
    },
    removeUser: (state, action) => {
      state = initialState;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
