import { createSlice } from '@reduxjs/toolkit';

type UserInfo = {
  userInfo: {
    _id?: string,
    firstName?: string,
    lastName?: string,
    email?:string,
    isAdmin?: boolean,
    verified?: boolean
  }
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

      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },

    logout: (state) => {
      state.userInfo = {};
      localStorage.removeItem('userInfo');
    },

    verifyUser: (state, action) => {
      state.userInfo = action.payload;
    }
  }
})

export const { setCredentials, logout, verifyUser} = authSlice.actions;
export default authSlice.reducer;