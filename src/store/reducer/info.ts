import storages from 'storages';

import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: InfoStateType = {
  isMobile: false,
  isSmallScreen: false,
  supportChains: null,
  supportTokens: null,
  userInfo: null,
  theme: typeof localStorage !== 'undefined' && localStorage ? localStorage?.getItem(storages.theme) : 'light',
  sideChain: 'tDVW',
  loading: {
    open: false,
  },
  hasToken: false,
  elfRate: 0,
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setIsSmallScreen(state, action) {
      state.isSmallScreen = action.payload;
    },
    setSupportTokens(state, action) {
      state.supportTokens = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage?.setItem(storages.theme, action.payload);
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    },
    setShowDisconnectTip(state, action) {
      state.showDisconnectTip = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setHasToken(state, action) {
      state.hasToken = action.payload;
    },
    setElfRate(state, action) {
      state.elfRate = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const {
  setIsMobile,
  setIsSmallScreen,
  setSupportTokens,
  setTheme,
  setShowDisconnectTip,
  setLoading,
  setHasToken,
  setElfRate,
} = infoSlice.actions;

export const selectIsMobile = (state: AppState) => state.info.isMobile;
export const selectInfo = (state: AppState) => state.info;
export const selectSupportTokens = (state: AppState): Token | null => state.info.supportTokens;

export default infoSlice.reducer;
