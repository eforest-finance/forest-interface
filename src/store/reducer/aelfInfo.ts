import { createSlice } from '@reduxjs/toolkit';
import { IConfigItems } from 'api/types';
// import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'store/store';

export interface IAelfInfoState extends IConfigItems {
  [key: string]: any;
}

const initialState: IAelfInfoState = {};

// Actual Slice
export const aelfInfoSlice = createSlice({
  name: 'aelfInfo',
  initialState,
  reducers: {
    setAelfInfo(state, action) {
      state.aelfInfo = action.payload;
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

export const { setAelfInfo } = aelfInfoSlice.actions;

export const getAelfInfo = (state: AppState) => state.aelfInfo.aelfInfo;

export default aelfInfoSlice.reducer;
