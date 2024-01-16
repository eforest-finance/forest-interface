import { createSlice } from '@reduxjs/toolkit';
// import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'store/store';
export interface NightElfInfoType {
  address?: string;
  name?: string;
  pubKey?: string;
  appPermission?: any;
  aelfInstance?: any;
  aelfSilder?: any;
  chainId?: string;
  supportChains?: Chain[];
}

export const logoutInfo: NightElfInfoType = {
  address: undefined,
  name: undefined,
  pubKey: undefined,
  appPermission: undefined,
  aelfInstance: undefined,
  chainId: undefined,
  aelfSilder: undefined,
};

const initialState: NightElfInfoType & { installedNightElf: boolean } = {
  installedNightElf: typeof window !== 'undefined' && !!window?.NightElf,
};

// Actual Slice
export const nightElfInfoSlice = createSlice({
  name: 'nightElfInfo',
  initialState: {
    info: initialState,
  },
  reducers: {
    setNightElfInfo(state, action) {
      state.info = action.payload;
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

export const { setNightElfInfo } = nightElfInfoSlice.actions;

export const getNightElfInfo: (state: AppState) => NightElfInfoType & { installedNightElf: boolean } = (
  state: AppState,
) => state.nightElfInfo.info;

export default nightElfInfoSlice.reducer;
