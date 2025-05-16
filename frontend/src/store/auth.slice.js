import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },

    updateUserData: (state, action) => {
      Object.assign(state.userData, action.payload);
    },
  },
});

export const { login, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
