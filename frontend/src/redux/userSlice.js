import { createSlice } from "@reduxjs/toolkit";

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
