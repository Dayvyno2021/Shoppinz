import { createSlice } from '@reduxjs/toolkit';

export type UserType = {
    _id?: string,
    firstName?: string,
    lastName?: string,
    email?:string,
    isAdmin?: boolean,
    verified?: boolean,
    phone?: string,
  }

export type UserInfo = {
  userInfo: UserType
}

// const initialState: UserInfo = window.localStorage.getItem('userInfo') ?
//   JSON.parse(window.localStorage.getItem('userInfo') || '') : null;

const initialState: UserInfo = {
  userInfo: localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo') || '') : null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      const expirationTime = new Date().getTime() * 60 * 60 * 24 * 1000;

      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      localStorage.setItem("expirationTime", JSON.stringify(expirationTime));
    },

    logout: (state) => {
      state.userInfo = {};
      localStorage.removeItem('userInfo');
      localStorage.clear();
    },

    verifyUser: (state, action) => {
      state.userInfo = action.payload;
    }
  }
})

export const { setCredentials, logout, verifyUser} = authSlice.actions;
export default authSlice.reducer;