import { createSlice } from '@reduxjs/toolkit';
import { userLogin, userInfoAuth } from "./authActions";

// initialize userToken from local storage
const userToken = localStorage.getItem('admin-web-token')
  ? localStorage.getItem('admin-web-token')
  : null;

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
} as any;


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state: any) => {
      localStorage.removeItem('admin-web-token'); // deletes token from storage
      localStorage.removeItem('restaurantId');
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(userLogin.pending, (state: any, { payload }: any) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(userLogin.fulfilled, (state: any, { payload }: any) => {
        state.loading = false;
        state.userInfo = payload?.info;
        state.userToken = payload.token;
        return state;
      })
      .addCase(userLogin.rejected, (state: any, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        return state;
      })
      builder
      .addCase(userInfoAuth.pending, (state: any, { payload }: any) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(userInfoAuth.fulfilled, (state: any, { payload }: any) => {
        state.loading = false;
        state.userInfo = payload?.info;
        return state;
      })
      .addCase(userInfoAuth.rejected, (state: any, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        return state;
      })
  }
} as any);

export const { logout } = authSlice.actions;
export default authSlice.reducer;