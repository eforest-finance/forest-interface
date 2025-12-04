import { createSlice } from '@reduxjs/toolkit';
// import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';

export const logOutUserInfo: UserInfoType = {
  id: '',
  address: '',
  fullAddress: '',
  name: '',
  profileImage: '',
  bannerImage: '',
  email: '',
  twitter: '',
  instagram: '',
  token: '',
};

export const walletInfo: WalletInfoType = {
  address: '',
  publicKey: '',
  token: '',
};

// Actual Slice
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    userInfo: logOutUserInfo,
    walletInfo,
    balance: {
      main: 0,
      side: 0,
    },
    rate: 1,
  },
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setWalletInfo(state, action) {
      state.walletInfo = action.payload;
    },
    // setMainBalance(state, action) {
    //   state.balance.main = action.payload;
    // },
    // setSideBalance(state, action) {
    //   state.balance.side = action.payload;
    // },
    setRate(state, action) {
      state.rate = action.payload;
    },
    removeToken(state) {
      state.userInfo.token = '';
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.userInfo,
      };
    },
  },
});

export const { setUserInfo, setWalletInfo, removeToken, setRate } = userInfoSlice.actions;

export const getUserInfo = (state: any): UserInfoType => state.userInfo.userInfo;
// export const getUserBalance = (state: any): UserInfoType => state.userInfo.balance;
export const getRate = (state: any): UserInfoType => state.userInfo.rate;
export const getWalletInfo = (state: any): WalletInfoType => state.userInfo.walletInfo;

export default userInfoSlice.reducer;
