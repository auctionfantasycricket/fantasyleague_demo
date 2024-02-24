import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userProfile: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userProfile = action.payload;
    },
    setLogoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.userProfile = null;
    },
  },
});

export const { setLoginSuccess, setLogoutSuccess } = loginSlice.actions;

export default loginSlice.reducer;
